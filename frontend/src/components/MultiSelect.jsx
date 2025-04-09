import React from 'react';
import Select from 'react-select';

const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;

    return (
        <div
            ref={innerRef}
            {...innerProps}
            className="custom-option p-2 cursor-pointer hover:bg-gray-200 hover:text-blue-600"
            style={{
                padding: '10px',
                cursor: 'pointer',
                // backgroundColor: innerProps.isFocused ? '#f0f0f0' : 'white',
            }}
        >
            {data.label}
        </div>
    );
};

const MultiSelect = ({ 
    label, 
    options, 
    value, 
    onChange, 
    placeholder, 
    showCardView = false, 
    onCardViewClick 
}) => {
    return (
        <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
                <span className="text-xs text-gray-500 ml-1">(Pesquise e selecione múltiplos)</span>
            </label>
            <div className="flex">
                <div className="flex-grow">
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
                </div>
                {showCardView && (
                    <button
                        type="button"
                        onClick={onCardViewClick}
                        className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 rounded flex items-center justify-center shadow-md transition-all duration-200"
                        title="Visualizar em cards"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
                {value.length} {label.toLowerCase()}(s) selecionado(s)
            </div>
        </div>
    );
};

export default MultiSelect;