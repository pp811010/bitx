'use client'
import React from 'react';
import { ShoppingBasket } from 'lucide-react';
import Image from "next/image";
import { buyCash } from '@/actions/Cash/action';

const coins = [
    { img: "/image/coin1.png", amount: "1,000 เหรียญ", price: 100, value: 1000 },
    { img: "/image/coin2.png", amount: "10,000 เหรียญ", price: 400, value: 10000 },
    { img: "/image/coin3.png", amount: "100,000 เหรียญ", price: 600, value: 100000 },
];

const handleSubmit = async (price: number, value: number) => {
    try {
        const { redirectUrl } = await buyCash({
            price: price,
            value: value,
        });
        window.location.href = redirectUrl ?? '';
    }
    catch (error) {
        console.log("Error adding cash:", error);
    }
};

const AddCoin = () => {
    return (
        <div className="p-6 mt-8">
            <h1 className="text-5xl font-bold text-center text-gray-800 mb-10 dark:text-white">
                เติมเงิน
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
                {coins.map((coin, index) => (
                    <div key={index} className="bg-[#fff8de] rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300 dark:bg-gray-800">
                        <Image
                            src={coin.img}
                            alt="Coin"
                            width={300}
                            height={300}
                            className="w-full object-cover"
                        />
                        <div className="p-6 text-center">
                            <h5 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                {coin.amount}
                            </h5>
                            <p className="mb-4 text-gray-700 text-lg font-medium dark:text-white">
                                {coin.price}฿
                            </p>
                            <button onClick={() => handleSubmit(coin.price, coin.value)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300">
                                <ShoppingBasket className="w-6 h-6" />
                                ซื้อเลย
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AddCoin;
