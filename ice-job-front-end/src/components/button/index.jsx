import React from "react";
import "../../styles/button.css";

interface ButtonProps {
  onClick: () => void;
  label: string;
  isActive?: boolean;
}

const Button: React.FunctionComponent<ButtonProps> = ({ onClick, label, isActive }) => {
  return (
    <div className={`containerButton ${isActive ? 'active' : ''}`} onClick={onClick}>
      <a>{label}</a>
    </div>
  );
};

export default Button;
