import { useState, useEffect } from "react";
import { render } from "react-dom";
import { useParams } from 'react-router-dom'
import { ethers } from "ethers";
import { isAddress } from "@ethersproject/address";
import { isValidName } from "@ethersproject/hash";
import CollectionInfo from "./CollectionInfo";
import { getTokenMetadata } from '../../utils/getTokenMetadata';
import { prepareRequestURL } from '../../utils/prepareRequestUrl'
import { sendRequests } from '../../utils/sendRequests'
import { getCollectionData } from '../../utils/ComputeData';
import RankingTable from '../RankingTable';
import PropertiesTable from '../PropertiesTable'
import './Collection.css'


function Collection() {

    //URL parameter
    const { contractAddress } = useParams();


    //App states
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    //Metadata states
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [tokenURI, setTokenURI] = useState("");
    const [totalSupply, setTotalSupply] = useState(0);

    //Data states
    const [rarityData, setRarityData] = useState();
    const [nftDataArray, setNftDataArray] = useState([])
    const [progress, setProgress] = useState('1');

    useEffect(() => {

        if (isAddress(contractAddress)) {
            setIsValid(true);
        }
        else {
            return;
        }
        const asyncTokenMetadata = async () => {
            const tokenMetadata = await getTokenMetadata(contractAddress);
            setName(tokenMetadata.name);
            setSymbol(tokenMetadata.symbol);
            setTotalSupply(Number(tokenMetadata.totalSupply));
            setTokenURI(tokenMetadata.tokenURI);

        }
        asyncTokenMetadata();

    }, []);

    useEffect(() => {
        setIsLoading(false);
        let metadata_array = [];
        let analyzed_size = 0;
        const asyncTokenURIData = async () => {
            let res;
            const requestURL = await prepareRequestURL(tokenURI);
            let tokenIDs = Array.from(Array(totalSupply + 1).keys())
            tokenIDs.shift();
            do {
                res = prepareBatchToSend(tokenIDs);
                let new_data = await sendRequests(requestURL, res.tokenIDs);
                new_data.forEach((data) => {
                    metadata_array.push(data)
                });
                analyzed_size = totalSupply - res.remaining;
                const { rarity_data, nftDataArray } = getCollectionData(metadata_array, analyzed_size);

                setProgress(100 - (res.remaining / totalSupply) * 100);
                setRarityData(rarity_data);
                setNftDataArray(nftDataArray);

            } while (res.remaining != 0)

        }


        const prepareBatchToSend = (tokenIDs) => {
            const BATCH_SIZE =100;
            let remaining;
            if (tokenIDs.length <= BATCH_SIZE) {
                remaining = 0;
                return { tokenIDs: tokenIDs, remaining };
            }
            const newBatch = tokenIDs.slice(0, BATCH_SIZE-1);
            tokenIDs.splice(0, BATCH_SIZE-1);
            remaining = tokenIDs.length;
            return { tokenIDs: newBatch, remaining };
        }


        if (tokenURI !== "" && totalSupply !== 0) {
            asyncTokenURIData();
        }

    }, [tokenURI, totalSupply])


    const renderContent = () => {
        if (!isValid) {
            return (<h1>Not a valid contract address</h1>)
        }
        else if (isLoading) {
            return (<h1>Loading data, please wait</h1>)
        }
        else {
            return (
                <div>

                    <CollectionInfo contractAddress={contractAddress} name={name} symbol={symbol} tokenURI={tokenURI} />
                    <p>{progress}</p>
                    <div className="twoTables">
                        {
                            rarityData !== undefined && rarityData.traits_types.map((property) => {
                                return (
                                    <PropertiesTable property={property}></PropertiesTable>
                                );
                            })
                        }
                    </div>
                    <RankingTable nftDataArray={nftDataArray} contractAddress={contractAddress} />

                </div>
            )
        }

    }

    return (
        <div>
            {renderContent()}

        </div>
    )
}

export default Collection;