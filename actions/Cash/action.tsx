'use server'

import db from "@/utils/db";
import { currentUser } from '@clerk/nextjs/server';
import Stripe from "stripe";
import { console } from "inspector";
import {AddCashResult} from "@/utils/allType";



export async function FetchCash () {
    try {
        const user = await currentUser();
        if (!user) {
            return { message: "User not authenticated" };
        }

        const getuser = await db.profile.findFirst({
            where: { clerkId: user.id },
        });

        if (!getuser) {
            return { message: "User profile not found" };
        }

        const cash = await db.asset.findFirst({
            where: {
                ownerId: getuser.id,
                name: 'Cash',
            },
        });

        return { cash };
    } catch (error) {
        console.error("Error fetching cash:", error);
        return { error };
    }
}
export async function FetchCoin(coinId: string){
    try {
        const user = await currentUser();
        if (!user) {
            return { message: "User not authenticated" };
        }

        const getuser = await db.profile.findFirst({
            where: { clerkId: user.id },
        });

        if (!getuser) {
            return { message: "User profile not found" };
        }

        const coin = await db.asset.findFirst({
            where: {
                ownerId: getuser.id,
                name: coinId,
            },
        });

        return { coin };
    } catch (error) {
        console.error("Error fetching coin:", error);
        return { error };
    }
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error("Stripe secret key is not defined");
}
const stripe = new Stripe(stripeSecretKey);

export async function buyCash(params: { price: number; value: number }) {
    const { price, value } = params;
    console.log('price', price);
    console.log('value', value);
    try {
        const priceInt = Math.round(price * 100);
        console.log('priceInt', priceInt);
        
        const valueStr = value ? value.toString() : '0'; 
        console.log('valueStr', valueStr);
        const YOUR_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: 'thb',
                        unit_amount: priceInt,
                        product_data: {
                            name: "cash",
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${YOUR_DOMAIN}/cash/success/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cash/cancel`,
            metadata: {
                priceValue: valueStr,
            },
        });

        return { redirectUrl: session.url };
    } catch (error) {
        console.error("Error adding cash:", error);
        return { error };
    }
}

export async function addCash(id: string): Promise<AddCashResult> {
    try {
        const checkout_session_id = id;
        if (!checkout_session_id) {
            return { message: "No session ID found" };
        }

        const checkout_session = await stripe.checkout.sessions.retrieve(checkout_session_id);
        const price = parseFloat(checkout_session.metadata?.priceValue || "0");
        console.log("Price:", price);

        const user = await currentUser();
        if (!user) {
            return { message: "User not authenticated" };
        }

        const getuser = await db.profile.findFirst({
            where: { clerkId: user.id },
        });

        if (!getuser) {
            return { message: "User profile not found" };
        }

        const cash = await db.asset.findFirst({
            where: {
                ownerId: getuser.id,
                name: 'Cash',
            },
        });

        if (cash) {
            await db.asset.update({
                where: { id: cash.id },
                data: {
                    totalSpent: {
                        increment: price,
                    },
                },
            });
        }

        return { message: "Cash added successfully", price };
    } catch (error) {
        console.error(error);
        return { error };
    }
}
