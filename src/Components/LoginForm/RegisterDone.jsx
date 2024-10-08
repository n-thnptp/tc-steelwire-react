import React from 'react';
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const RegisterDone = () => {
  return (
    <div className="p-20 flex flex-col rounded-3xl items-center justify-center bg-primary">
        <div className="py-10 flex flex-col items-center justify-center">
            <IoCheckmarkDoneCircle className="text-9xl text-accent-900"/>
            <h1 className="text-3xl text-center font-inter font-bold text-nowrap text-accent-900">Registration Successful!</h1>
        </div>

        <div className="flex gap-10 items-center justify-center">
            <a href="#" className="button-underline font-inter font-bold text-lg">Home</a>

            <button type="submit" className="primary-buttons inline-flex text-lg w-40 h-12 items-center justify-center">
                Back to Login
            </button>
        </div>
    </div>
  )
}

export default RegisterDone