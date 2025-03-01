"use client";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchCoinDataDetail } from "@/data/fetchCoinData";
import { useParams } from "next/navigation";
import { CoinChart } from "@/data/fetchCoinData";
import LineChart from "@/components/LineChart/LineChart";
import { buyCoin } from "@/actions/Buy/action";
import { toast } from 'react-toastify';
import Barcoin from "@/components/Homepage/barcoin";
import { FetchCash } from "@/actions/Cash/action";


const Detail = () => {
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [coinChart, setCoinChart] = useState(null);
    const [isBuy, setIsBuy] = useState(true);
    const [amount, setAmount] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [cash, setCash] = useState(null);
    useEffect(() => {
        if (!id) return;
        const getData = async () => {
            try {
                const data = await FetchCoinDataDetail(id as string);
                setCoin(data);
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };

        const getChart = async () => {
            try {
                const data = await CoinChart(id as string);
                console.log(data);
                setCoinChart(data);
            } catch (error) {
                console.error(error);
            }
        };

        const getCash = async () => {
            try {
                const data = await FetchCash();
                console.log(data);
                setCash(data.cash);
                console.log(data.cash);
                console.log(data.cash.totalSpent);
            } catch (error) {
                console.error("Error fetching cash:", error);
            }
        };
        getCash();
        getChart();
        getData();
    }, [id]);
    useEffect(() => {
        if (coin && amount) {
            setQuantity(parseFloat(amount) / coin?.current_price);
        }
    }, [amount, coin]);

    const handleBuyCoin = async () => {
        if (!amount || !quantity) {
            toast.error("กรุณากรอกจำนวนเงินที่ต้องการซื้อ");
            return;
        }
        const response = await buyCoin({
            coinId: coin.id,
            price: parseFloat(amount),
            quantity: quantity,
        });

        if (response.success) {
            toast.success("การซื้อเหรียญสำเร็จ!");
            setAmount("");
            setQuantity(0);
        } else {
            toast.error("เกิดข้อผิดพลาดในการซื้อเหรียญ!");
        }
    };
    return (
        <>
            {coin ? (
                <div className="flex flex-col gap-2 p-4 mt-1">
                    <Barcoin />
                    <div className="grid grid-cols-2 gap-14 mt-4">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <div className="flex flex-row gap-2">
                                        <img className="size-20" src={coin.image} alt={coin.name} />
                                        <p className="p-4 text-2xl">
                                            {coin.id}{" "}
                                            <span className="bg-slate-900 text-sm p-1 rounded-sm text-white px-3">
                                                {coin.symbol.toUpperCase()}
                                            </span>
                                            <span className="px-2 ml-1 mt-2 inline-flex items-center">
                                                <ButtonIcon />
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-center space-y-2">
                                    <span className="bg-slate-900 text-sm text-white py-1 px-2 rounded-sm">
                                        Rank #{coin.market_cap_rank}
                                    </span>
                                </div>

                            </div>
                            <div>
                                <div className="grid grid-cols-3 gap-6 items-center">
                                    <div className="flex flex-col">
                                        <p className="text-gray-500 text-sm text-center">ราคาล่าสุด</p>
                                        <div className="flex items-center gap-2 font-semibold text-sm">
                                            {coin.current_price.toLocaleString()} ฿
                                            <span
                                                className={`text-sm flex items-center gap-1 ${coin.price_change_percentage_24h < 0 ? "text-red-500" : "text-green-500"
                                                    }`}
                                            >
                                                {coin.price_change_percentage_24h.toFixed(2)}%
                                                {coin.price_change_percentage_24h < 0 ? (
                                                    <TrendingDown size={16} />
                                                ) : (
                                                    <TrendingUp size={16} />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col text-center">
                                        <p className="text-gray-500 text-sm">ราคาสูงสุด (24 ชั่วโมง)</p>
                                        <h1 className="font-semibold text-green-600 text-sm">
                                            {coin.high_24h.toLocaleString()} ฿
                                        </h1>
                                    </div>

                                    <div className="flex flex-col text-center">
                                        <p className="text-gray-500 text-sm">ราคาต่ำสุด (24 ชั่วโมง)</p>
                                        <h1 className="font-semibold text-red-500 text-sm">
                                            {coin.low_24h.toLocaleString()} ฿
                                        </h1>
                                    </div>
                                </div>

                            </div>
                            <div className="-mt-8">
                                <LineChart historicalData={coinChart} />
                            </div>
                        </div>
                        <div className="mt-6">
                            <div>
                                <div className="">
                                    <div className="grid grid-cols-2 bg-[#ebebeb] p-1 rounded-md gap-2 dark:bg-slate-500">
                                        <button
                                            onClick={() => setIsBuy(true)}
                                            className={`font-semibold py-3 rounded-md transition-all duration-200 ${isBuy
                                                ? "bg-white border-[1px] border-green-600 text-green-400"
                                                : "bg-[#ebebeb] text-gray-400 border hover:bg-[#d7d6d6]"
                                                }`}
                                        >
                                            ซื้อ
                                        </button>

                                        <button
                                            onClick={() => setIsBuy(false)}
                                            className={`font-semibold py-3 rounded-md transition-all duration-200 ${!isBuy
                                                ? "bg-white border-[1px] border-red-600 text-red-400"
                                                : "bg-[#ebebeb] text-gray-400 border hover:bg-[#d7d6d6]"
                                                }`}
                                        >
                                            ขาย
                                        </button>
                                    </div>
                                    {isBuy ? (
                                        <div className="">
                                            <h1 className="mt-6">จำนวนที่ต้องจ่าย</h1>
                                            <div className="grid grid-cols-2 gap-2 p-2 m-6">
                                                <div className="flex flex-row gap-2">
                                                    <img
                                                        src="https://cdn.bitkubnow.com/coins/icon/32/THB.png"
                                                        alt=""
                                                        className="size-8"
                                                    />
                                                    <span className="text-2xl">THB</span>
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={amount || ""}
                                                        max={cash?.totalSpent}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (parseFloat(value) >= 0 || value === "") {
                                                                setAmount(value);
                                                            }
                                                            else {
                                                                setAmount("")
                                                            }
                                                        }}
                                                        className="p-2 w-full border-[1px] border-gray-300 rounded-md text-end pr-2"
                                                    />
                                                    <h1 className="mt-4 flex justify-end">
                                                        ยอดเงินคงเหลือ <span className="underline decoration-green-400 ml-2 text-green-400">{cash?.totalSpent}</span> <span className="ml-2">บาท</span>
                                                    </h1>

                                                </div>
                                            </div>
                                            <hr />
                                            <h1 className="mt-6">ได้รับประมาณ</h1>
                                            <div className="grid grid-cols-2 gap-2 p-2 m-6">
                                                <div className="flex flex-row gap-2">
                                                    <img src={coin.image} alt="" className="size-8" />
                                                    <span className="text-2xl">
                                                        {coin.symbol.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="flex justify-end text-2xl">
                                                        {quantity.toFixed(8)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex mt-3">
                                                <button
                                                    type="submit"
                                                    onClick={handleBuyCoin}
                                                    className="w-full focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-md text-lg px-5 py-3 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                >
                                                    ซื้อ
                                                </button>

                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h1 className="mt-6">จำนวนที่ต้องจ่าย</h1>
                                            <div className="grid grid-cols-2 gap-2 p-2 m-6">
                                                <div className="flex flex-row gap-2">
                                                    <img src={coin.image} alt="" className="size-8" />
                                                    <span className="text-2xl">
                                                        {coin.symbol.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={amount || ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (parseFloat(value) >= 0 || value === "") {
                                                                setAmount(value);
                                                            }
                                                            else {
                                                                setAmount("")
                                                            }
                                                        }}
                                                        className="p-2 w-full border-[1px] border-gray-300 rounded-md"
                                                    />
                                                </div>
                                            </div>
                                            <hr />
                                            <h1 className="mt-6">ได้รับประมาณ</h1>
                                            <div className="grid grid-cols-2 gap-2 p-2 m-6">
                                                <div className="flex flex-row gap-2">
                                                    <img
                                                        src="https://cdn.bitkubnow.com/coins/icon/32/THB.png"
                                                        alt=""
                                                        className="size-8"
                                                    />
                                                    <span className="text-2xl">THB</span>
                                                </div>
                                                <div>
                                                    <p className="flex justify-end text-2xl">0.00</p>{" "}
                                                </div>
                                            </div>
                                            <div className="flex mt-4">
                                                <button
                                                    type="submit"
                                                    className="w-full focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-lg px-5 py-3 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                >
                                                    ขาย
                                                </button>
                                            </div>
                                        </div>

                                    )}
                                    <div className="mt-6 text-right text-red-600">
                                        <p>*** ทุกการลงทุนมีความเสี่ยง ***</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default Detail;
