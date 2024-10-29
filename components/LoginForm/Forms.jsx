import React from 'react';
import AccountForm from "./AccountForm";
import CompanyForm from "./CompanyForm";
import RegisterDone from "./RegisterDone";
import useFormContext from "../Hooks/useFormContext";

const Forms = () => {
    const { page } = useFormContext();

    const display = {
        0: <AccountForm />,
        1: <CompanyForm />,
        2: <RegisterDone />
    };

    return (
        <div className="w-full">
            {display[page]}
        </div>
    );
};

export default Forms;