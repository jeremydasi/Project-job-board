import React from "react";
import "../../styles/buttonLog.css";

interface ButttonProps {
  onClick: () => void;
  label: string;
  type: string;
}

const ButtonLog: React.FunctionComponent<ButttonProps> = ({ onClick, label, type,  }) => {
  return (
    <button className="containerButtonLog" onClick={onClick}>
      <a className="lien" type={type}>{label}</a>
    </button>
  );
};

export default ButtonLog;