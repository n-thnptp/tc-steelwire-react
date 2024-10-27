import React from 'react';
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const RegisterDone = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col rounded-3xl items-center justify-center bg-neutral-white p-8">
            <div className="py-10 flex flex-col items-center justify-center">
                <IoCheckmarkDoneCircle className="text-9xl text-primary-700"/>
                <h1 className="text-3xl text-center font-inter font-bold text-nowrap text-primary-700">
                    Registration Successful!
                </h1>
            </div>

            <div className="flex gap-10 items-center justify-center">
                <button
                    onClick={() => navigate('/')}
                    className="button-underline font-inter font-bold text-lg"
                >
                    Home
                </button>

                <button
                    onClick={() => navigate('/login')}
                    className="primary-buttons inline-flex text-lg w-40 h-12 items-center justify-center"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default RegisterDone;