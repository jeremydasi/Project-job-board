import React from "react";
import '../../styles/customCheck.css';

interface InputProps {
    label: String;
}

const CustomCheck: React.FunctionComponent<InputProps> = ({ label }) => {
    return (
        <div>
            <input type="checkbox" className="inputCheck"/>
            <label className="titlCheck">{label}</label>
        </div>
    )
}

export default CustomCheck;