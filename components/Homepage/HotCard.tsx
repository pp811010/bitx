'use client'

import { calProfit, getAllAsset } from "@/actions/Coin/action";
import { Card } from "@/components/ui/card";
import { FetchCoinData } from "@/data/fetchCoinData";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Flame } from 'lucide-react';
import { Coin } from "@/utils/allType";



export default function HotCard() {
    const [data, setData] = useState<Coin[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const coin = await FetchCoinData();
    
            const top8: Coin[] = coin
                .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                .slice(0, 8);
    
            setData(top8);
        };
    
        fetchData();
    }, []);

    return (
        <Card className="p-4 w-[470px] bg-white dark:bg-[#f0f0f0] rounded-xl shadow-md">
            <div className="flex justify-between items-center  rounded-xl">
                <h3 className="text-lg font-medium ">Top 24 Change </h3>
                <Flame className="text-red-700" />
            </div>
            <div className="mt-3 grid grid-flow-col grid-rows-4 gap-x-5">
                {data.map((coin: Coin, index: number) => (
                    <Link key={index} href={`/coin/${coin.id}`} passHref>
                        <div key={index} className={` flex justify-between items-center py-2  transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-[#fffbe4] hover:px-2 hover:rounded-xl `}>
                            <div className="w-full text-right flex justify-between">
                            <div className='flex gap-2'>
                            <p className="text-sm font-sans text-black">{index + 1}. </p>
                                <p className="text-sm font-sans text-black">{coin.id}</p>
                            </div>
                                <p className={`text-xs font-normal ${coin.price_change_percentage_24h < 0 ? "text-red-500" : "text-green-500"} flex items-center`}>
                                    {coin.price_change_percentage_24h < 0 ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
                                    {coin.price_change_percentage_24h.toLocaleString()}%
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </Card>
    );
}
