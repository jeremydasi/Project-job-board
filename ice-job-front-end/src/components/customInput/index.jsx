import React from "react";
import '../../styles/customInput.css';

const CustomInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}) => {
  return (
    <div className="containerInput">
      <label className="label">{label}</label>
      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CustomInput;
