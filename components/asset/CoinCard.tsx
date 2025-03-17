import {
  Card,
  CardDescription,
  CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import { FetchCoinDataDetail } from "@/data/fetchCoinData";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { calProfit } from "@/actions/Coin/action";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "../ui/button";
import Link from "next/link";

import {  ProfitResult,   } from "@/utils/allType";


const CoinCard = (props: any) => {
  const { data } = props;
  const [coindetail, setCoindetail] = useState<any>(' ');
  const [view, setView] = useState<boolean>(false);
  const [profit, setProfit] = useState<number>(0);
  const [profitPercent, setProfitPercent] = useState<number>(0);
  const [alldetail, setAllDetail] = useState<ProfitResult  | null>(null);

  interface CoinData {
  name: string;
  totalSpent: number;
}



  useEffect(() => {
    const fetchData = async () => {
      if (data.name !== "Cash") {
        const detail = await FetchCoinDataDetail(data.name)
        setCoindetail(detail);


        const profitData  = await calProfit(data.name)
        if ('message' in profitData) {
          console.log(profitData.message); 
        } else {
          setAllDetail(profitData);
          setProfit(profitData.resultProfit);
          setProfitPercent(profitData.resultProfitPercent);
        }     
      }
    };
    fetchData();
  }, [data.name]);

  if (!coindetail || (Array.isArray(coindetail) && coindetail.length === 0)) {
    return null; 
  }
  

  return (
    <div className="w-full flex flex-col gap-4 cursor-pointer hover:scale-105 transition-transform">
      {data.name === "Cash" ? (
        <Card>
          <CardHeader>
            <CardDescription>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-[5px] h-5 bg-red-500"></div>
                  <Wallet className="ml-2" />
                  <p className="ml-2">Cash</p>
                </div>
                <span>{data.totalSpent.toLocaleString()} THB</span>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card onClick={() => alldetail && setView(!view)}>
          <CardHeader>
            <CardDescription>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-[5px] h-5 bg-red-500"></div>
                  <img
                    src={coindetail?.image}
                    alt="Coin image"
                    className="w-6 h-6 object-cover ml-2"
                  />
                  <p className="ml-2 text-[13px]">{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span>{data.totalSpent.toLocaleString()} THB</span>
                  <span className={profit >= 0 ? "text-green-500" : "text-red-500"}>
                    {profit !== 0 ? `${profit.toLocaleString()}` : ""}
                  </span>
                  <span className={profit >= 0 ? "text-green-500" : "text-red-500"}>
                    {profit !== 0 ? `(${profitPercent.toLocaleString()}%)` : ""}
                  </span>
                  {view ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </CardDescription>
          </CardHeader>

          {view && alldetail && (
              <div className={`mt-4 p-4 border-t transition-height ${view ? 'open' : ''}`}>
                
                      <p>Detail : {data.name.charAt(0).toUpperCase() + data.name.slice(1)}</p>
                      <hr className='mt-2'/>
                      <div className='flex flex-col gap-1 mt-2'>
                        <div className='flex justify-between items-center text-sm'>
                            <CardDescription className='text-sm' >จำนวนเหรียญ</CardDescription>
                            <CardDescription className='text-sm'>{alldetail.myCoin.quantity}</CardDescription>
                        </div>
                        <div className='flex justify-between items-center text-sm '>
                            <CardDescription className='text-sm'>เงินรวมที่จ่ายไป </CardDescription>
                            <CardDescription className='text-sm'>{alldetail.myCoin.totalSpent}</CardDescription>
                        </div>
                        <div className='flex justify-between items-center text-sm '>
                            <CardDescription className='text-sm'>ราคาเฉลี่ยต่อเหรียญ</CardDescription>
                            <CardDescription className='text-sm'>{alldetail.avgPriceCoin}</CardDescription>
                        </div>
                        <div className='flex justify-between items-center text-sm '>
                            <CardDescription className='text-sm'>ราคาเฉลี่ยต่อเหรียญ * เหรียญ</CardDescription>
                            <CardDescription className='text-sm'>{alldetail.hasPriceHold.toLocaleString()}</CardDescription>
                        </div>
                        <div className='flex justify-between items-center text-sm '>
                            <CardDescription className='text-sm'>ราคาเหรียญตอนนี้</CardDescription>
                            <CardDescription className='text-sm'>{coindetail.current_price}</CardDescription>
                        </div>
                        <div className='flex justify-between items-center text-sm '>
                            <CardDescription className='text-sm'>ราคาเหรียญตอนนี้ * เหรียญ</CardDescription>
                            <CardDescription className='text-sm'>{alldetail.hasPriceNow.toLocaleString()}</CardDescription>
                        </div>
                        <hr/>
                        <div className='flex justify-between items-center text-sm '>
                            <CardDescription className='text-sm'>กำไร-ขาดทุน</CardDescription>
                            <CardDescription className='text-sm'>{profit.toFixed(4).toLocaleString()}</CardDescription>
                       </div>
                        <div className='w-full mt-3 grid grid-cols-2 bg-[#ebebeb] p-1 rounded-md gap-2 dark:bg-slate-500'>
                          <Link href={`./coin/${data.name}`}>
                            <Button className='w-full bg-[#ebebeb] text-sm text-black border py-1 px-2 rounded-sm hover:text-green-400 hover:border-green-500 transition-colors duration-200 hover:bg-white'>
                              Buy
                            </Button>
                            </Link>
                          
                          <Link href={`./coin/${data.name}`}>
                          <Button className='w-full bg-[#ebebeb] text-sm text-black border py-1 px-2 rounded-sm hover:text-red-400 hover:border-red-500 transition-colors duration-200 hover:bg-white'>
                            Sell
                          </Button>
                          </Link>
                                            
                        </div>
                      </div>

                     

            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default CoinCard;
