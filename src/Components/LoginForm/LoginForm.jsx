import React from 'react';
import { Button } from '@material-tailwind/react';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const LoginForm = () => {
    return (
        <div className="flex flex-row h-screen items-center justify-center">
            <form action="" className="flex flex-nowrap flex-col">
                
                <h1 className="mb-10 font-inter font-bold text-accent-900 text-3xl text-center items-center justify-center">TC Steel Wire</h1>

                {/* username/email and password fields */}
                <div className="grid grid-rows-2 gap-6">
                    <div className="flex w-full input-field">
                        <MdEmail className="my-auto mx-2 text-3xl text-accent-900" />
                        <input className="w-full h-[50px]" type="text" placeholder="Email / Username" required />
                    </div>
                    <div className="flex w-full input-field">
                        <RiLockPasswordFill className="my-auto mx-2 text-3xl text-accent-900" />
                        <input className="w-full h-[50px]" type="password" placeholder="Password" required />
                    </div>
                </div>

                {/* login button */}
                <button type="submit" className="mt-6 primary-buttons">Login</button>

                {/* register / forgot password page, relink href to corresponding pages later */}
                <div className="my-2 text-xs text-gray-500 font-inter">
                    <a href="#" className="me-[290px] hover:text-gray-900">Don't have an account?</a>
                    <a href="#" className="hover:text-gray-900">Forgot password?</a>
                </div>

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

            </form>
        </div>
    )
}

export default LoginForm