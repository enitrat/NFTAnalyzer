import styled from "styled-components";
import "./RankingTable.css"
import {useTable} from "react-table"

const StyledLink = styled.a`
    color:#04BD01;
`

function RankingTable({ properties, nftDataArray, contractAddress }) {

        const tableInstance = 

    console.log(properties);
    return (
        <div className="divSplitOne">
            <div className="divRank">
                <table className="tableRank">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Ranking</th>
                            {properties.map((property) =>

                                <th>{property.name}</th>
                            )
                            }
                            <th>Opensea Link</th>

                        </tr>
                    </thead>
                    <tbody className="tbodyRank">
                        {
                            nftDataArray !== undefined && nftDataArray.map((nft, index) => {
                                //const number = nft.image.split('/').pop();
                                //const number = nft.image.split(CID + '/')[1].split(".")[0] || nft.id
                                const number = nft["id"];
                                let url = `https://opensea.io/assets/${contractAddress}/${number}`;

                                return (
                                    <tr>
                                        <td className="tdRank">
                                            <div className="imgWrapper">
                                                <img src={nft.image} />
                                            </div>
                                         </td>
                                        <td className="tdRank">
                                            {nft.name}
                                        </td>
                                        <td className="tdRank">
                                            {index + 1}
                                        </td>

                                        <td className="tdRank">
                                            <StyledLink href={url}>#{number}</StyledLink>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RankingTable;