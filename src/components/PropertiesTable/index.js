import './PropertiesTable.css'

function PropertiesTable({ property }) {

	return (

		<div className="divProperties">
			<table className="tableProperties">
				<thead className="theadProperties">
					<tr className="trProperties">
						<th className="thProperties">
							<h3>{property.name} : {property.propertyRate.toFixed(4)} %</h3>
						</th>

					</tr>
				</thead>
				<tbody className="tbodyProperties">
					{property.values.map((value) => {
						return (
							<tr className="trProperties"><td className="tdProperties">{value.name}</td> <td>{value.absoluteRate.toFixed(4)} %</td></tr>
						);
					})
					}
				</tbody>
			</table>
		</div>
	)
}

export default PropertiesTable;