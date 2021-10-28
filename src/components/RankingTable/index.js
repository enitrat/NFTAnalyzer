import styled from "styled-components";
import "./RankingTable.css";
import { useTable } from "react-table";
import { useMemo } from "react";

const StyledLink = styled.a`
  color: #04bd01;
`;

function RankingTable({ properties, nftDataArray, contractAddress }) {
  const nftData = useMemo(() => [...nftDataArray], [nftDataArray]);
  /* const nftColumns = useMemo(
    () =>
      nftDataArray[0]
        ? Object.keys(nftDataArray[0])
            .filter((key) => key !== "attributes")
            .map((key) => {
              return { Header: key, accessor: key };
            })
        : [],
    [nftDataArray]
  ); */

  console.log(nftData);

  const sharedColumns = ["image", "name", "id", "attributes"];

  const traits_types = properties.map((property) => {
    return { Header: property.name, accessor: property.name };
  });

  console.log(traits_types);

  const allCols = sharedColumns;

  const dataColumns = useMemo(
    () =>
      allCols.map((key) => {
        if (key === "image") {
          return {
            Header: key,
            accessor: key,
            Cell: ({ value }) => <img src={value} />,
          };
        }
        if (key === "id") {
          return {
            Header: key,
            accessor: key,
            Cell: ({ value }) => (
              <a href={`https://opensea.io/assets/${contractAddress}/${value}`}>
                OpenseaLink
              </a>
            ),
          };
        }
        if (key === "attributes") {
          return {
            Header: key,
            accessor: key,
            columns: traits_types,
          };
        }
        return { Header: key, accessor: key };
      }),
    [allCols]
  );

  const tableInstance = useTable({ columns: dataColumns, data: nftData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const render = () => {
    if (nftDataArray === undefined) {
      return <div></div>;
    }
    return (
      <div>
        <table {...getTableProps()} className="tableRank">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="tbodyRank">
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr>
                  {row.cells.map((cell, idx) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return render();

  /* return (
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
    ) */
}

export default RankingTable;
