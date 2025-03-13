import React from "react";

function SelectField({ label, id, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <select id={id} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;
