import React, { useState } from "react";
import "./RegisterForm.css";
import AccountForm from "./AccountForm";
import CompanyForm from "./CompanyForm";
import RegisterDone from "./RegisterDone";

class Page {
    static AccountForm = 0;
    static CompanyForm = 1;
}

const StepsComponent = ({ highlight, number, text }) => {
    return <div className="gap-5 flex items-center whitespace-nowrap">
        <div className={`steps-circle ${highlight ? "text-accent-900":"bg-opacity-50 text-white"} items-center justify-center bg-primary flex-shrink-0`}>{number}</div>
        <h3 className="content-center font-inter font-bold text-lg text-primary">{text}</h3>
    </div>
}

function RegisterForm() {
    
    const [page, setPage] = useState(Page.AccountForm);

    const pageDisplay = () => {
        switch (page) {
            case Page.AccountForm:
                return <AccountForm />; 
            case Page.CompanyForm:
                return <CompanyForm />; 
        }

    }

    return (
        <section className="flex min-h-screen items-center justify-center bg-neutral-gray">

            {/* form container */}
            <div className="rounded-3xl flex w-fit shadow-lg bg-accent-900">
                
                {/* steps container */}
                <div className="p-16 my-10 h-auto flex flex-col gap-20 w-3/6 justify-center">
                    <StepsComponent
                        highlight
                        number="1"
                        text="Personal Info"
                    />
                    <StepsComponent
                        number="2"
                        text="Address Info"
                    />
                    <StepsComponent
                        number="3"
                        text="Finish !"
                    />
                </div>
                
                {/* form */}
                <AccountForm />
            </div>
        </section>
    )
}

export default RegisterForm