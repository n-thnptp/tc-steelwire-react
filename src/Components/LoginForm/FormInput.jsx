import React from 'react';

const FormInput = ({ title, type, placeholder, icon: Icon, iconRight: IconRight }) => {
    return (
        <div className="w-full">
            {/* input title */}
            {title && <h4 className="text-sm font-inter font-bold text-accent-900 mb-2">{title}</h4>}


            {/* input field */}
            <div className="flex input-field">
                {Icon && <Icon className="my-auto mx-2 text-2xl text-accent-900" />}
                <input
                    className="w-full h-[50px] px-2 bg-transparent"
                    type={type}
                    placeholder={placeholder}
                    required
                />
                {IconRight && <IconRight className="my-auto mx-2 text-2xl text-accent-900" />}
            </div>
        </div>
    );
};

export default FormInput;
