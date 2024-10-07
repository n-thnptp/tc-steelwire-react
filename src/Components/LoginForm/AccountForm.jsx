import React, { useState } from "react";
import FormInput from "./FormInput";
import { Button } from '@material-tailwind/react';
import { FileUploader } from 'react-drag-drop-files';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { RiContractRightLine } from "react-icons/ri";
import { RiLogoutBoxFill } from "react-icons/ri";

const FileTypes = ["JPG", "JPEG", "PNG"];

const AccountForm = () => {
    const [file, setFile] = useState(null);

    return (
        <div className="p-10 flex flex-wrap flex-col rounded-3xl bg-primary w-full">
            <div className="mx-16">
            <form action="">
                
                <h1 className="mb-5 font-inter font-bold text-lg text-left underline underline-offset-4 items-center justify-center text-accent-900">
                    Step 1
                </h1>

                <div className="mb-5 drag-and-drop">
                    <FileUploader
                        multiple={false}
                        handleChange={setFile}
                        name="file"
                        types={FileTypes}
                    />
                </div>

                {/* username/email and password fields */}
                <div className="grid grid-rows-2 gap-6">
                    <FormInput
                        type="text"
                        placeholder="Username"
                        icon={FaUser}
                    />
                    <FormInput
                        type="text"
                        placeholder="Email"
                        icon={MdEmail}
                    />
                    <FormInput
                        type="password"
                        placeholder="Password"
                        icon={RiLockPasswordFill}
                    />
                    <FormInput
                        type="password"
                        placeholder="Confirm Password"
                        icon={RiLockPasswordFill}
                    />
                </div>
            </form>
            </div>

            {/* continue button */}
            <button type="submit" className="mt-6 primary-buttons inline-flex items-center justify-center w-1/2 mx-auto">
                Continue <RiContractRightLine classsName="text-accent-900" />
            </button>
            
            {/* line separator */}
            <div className="mt-7 line separator"> OR </div>

            {/* alternate login buttons, via GOOGLE or FACEBOOK (add images later) */}
            <div className="grid grid-cols-2 gap-5 mt-7">
                {/* <button className="white-buttons" type="button">GOOGLE</button> */}
                <Button href="#" size="lg" color="white" className="flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-8 h-8"></img>
                </Button>
                <Button href="#" size="lg" color="white" className="flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Facebook_icon_2013.svg" className="w-8 h-8"></img>
                </Button>
            </div>

            {/* back to login */}
            <div className="inline-flex pt-8 gap-2 font-inter text-sm items-center justify-center text-accent-600">
                <div>Already have an account ?</div>
                <a href="#" className="inline-flex items-center justify-center"> <RiLogoutBoxFill className="text-2xl"/> Login</a>
            </div>

        </div>
      )
}

export default AccountForm