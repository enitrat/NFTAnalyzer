import { useState, useEffect } from "react";
import { render } from "react-dom";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { isAddress } from "@ethersproject/address";
import { isValidName } from "@ethersproject/hash";
import CollectionInfo from "../CollectionInfo";
import { getTokenMetadata } from "../../utils/getTokenMetadata";
import { prepareRequestURL } from "../../utils/prepareRequestUrl";
import { sendRequests } from "../../utils/sendRequests";
import { ComputeCollectionData } from "../../utils/ComputeData";
import RankingTable from "../RankingTable";
import PropertiesTable from "../PropertiesTable";
import { Spinner, ProgressBar } from "react-bootstrap";
import HomeButton from "../HomeButton";
import LoadingData from "../LoadingData";

import "./Collection.css";

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
  const [nftDataArray, setNftDataArray] = useState([]);
  const [progress, setProgress] = useState("1");

  //Handling errors
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isAddress(contractAddress)) {
      setIsValid(true);
    } else {
      return;
    }
    const asyncTokenMetadata = async () => {
      try {
        const tokenMetadata = await getTokenMetadata(contractAddress);
        console.log(tokenMetadata);
        if (tokenMetadata.tokenURI === undefined) {
          setError(true);
          return;
        }
        if (tokenMetadata.totalSupply === undefined) {
          setTotalSupply(10000);
        } else {
          setTotalSupply(Number(tokenMetadata.totalSupply));
        }

        setName(tokenMetadata.name);
        setSymbol(tokenMetadata.symbol);
        setTokenURI(tokenMetadata.tokenURI);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };
    asyncTokenMetadata();
  }, []);

  useEffect(() => {
    let metadata_array = [];
    let analyzed_size = 0;
    let failed = 0;

    const asyncTokenURIData = async () => {
      let res;
      const requestURL = await prepareRequestURL(tokenURI);
      console.log(totalSupply);
      let tokenIDs = Array.from(Array(totalSupply + 1).keys());
      console.log(tokenIDs);
      tokenIDs.shift();
      do {
        res = prepareBatchToSend(tokenIDs);
        let { new_data, failedInRequest } = await sendRequests(
          requestURL,
          res.tokenIDs
        );
        failed += failedInRequest;
        new_data.forEach((data) => {
          metadata_array.push(data);
        });
        analyzed_size = totalSupply - res.remaining - failed;
        const { rarity_data, nftDataArray } = ComputeCollectionData(
          metadata_array,
          analyzed_size
        );

        setProgress(100 - (res.remaining / totalSupply) * 100);
        setRarityData(rarity_data);
        setNftDataArray(nftDataArray);
        setIsLoading(false);
      } while (res.remaining != 0);
    };

    const prepareBatchToSend = (tokenIDs) => {
      const BATCH_SIZE = 200;
      let remaining;
      if (tokenIDs.length <= BATCH_SIZE) {
        remaining = 0;
        return { tokenIDs: tokenIDs, remaining };
      }
      const newBatch = tokenIDs.slice(0, BATCH_SIZE - 1);
      tokenIDs.splice(0, BATCH_SIZE - 1);
      remaining = tokenIDs.length;
      return { tokenIDs: newBatch, remaining };
    };
    if (tokenURI !== "" && totalSupply !== 0) {
      try {
        console.log("hey");
        asyncTokenURIData();
      } catch (err) {
        console.log(err);
        setError(true);
      }
    }
  }, [tokenURI, totalSupply]);

  const renderContent = () => {
    if (!isValid) {
      return <h1>Not a valid contract address</h1>;
    } else if (error) {
      return <h1>There was an error fetching the NFT data</h1>;
    } else if (isLoading) {
      return <LoadingData />;
    } else {
      return (
        <div>
          <HomeButton />
          <CollectionInfo
            contractAddress={contractAddress}
            name={name}
            symbol={symbol}
            tokenURI={tokenURI}
          />
          <div className="progressBarWrapper">
            <ProgressBar
              variant="success"
              animated
              now={progress}
              label={`${progress}%`}
            />
          </div>
          <RankingTable
            properties={rarityData.traits_types}
            nftDataArray={nftDataArray}
            contractAddress={contractAddress}
          />

          <div className="twoTables">
            {rarityData !== undefined &&
              rarityData.traits_types.map((property) => {
                return <PropertiesTable property={property}></PropertiesTable>;
              })}
          </div>
        </div>
      );
    }
  };

  return <div>{renderContent()}</div>;
}

export default Collection;
