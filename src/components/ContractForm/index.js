import { useHistory } from "react-router-dom";
import { useState } from "react"
import { Link } from "react-router-dom";

function ContractForm(){


    const [contract, setContract]=useState('');
    const handleContractChange = (e) => {
        setContract(e.target.value);
    }



    return (
        <div>
            <input type="text" name="contract" onChange={handleContractChange} />
            <Link to={`/${contract}`}>Lien vers contract</Link>
        </div>
    )
}


export default ContractForm