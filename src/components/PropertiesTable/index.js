import "./PropertiesTable.css";
import { useState } from "react";

function PropertiesTable({ property, filters, setFilters }) {
  const triggerFiler = (e) => {
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

  return (
    <div className="divProperties">
      <table className="tableProperties">
        <thead className="theadProperties">
          <tr className="trProperties">
            <th className={`thProperties`}>{property.name}</th>
            <th className="thProperties">
              {property.propertyRate.toFixed(4)} %
            </th>
          </tr>
        </thead>
        <tbody className="tbodyProperties">
          {property.values.map((value, i) => {
            return (
              <tr key={i} onClick={triggerFiler} className="inactive">
                <td className="tdProperties">{value.name}</td>{" "}
                <td>
                  <span>{value.absoluteRate.toFixed(4)} %</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PropertiesTable;
