"use client";
import { ButtonIconUnFav } from "@/components/ui/ButtonIcoUnFav";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchCoinDataDetail } from "@/data/fetchCoinData";
import { useParams } from "next/navigation";
import { CoinChart } from "@/data/fetchCoinData";
import LineChart from "@/components/LineChart/LineChart";
import { buyCoin, sellCoin } from "@/actions/Buy/action";
import { toast } from 'react-toastify';
import Barcoin from "@/components/Homepage/Barcoin";
import { FetchCash, FetchCoin } from "@/actions/Cash/action";
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useAuth, useUser } from "@clerk/nextjs";
import "./page.css"




const Detail = () => {
    const { isSignedIn } = useAuth();
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [fullSell, setFullSell] = useState(false);
    const [coinHave, setCoinHave] = useState("");
    const [coinChart, setCoinChart] = useState(null);
    const [isBuy, setIsBuy] = useState(true);
    const [amount, setAmount] = useState("");
    const [quantity, setQuantity] = useState("");
    const [cash, setCash] = useState(null);
    const [activeInput, setActiveInput] = useState(null);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    const getCash = async () => {
        try {
            const data = await FetchCash();
            console.log("Fetched data:", data);

            if (!data || !data.cash) {
                setCash(0);
                return;
            }
            setCash(data.cash);
            console.log("Cash:", data.cash);
            console.log("Total Spent:", data.cash.totalSpent);
        } catch (error) {
            console.error("Error fetching cash:", error);
            setCash(null);
        }
    };
    useEffect(() => {
        if (isSignedIn) {
            getCash();
        }
    }, [isSignedIn]);
    const getCoin = async () => {
        try {
            const data = await FetchCoin(id as string);
            console.log("dd", data);
            setCoinHave(data.coin);
        } catch (error) {
            console.error("Error fetching coin:", error);
        }
    }
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




        // getCash();
        getChart();
        getData();
        getCoin();
    }, [id]);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setActiveInput('amount');
        if (parseFloat(value) >= 0 || value === "") {
            setAmount(value);
        } else {
            setAmount("");
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setActiveInput('quantity');
        if (value === "") {
            setQuantity("");
        } else if (!isNaN(value) && parseFloat(value) >= 0) {
            setQuantity(value);
        }
    };

    useEffect(() => {
        if (coin && amount !== "" && activeInput === 'amount' && coin?.current_price > 0) {
            const calculatedQuantity = parseFloat(amount) / coin.current_price;
            setQuantity(isNaN(calculatedQuantity) ? 0 : calculatedQuantity);
        }
    }, [amount, coin, activeInput]);

    useEffect(() => {
        if (coin && quantity.toString() !== "" && activeInput === 'quantity' && !isNaN(quantity)) {
            const calculatedAmount = parseFloat(quantity) * coin.current_price;
            setAmount(isNaN(calculatedAmount) ? 0 : calculatedAmount);
        }
    }, [quantity, coin, activeInput]);


    useEffect(() => {
        if (fullSell && coinHave && coin) {
            const newQuantity = coinHave.quantity;
            setQuantity(newQuantity);
            setAmount(newQuantity * coin.current_price);
        }
    }, [fullSell, coinHave, coin]);


    // Check if buy button should be disabled
    const isBuyButtonDisabled = () => {
        return !amount || amount === "0" || !quantity || quantity === "0" || !isSignedIn || (cash && cash.totalSpent < parseFloat(amount));
    };

    // Check if sell button should be disabled
    const isSellButtonDisabled = () => {
        return !quantity || quantity === "0" || !isSignedIn || (coinHave && parseFloat(quantity) > coinHave.quantity);
    };

    const handleBuyCoin = async () => {
        if (!isSignedIn) {
            toast.error("กรุณาเข้าสู่ระบบก่อนทำการซื้อ");
            return;
        }
    
        if (!amount || !quantity) {
            toast.error("กรุณากรอกจำนวนเงินที่ต้องการซื้อ");
            return;
        }
    
        // Close the drawer first
      
        
        const response = await buyCoin({
            coinId: coin.id,
            price: parseFloat(amount),
            quantity: quantity,
        });
    
        if (response.success) {
            toast.success("การซื้อเหรียญสำเร็จ!");
            setAmount("");
            setQuantity(0);
            getCash();
            getCoin();
            window.location.href = `/coin/${coin.id}`;
        } else {
            toast.error("เกิดข้อผิดพลาดในการซื้อเหรียญ!");
        }
    };


    const handleSellCoin = async () => {
        if (!isSignedIn) {
            toast.error("กรุณาเข้าสู่ระบบก่อนทำการขาย");
            return;
        }
        if (quantity > coinHave?.quantity) {
            toast.error(`คุณมีเหรียญไม่เพียงพอสำหรับการขาย (คุณมี ${coinHave?.quantity} เหรียญ)`);
            return;
        }

        console.log("coinHave", coinHave);

        const newAmount = quantity * coin?.current_price;
        setAmount(newAmount);
        const response = await sellCoin({
            coinId: coin.id,
            price: coin?.current_price, 
            quantity: quantity, 
        });
        console.log(amount, quantity);
        if (response.success) {
            toast.success("การขายเหรียญสำเร็จ!");
            setAmount("");
            setQuantity("");
            getCash();
            getCoin();
             window.location.href = `/coin/${coin.id}`;
        } else {
            toast.error("เกิดข้อผิดพลาดในการขายเหรียญ!");
        }

        if(!cash) return;
    }
    return (
        <>
            {coin ? (
                <div className="flex flex-col gap-2 p-4 mt-1">
                    <Barcoin />
                    <div className="grid grid-cols-2 gap-14 mt-4">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <div className="flex flex-row gap-2 items-center justify-center ">
                                        <img className="size-20" src={coin.image} alt={coin.name} />
                                        <p className="p-4 text-2xl">
                                            {coin.id}{" "}
                                            <span className="bg-slate-900 text-sm p-1 rounded-sm text-white px-3">
                                                {coin.symbol.toUpperCase()}
                                            </span>
                                            {/* <span className="px-2 ml-1 mt-2 inline-flex items-center">
                                                <ButtonIconUnFav />
                                            </span> */}
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
                                    <div className="grid grid-cols-2 bg-[#ebebeb] p-1 rounded-md gap-2 dark:bg-transparent">
                                        <button
                                            onClick={() => setIsBuy(true)}
                                            // disabled={cash?.totalSpent < amount}
                                            className={`font-semibold py-3 rounded-md transition-all duration-200 ${isBuy
                                                ? "bg-white border-[1px] border-green-600 text-green-400 dark:bg-green-600 dark:border-green-600 dark:text-black"
                                                : "bg-[#ebebeb] text-gray-400 border hover:bg-[#d7d6d6] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            ซื้อ
                                        </button>

                                        <button
                                            onClick={() => setIsBuy(false)}
                                            className={`font-semibold py-3 rounded-md transition-all duration-200 ${!isBuy
                                                ? "bg-white border-[1px] border-red-600 text-red-400 dark:bg-red-600 dark:border-red-600 dark:text-black"
                                                : "bg-[#ebebeb] text-gray-400 border hover:bg-[#d7d6d6] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            ขาย
                                        </button>
                                    </div>
                                    {isBuy ? (
                                        <div className="">
                                            <h1 className="mt-6">จำนวนที่ต้องจ่าย</h1>
                                            <div className="grid grid-cols-2 gap-2 p-2 mt-6">
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
                                                        onChange={handleAmountChange}
                                                        className="p-2 w-full border-[1px] border-gray-300 rounded-md text-end pr-2 no-arrow"
                                                    />


                                                </div>
                                            </div>
                                            <h1 className="flex justify-end mt-4 mb-8">
                                                ยอดเงินคงเหลือ <span className="underline decoration-green-400 ml-2 text-green-400">{cash?.totalSpent || 0}</span> <span className="ml-2">บาท</span>
                                            </h1>
                                            <hr />
                                            <h1 className="mt-6">ได้รับประมาณ</h1>
                                            <div className="grid grid-cols-2 gap-2 p-2 mt-6">
                                                <div className="flex flex-row gap-2">
                                                    <img src={coin.image} alt="" className="size-8" />
                                                    <span className="text-2xl">
                                                        {coin.symbol.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="flex justify-end text-2xl">
                                                        {!quantity || (isNaN(quantity)) ? "0.00000000" : parseFloat(quantity).toFixed(8)}
                                                        {/* {!amount || isNaN(parseFloat(amount)) ? "0.00" : parseFloat(amount).toFixed(2)} */}


                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex mt-3">
                                            <Drawer isOpen={drawerIsOpen} onOpenChange={setDrawerIsOpen}>
                                                    <DrawerTrigger asChild>
                                                        <Button 
                                                            variant="outline" 
                                                            disabled={isBuyButtonDisabled()}
                                                            className={`w-full font-medium rounded-md text-lg px-5 py-3 px-20 py-[25px] ${
                                                                isBuyButtonDisabled() 
                                                                ? "text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500" 
                                                                : "text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                            }`}>
                                                            ซื้อ
                                                        </Button>
                                                    </DrawerTrigger>
                                                    <DrawerContent >
                                                        <div className="mx-auto w-full max-w-sm mt-3 mb-10">
                                                            <DrawerHeader>
                                                                <DrawerTitle  ><p className='font-normal text-2xl text-black' >ตรวจสอบการซื้อ</p></DrawerTitle>
                                                                <hr className='m-3' />
                                                               
                                                                
                                                                <div className='flex justify-between'>
                                                                    <DrawerDescription>จำนวนเหรียญที่ต้องการซื้อ</DrawerDescription>
                                                                    <DrawerDescription>{String(isNaN(quantity) ? "0" : quantity)}</DrawerDescription>
                                                                </div>
                                                                <div className='flex justify-between'>
                                                                    <DrawerDescription>ราคาทั้งหมดที่ต้องจ่าย</DrawerDescription>
                                                                    <DrawerDescription>{String(isNaN(amount) ? "0" : amount)}</DrawerDescription>
                                                                </div>
                                                                <hr className='m-3' />
                                                                <div className='flex justify-between'>
                                                                    <DrawerDescription>ยอดเงินคงเหลือ (Cash)</DrawerDescription>
                                                                    <DrawerDescription>{String(isNaN(amount) || !cash?.totalSpent ? "0" : (cash?.totalSpent - amount))}</DrawerDescription>
                                                                </div>
                                                            </DrawerHeader>
                                                        </div>

                                                        <div>
                                                            <DrawerFooter className='mx-[550px]'>
                                                                <Button className='bg-black hover:bg-green-800 ' onClick={handleBuyCoin}>ยืนยัน</Button>
                                                                <DrawerClose asChild>
                                                                    <Button variant="outline">ยกเลิก</Button>
                                                                </DrawerClose>
                                                            </DrawerFooter>
                                                        </div>
                                                    </DrawerContent>
                                                </Drawer>

                                            </div>

                                        </div>
                                    ) : (
                                        <div>
                                            <div className="grid grid-cols-2 mt-6">
                                                <h1 className="">จำนวนที่ต้องขาย</h1>
                                                <div className="text-sm flex justify-end">
                                                    <button
                                                        className={`py-2 px-4 border font-semibold rounded shadow
                                                        ${fullSell
                                                                ? "bg-green-400 text-white border-green-400"
                                                                : "bg-white text-gray-800 border-gray-400 hover:bg-green-400 hover:border-green-400 dark:bg-gray-700 dark:text-white"
                                                            }`}
                                                        onClick={() => {
                                                            if (!isSignedIn) {
                                                                toast.error("กรุณาเข้าสู่ระบบก่อนทำการขาย");
                                                                return;
                                                            }
                                                            setFullSell(true);
                                                        }}
                                                    >
                                                        ขายทั้งหมด
                                                    </button>

                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 p-2 mt-6">
                                                <div className="flex flex-row gap-2">
                                                    <img src={coin.image} alt="" className="size-8" />
                                                    <span className="text-2xl">
                                                        {coin.symbol.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>

                                                    <div className="flex items-center gap-3">

                                                        <input
                                                            type="number"
                                                            value={fullSell ? coinHave?.quantity : quantity || ""}
                                                            max={coinHave?.quantity}
                                                            onChange={handleQuantityChange}
                                                            className="p-2 w-full border border-gray-300 rounded-md text-end no-arrow"
                                                            disabled={fullSell}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setQuantity(0);
                                                                setAmount("");
                                                                setFullSell(false)
                                                            }}
                                                            className="-ml-2 text-gray-500 hover:text-red-500"
                                                        >
                                                            <X size={25} />
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>
                                            <h1 className="flex justify-end mt-2 mb-8 -mr-2">
                                                เหรียญที่มีทั้งหมด <span className="underline decoration-green-400 ml-2 text-green-400">{coinHave?.quantity || "0.0000000"}

                                                </span> <span className="ml-2"></span>
                                            </h1>
                                            <hr />
                                            <h1 className="mt-6">ได้รับประมาณ</h1>
                                            <div className="grid grid-cols-2 gap-2 p-2 mt-6">
                                                <div className="flex flex-row gap-2">
                                                    <img
                                                        src="https://cdn.bitkubnow.com/coins/icon/32/THB.png"
                                                        alt=""
                                                        className="size-8"
                                                    />
                                                    <span className="text-2xl">THB</span>
                                                </div>
                                                <div>
                                                    <p className="flex justify-end text-2xl">
                                                        {/* {!amount || isNaN(parseFloat(amount)) ? "0.00" : parseFloat(amount).toFixed(2)} */}
                                                        {!amount || isNaN(parseFloat(amount))
                                                            ? "0.00"
                                                            : parseFloat(amount).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex mt-4">


                                                <Drawer isOpen={drawerIsOpen} onOpenChange={setDrawerIsOpen}>
                                                    <DrawerTrigger asChild>
                                                        <Button 
                                                            variant="outline" 
                                                            disabled={isSellButtonDisabled()}
                                                            className={`w-full font-medium rounded-md text-lg px-5 py-6 ${
                                                                isSellButtonDisabled() 
                                                                ? "text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500" 
                                                                : "text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                                            }`}>
                                                            ขาย
                                                        </Button>
                                                    </DrawerTrigger>
                                                    <DrawerContent >
                                                        <div className="mx-auto w-full max-w-sm mt-3 mb-10">
                                                            <DrawerHeader>
                                                                <DrawerTitle  ><p className='font-normal text-2xl text-black' >ตรวจสอบการขาย</p></DrawerTitle>
                                                                <hr className='m-3' />
                                                               
                                                                
                                                                <div className='flex justify-between'>
                                                                    <DrawerDescription>จำนวนเหรียญที่ต้องการขาย</DrawerDescription>
                                                                    <DrawerDescription>{String(isNaN(quantity) ? "0" : quantity)}</DrawerDescription>
                                                                </div>
                                                                <div className='flex justify-between'>
                                                                    <DrawerDescription>เงินที่ได้รับ</DrawerDescription>
                                                                    <DrawerDescription>{String(isNaN(amount) ? "0" : amount)}</DrawerDescription>
                                                                </div>
                                                                <hr className='m-3' />
                                                                <div className='flex justify-between'>
                                                                    <DrawerDescription>ยอดเงินคงเหลือ (Cash)</DrawerDescription>
                                                                    <DrawerDescription>{String(isNaN(amount) || !cash?.totalSpent ? "0" : (cash?.totalSpent + amount))}</DrawerDescription>
                                                                </div>
                                                            </DrawerHeader>
                                                        </div>

                                                        <div>
                                                            <DrawerFooter className='mx-[550px]'>
                                                                <Button className='bg-black hover:bg-green-800 ' onClick={handleSellCoin}>ยืนยัน</Button>
                                                                <DrawerClose asChild>
                                                                    <Button variant="outline">ยกเลิก</Button>
                                                                </DrawerClose>
                                                            </DrawerFooter>
                                                        </div>
                                                    </DrawerContent>
                                                </Drawer>
                                            </div>
                                        </div>

                                    )}
                                    {/* <div className="mt-6 text-right text-red-600">
                                        <p>*** ทุกการลงทุนมีความเสี่ยง ***</p>
                                    </div> */}
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