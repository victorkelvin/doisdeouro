import React from 'react';
import Select from 'react-select';



const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;

    return (
        <div
            ref={innerRef}
            {...innerProps}
            onMouseEnter={() => console.log(`Mouse entered: ${data.label}`)}
            onMouseLeave={() => console.log(`Mouse left: ${data.label}`)}
            className="custom-option"
            style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: innerProps.isFocused ? '#f0f0f0' : 'white',
            }}
        >
            {data.label}
        </div>
    );
};

const MultiSelect = ({ label, options, value, onChange, placeholder }) => {
    return (
        <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                <span className="text-xs text-gray-500 ml-1">(Pesquise e selecione múltiplos)</span>
            </label>
            <Select
                isMulti
                captureMenuScroll
                options={options}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="react-select-container"
                classNamePrefix="react-select"
                components={{ Option: CustomOption }}
            />
            <div className="text-xs text-gray-500 mt-1">
                {value.length} {label.toLowerCase()}(s) selecionado(s)
            </div>
        </div>
    );
};

export default MultiSelect;