"use client";

// import { GoogleIcon } from "./Icons";
import { SecondaryButton } from "./Button";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export const Hero = () => {
    const session = useSession();
    const navigate = useRouter();

    return <div>
        <div className="text-6xl font-medium text-center">
            <span>Revolutionizing Indian Crypto Trading</span> 
            <span className="text-blue-500 pl-4">
                Forever
            </span>
        </div>
        <div className="text-2xl font-medium text-center pt-5 text-slate-500">
            <span>
                Buy, Sell, and Trade Crypto in India with one click.
            </span>
        </div>
        <div className="pt-10 flex justify-center">
            {session.data?.user? <SecondaryButton onClick={() => 
            navigate.push("/dashboard")}> 
                Go to dashboard
            </SecondaryButton> : <SecondaryButton onClick={() => signIn("google")}> 
                Login with google
            </SecondaryButton>}
        </div>
    </div>
}