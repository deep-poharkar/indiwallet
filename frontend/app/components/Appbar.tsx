'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { PrimaryButton } from "./Button";
export const AppBar = () => {
const session = useSession();
    return <div className="border-b px-2 py-2 flex justify-between">
        <div className="text-2xl font-bold flex flex-col justify-center">
            DCEX
        </div>
        <div>
            {session.data?.user? <PrimaryButton onClick={() => {
                signOut()
            }}>Logout</PrimaryButton> : <PrimaryButton onClick={() => {
                signIn()
            }}>Login</PrimaryButton>}
        </div>
    </div>
}