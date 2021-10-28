import { useHistory } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

function ContractForm() {
  const [contract, setContract] = useState("");
  const handleContractChange = (e) => {
    setContract(e.target.value);
  };

  return (
    <div>
      <div className="centeredItem">
        <input
          type="text"
          name="contract"
          onChange={handleContractChange}
          placeholder="contract address"
          className="contractInput"
        />
      </div>
      <div className="centeredItem">
        <Link to={`/${contract}`} className = "mainButton">Scan collection</Link>
      </div>
    </div>
  );
}

export default ContractForm;
