import React, { useState } from "react";
import "./RegisterForm.css";
import AccountForm from "./AccountForm";
import CompanyForm from "./CompanyForm";
import { Button } from '@material-tailwind/react';
import { FileUploader } from 'react-drag-drop-files';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { RiContractRightLine } from "react-icons/ri";
import { RiLogoutBoxFill } from "react-icons/ri";

const FileTypes = ["JPG", "JPEG", "PNG"];

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
        <div className="flex h-screen items-center justify-center bg-red-500">
            <div className="rounded-3xl flex bg-accent-900">
                
                <div className="p-16 my-10 h-auto grid w-2/5">
                    {/* personal info */}
                    <StepsComponent
                        highlight
                        number="1"
                        text="Personal Info"
                    />
                    {/* <div className="gap-5 flex items-center whitespace-nowrap">
                        <div className="steps-circle text-accent-900 items-center justify-center bg-primary flex-shrink-0">1</div>
                        <h3 className="content-center font-inter font-bold text-lg text-primary">Personal Info</h3>
                    </div> */}

                    {/* address info */}
                    {/* <div className="gap-5 flex items-center whitespace-nowrap">
                        <div className="steps-circle items-center justify-center text-white bg-primary bg-opacity-50 flex-shrink-0">2</div>
                        <h3 className="content-center font-inter font-bold text-lg text-primary">Address Info</h3>
                    </div> */}
                    <StepsComponent
                        number="2"
                        text="Address Info"
                    />
                    {/* finish */}
                    {/* <div className="gap-5 flex items-center whitespace-nowrap">
                        <div className="steps-circle items-center justify-center text-white bg-primary bg-opacity-50 flex-shrink-0">3</div>
                        <h3 className="content-center font-inter font-bold text-lg text-primary">Finish !</h3>
                    </div> */}
                    <StepsComponent
                        number="3"
                        text="Finish !"
                    />
                </div>
                
                {/* form */}
                <AccountForm />
            </div>
        </div>
    )
}

export default RegisterForm