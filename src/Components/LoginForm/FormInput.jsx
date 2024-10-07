import React from 'react';

const FormInput = ({ type, placeholder, icon: Icon, iconRight: IconRight }) => {
    return (
        <div className="flex w-full input-field">
            {Icon && <Icon className="my-auto mx-2 text-3xl text-accent-900" />}
            <input
                className="w-full h-[50px] px-2 bg-transparent"
                type={type}
                placeholder={placeholder}
                required
            />
            {IconRight && <IconRight className="my-auto mx-2 text-3xl text-accent-900" />}
        </div>
    );
};

export default FormInput;
