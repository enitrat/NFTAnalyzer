import "./PropertiesTable.css";
import { useState } from "react";
import ReactTable from "react-table";
import { useTable } from "react-table";

function Table({ columns, data, triggerFilter}) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

	
  // Render the UI for your table
  return (
    <table {...getTableProps()} className="tableProperties">
      <thead className="theadProperties">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="trProperties">
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} className="thProperties"><div>{column.render("Header")}</div></th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="tbodyProperties">
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} onClick={triggerFilter} className="inactive">
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PropertiesTable({ property, filters, setFilters }) {

  const triggerFilter = (e) => {
    let parentNode = e.target.parentNode;
    let cellValue = parentNode.childNodes[0].innerText;
    if (parentNode.className === "inactive") {
      parentNode.className = "active";
      setFilters([...filters, cellValue]);
    } else if (parentNode.className === "active") {
      parentNode.className = "inactive";
      const newFilters = filters.filter((filter) => filter !== cellValue);
      setFilters(newFilters);
    }
  };
  console.log(property.values);
  const columns = [
    {
      Header: `${property.name}`,
      accessor: "name",
    },
    {
      Header: `${property.propertyRate.toFixed(2)} %`,
      accessor: "absoluteRate",
	  Cell: ({ value }) => value.toFixed(4),
    },
  ];

  console.log(columns);
  return (<div>
	  <Table data={property.values} columns={columns} triggerFilter={triggerFilter}/>
  </div>);

  //   return (
  //     <div className="divProperties">
  //       <table className="tableProperties">
  //         <thead className="theadProperties">
  //           <tr className="trProperties">
  //             <th className={`thProperties`}>{property.name}</th>
  //             <th className="thProperties">
  //               {property.propertyRate.toFixed(4)} %
  //             </th>
  //           </tr>
  //         </thead>
  //         <tbody className="tbodyProperties">
  //           {property.values.map((value, i) => {
  //             return (
  //               <tr key={i} onClick={triggerFiler} className="inactive">
  //                 <td className="tdProperties">{value.name}</td>{" "}
  //                 <td>
  //                   <span>{value.absoluteRate.toFixed(4)} %</span>
  //                 </td>
  //               </tr>
  //             );
  //           })}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
}

export default PropertiesTable;
