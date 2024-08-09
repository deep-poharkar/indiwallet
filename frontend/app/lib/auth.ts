import GoogleProvider from "next-auth/providers/google";
import { db } from "@/app/db";
import { Keypair } from "@solana/web3.js";
import { Session } from 'next-auth';

export interface SessionWithUID extends Session {
    user: {
        email: string;
        name: string;
        image: string;
        uid: string;
    };
}

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET || 'secr3t',
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        session: ({ session, token }: any): SessionWithUID => {
            const newSession: SessionWithUID = session as SessionWithUID;
            if (newSession.user && token.uid) {
                newSession.user.uid = token.uid ?? "";
            }
            return newSession;
        },
        async jwt({ token, account, profile }: any) {
            const user = await db.user.findFirst({
                where: {
                    sub: account?.providerAccountId ?? ""
                }
            });
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
        async signIn({ user, account, profile, email, credentials }: any) {
            if (account?.provider === "GOOGLE") {
                const email = user.email;
                if (!email) {
                    console.error("No email found for the user");
                    return false;
                }

                const existingUser = await db.user.findFirst({
                    where: { sub: account.providerAccountId }
                });

                if (existingUser) {
                    return true;
                }

                const { publicKey, privateKey } = generateSolanaKeyPair();

                try {
                    await db.user.create({
                        data: {
                            username: email,
                            name: profile?.name,
                            profilePicture: profile?.picture ?? "",
                            provider: "GOOGLE",
                            sub: account.providerAccountId,
                            solWallet: {
                                create: {
                                    publicKey: publicKey,
                                    privateKey: privateKey.toString()
                                }
                            },
                            inrWallet: {
                                create: {
                                    balance: 0
                                }
                            }
                        }
                    });
                    console.log("User created successfully");
                    return true;
                } catch (error) {
                    console.error("Error creating user:", error);
                    return false;
                }
            }
            return true;
        }
    }
}

function generateSolanaKeyPair() {
    // Implement key pair generation logic here
    return { publicKey: "generatedPublicKey", privateKey: "generatedPrivateKey" };
}