import React, { useState } from "react";
import "../../styles/checkList.css";

function CheckList({ onContractsChange }) {
  const [selectedContracts, setSelectedContracts] = useState([]);

  const contractOptions = [
    "CDI",
    "CDD",
    "Intérim",
    "Stage",
    "Alternance",
    "Indépendant/Freelance",
    "Franchise",
    "Associé",
  ];
  const handleCheckboxChange = (contract) => {
    let updatedContracts;
    if (selectedContracts.includes(contract)) {
      updatedContracts = selectedContracts.filter((c) => c !== contract);
    } else {
      updatedContracts = [...selectedContracts, contract];
    }

    setSelectedContracts(updatedContracts);
    onContractsChange(updatedContracts);
  };

  return (
    <div className="containerCheck">
      {contractOptions.map((contract, index) => (
        <div key={index} className="checkboxItem">
          <input
            className="inputCheck"
            type="checkbox"
            value={contract}
            checked={selectedContracts.includes(contract)}
            onChange={() => handleCheckboxChange(contract)}
          />
          <label className="titleCheck">{contract}</label>
        </div>
      ))}
    </div>
  );
}

export default CheckList;
