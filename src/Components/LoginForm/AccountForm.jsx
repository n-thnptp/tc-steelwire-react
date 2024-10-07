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
        <div className="flex flex-wrap flex-col rounded-3xl bg-primary">
            <div className="pt-16 px-24">
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
                
                <form action="">
                    {/* username/email and password fields */}
                    <div className="flex flex-col gap-4 items-center justify-center">
                        <FormInput
                            type="text"
                            placeholder="Username"
                            icon={FaUser}
                            required
                        />
                        <FormInput
                            type="text"
                            placeholder="Email"
                            icon={MdEmail}
                            required
                        />
                        <FormInput
                            type="password"
                            placeholder="Password"
                            icon={RiLockPasswordFill}
                            required
                        />
                        <FormInput
                            type="password"
                            placeholder="Confirm Password"
                            icon={RiLockPasswordFill}
                            required
                        />

                        {/* continue button */}
                        <button type="submit" className="primary-buttons inline-flex w-3/4 items-center justify-center">
                            Continue <RiContractRightLine classsName="text-accent-900" />
                        </button>
                    </div>
                </form>
            </div>

            <div className="px-10 items-center justify-center">
                {/* line separator */}
                <div className="mt-7 line separator"> OR </div>

                <div className="grid grid-cols-2 gap-5 mt-7">
                    <Button
                        href="#"
                        size="lg"
                        color="white"
                        className="flex items-center justify-center"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-8 h-8"></img>
                    </Button>

                    <Button
                        href="#"
                        size="lg"
                        color="white"
                        className="flex items-center justify-center"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Facebook_icon_2013.svg" className="w-8 h-8"></img>
                    </Button>
                </div>

                <div className="flex py-8 gap-2 font-inter text-sm items-center justify-center text-accent-600">
                    <div>Already have an account ?</div>
                    <a href="#" className="button-underline inline-flex items-center justify-center"><RiLogoutBoxFill className="text-xl"/> Login</a>
                </div>
            </div>
            
        </div>
      )
}

export default AccountForm