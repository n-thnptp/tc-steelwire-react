import React from "react";
import Forms from "./Forms";
import useFormContext from "../Hooks/useFormContext";  // Updated import path

const StepsComponent = ({ highlight, number, text }) => {
    return (
        <div className="gap-5 flex items-center whitespace-nowrap">
            <div className={`steps-circle w-12 h-12 rounded-full flex items-center justify-center ${
                highlight ? "bg-neutral-white text-primary-600" : "bg-neutral-white text-primary-600"
            }`}>
                {number}
            </div>
            <h3 className="content-center font-inter font-bold text-lg text-neutral-white">
                {text}
            </h3>
        </div>
    );
};


function RegisterForm() {
    const { page } = useFormContext();

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-gray">
            <div className="rounded-3xl flex w-[900px] shadow-lg bg-primary-600">
                {/* Steps sidebar */}
                <div className="p-16 my-10 h-auto flex flex-col gap-20 w-3/6 justify-center">
                    <StepsComponent
                        highlight={page >= 0}
                        number="1"
                        text="Personal Info"
                    />
                    <StepsComponent
                        highlight={page >= 1}
                        number="2"
                        text="Address Info"
                    />
                    <StepsComponent
                        highlight={page === 2}
                        number="3"
                        text="Finish Register"
                    />
                </div>

                {/* Form content */}
                <div className="w-full flex">
                    <Forms />
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
