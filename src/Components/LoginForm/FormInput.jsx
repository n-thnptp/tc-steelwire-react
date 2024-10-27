import React from 'react';
import "../../index.css";

const FormInput = ({ 
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    onFocus,
    onBlur,
    icon: Icon,
    iconRight: IconRight,
    title,
    isTextArea = false,
    required = false 
}) => {
    const handleChange = (e) => {
        const event = {
            target: {
                name: name,
                value: e.target.value
            }
        };
        onChange(event);
    };

    return (
        <div className="w-full mb-4">
            {/* input title */}
            {title && (
                <h4 className="text-sm font-inter font-bold text-primary-700 mb-2">
                    {title}
                </h4>
            )}
            
            {/* input field */}
            <div className="flex input-field">
                {Icon && !isTextArea && (
                    <Icon className="my-auto mx-2 text-2xl text-primary-600" />
                )}
                
                {isTextArea ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        className="w-full h-[100px] px-2 py-1 resize-none"
                        required={required}
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value || ""}
                        onChange={handleChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        className="w-full h-[45px] px-2"
                        required={required}
                    />
                )}

                {IconRight && !isTextArea && (
                    <IconRight className="my-auto mx-2 text-2xl text-primary-700" />
                )}
            </div>
        </div>
    );
};

export default FormInput;