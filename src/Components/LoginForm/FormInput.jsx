import React from 'react';

const FormInput = ({ title, type, isTextArea, placeholder, icon: Icon, iconRight: IconRight }) => {
    return (
        <div className="w-full mb-4">
            {/* input title */}
            {title && <h4 className="text-sm font-inter font-bold text-accent-900 mb-2">{title}</h4>}

            {/* input field */}
            <div className="flex input-field">
                {Icon && !isTextArea && <Icon className="my-auto mx-2 text-2xl text-accent-900" />}
                {isTextArea ? (
                    <textarea
                        className="w-full h-[100px] px-2 py-1 bg-transparent rounded-md resize-none"
                        placeholder={placeholder}
                        required
                    />
                ) : (
                    <input
                        className="w-full h-[45px] px-2 bg-transparent rounded-md"
                        type={type}
                        placeholder={placeholder}
                        required
                    />
                )}
                {IconRight && !isTextArea && <IconRight className="my-auto mx-2 text-2xl text-accent-900" />}
            </div>
        </div>
    );
};

export default FormInput;
