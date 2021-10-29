import styled from "styled-components";
import "./RankingTable.css";
import { useTable, usePagination } from "react-table";
import { useMemo, useEffect } from "react";

const StyledLink = styled.a`
  color: #04bd01;
`;

function Table({ columns, data }) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  return (
    <div>
      <table {...getTableProps()} className="tableRank">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="tbodyRank">
          {page.map((row, i) => {
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

      <div className="pagination">
        <div className="paginationButtons">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"First"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"Previous"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {"Next"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {"Last"}
          </button>{" "}
        </div>
        <div className="pageNumber">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </div>
        <div className="pageJump">
          <span>
            Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className="customSelect"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        </div>
      </div>
    </div>
  );
}
function RankingTable({ properties, nftDataArray, contractAddress }) {
  const nftData = nftDataArray;

  const dataColumns = useMemo(
    () =>
      ["image", "name", "id", "attributes"].map((key) => {
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
            columns: properties.map((property) => {
              return {
                Header: property.name,
                accessor: property.name,
                Cell: ({ value }) => (value === undefined ? "None" : value),
              };
            }),
          };
        }
        return { Header: key, accessor: key };
      }),
    [properties]
  );

  const render = () => {
    if (nftDataArray === undefined) {
      return <div></div>;
    }
    return (
      <div className="divRank">
        <Table columns={dataColumns} data={nftData} />
      </div>
    );
  };

  return render();
}

export default RankingTable;
