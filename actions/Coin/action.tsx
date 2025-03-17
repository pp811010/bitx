'use server'

import { FetchCoinData, FetchCoinDataDetail } from "@/data/fetchCoinData";
import { Asset, ErrorResponse, ProfitResult } from "@/utils/allType";
import db from "@/utils/db";
import { currentUser } from '@clerk/nextjs/server';

export async function createCash() {
    try {
        const user = await currentUser();
        if (!user) {
            return { message: "User not authenticated" };
        }

        const getUser = await db.profile.findFirst({
            where: {
                clerkId: user.id
            },
        });

        if (!getUser) {
            return { message: "User profile not found" };
        }

        const existingCash = await db.asset.findFirst({
            where: {
                name: "Cash",
                ownerId: getUser.id,
                deletedAt: null
            },
        });

        if (existingCash) {
            return { message: "Cash already exists", cash: existingCash };
        }


        const cash = await db.asset.create({
            data: { name: "Cash", totalSpent: 100000, ownerId: getUser.id }
        });

        return { message: "Create cash success", cash };
    } catch (err) {
        console.log(err);
        return { message: "error", error: err };
    }
}


export async function getAllAsset() {
    try {
        const user = await currentUser();
        
        if(!user){
            return { message: 'No user' };
        }

        const profile = await db.profile.findFirst({
            where: {
                clerkId: user.id
            },
            include: {
                assets: {
                    where: {
                        deletedAt: null  
                    }
                }
            }
        });
        

        if (!profile) {
            return { message: 'Profile not found' };
        }

        return { result: profile, massage: 'success' };
    } catch (error) {
        console.log(error);
        return { message: 'Error', error: error };
    }
}

export async function calProfit(coinName: string): Promise<ProfitResult | ErrorResponse> {

    const user = await currentUser();
    if (!user) {
        return { success: false,  message: "User not authenticated" };
    }

    const getUser = await db.profile.findFirst({ where: { clerkId: user.id } });

    
    if (!getUser) {
        return { success: false, message: "User profile not found" };
    }

    const myCoin = await db.asset.findFirst({
        where: { ownerId: getUser.id, name: coinName, deletedAt: null }
    });


    if (!myCoin) {
        return { success: false, message: "No asset found or quantity is zero" };
    }

    if (myCoin.totalSpent === 0) {
        return { success: false, message: "Total spent cannot be zero" };
    }

    const nowCoin = await FetchCoinDataDetail(coinName);
    if (!nowCoin || !nowCoin.current_price || nowCoin.current_price <= 0) {
        return { success: false, message: "Failed to fetch valid coin price" };
    }
    

    if (myCoin.quantity == null) {
        return { message: 'no myCoin.quantity'}
    }

    const avgPriceCoin = myCoin.totalSpent / myCoin.quantity;
    const hasPriceNow = nowCoin.current_price * myCoin.quantity;
    const hasPriceHold = avgPriceCoin * myCoin.quantity;
    const profitPercent = ((hasPriceNow - hasPriceHold) / hasPriceHold) * 100;

    return {
        myCoin,
        avgPriceCoin,
        hasPriceNow,
        hasPriceHold,
        resultProfit: hasPriceNow - hasPriceHold,
        resultProfitPercent: profitPercent
    };
}


export async function calAssettotal(allAssets: Asset[] ): Promise<{total: number, profitTotal: number, profitTotalPecent: number} | ErrorResponse> {
    try {
        let total_current_price = 0;
        const noCash = allAssets.filter((item) => item.name !== 'Cash');
        const Cash = allAssets.filter((item) => item.name === 'Cash');

        const totalSpent = noCash.reduce((result, item) => result + item.totalSpent, 0);

        for (const item of noCash) {
            const current_price = await FetchCoinDataDetail(item.name);
            if (!current_price || current_price.current_price === null) {
                return { message: 'no current_price'}
            }
            if (item.quantity == null) {
                return { message: 'no item without cash'}
            }
            total_current_price += (current_price.current_price * item.quantity);
        }

        const profitTotal = total_current_price - totalSpent;
        const profitTotalPecent = totalSpent > 0 ? (profitTotal / totalSpent) * 100 : 0;

        const total = totalSpent + (Cash[0]?.totalSpent || 0);

        return {
            total: Number(total),
            profitTotal: Number(profitTotal),
            profitTotalPecent: Number(profitTotalPecent),
          };
          
    } catch (error) {
        console.log("Error calculating total assets:", error);
        return {
            total: 0,
            profitTotal: 0,
            profitTotalPecent: 0
        };
    }
}

