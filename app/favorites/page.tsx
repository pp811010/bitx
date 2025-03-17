'use client'
import { getFav, unFav } from "@/actions/Fav/Fav";
import { FetchCoinData } from '@/data/fetchCoinData'
import Barcoin from "@/components/Homepage/Barcoin";
import { MoveDiagonal } from 'lucide-react';
import { ButtonIconFav } from "@/components/ui/ButtonIconFav";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";
import Link from "next/link";
type Coin = {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
};

type FavCoin = Coin;
const page = () => {
    const [fav, setFav] = useState<FavCoin[]>([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const getdata = async () => {
            setLoading(true); // เริ่มโหลดข้อมูล
            try {
                let favdata = await getFav();
                const favdatanew = favdata.map((item: { coinName: string }) => item.coinName);
                
                const alldata = await FetchCoinData();
                if (favdata && alldata) {
                    const favReal = alldata.filter(item => favdatanew.includes(item.id));
                    setFav(favReal);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // โหลดเสร็จแล้ว
            }
        };

        getdata();
    }, []);

    const handleFav = async (name: string) => {
        if (name) {
            const unFavdata = fav.filter(item => item.id !== name);
            setFav(unFavdata);
            await unFav(name);
        }
    };

    return (
        <div className='content2 mt-[-45px]'>
            <Barcoin />
            <p className='my-10 text-3xl'>Favorites Coin</p>

            {loading ? (
                <p className="text-center text-lg text-gray-500">Loading...</p>
            ) : fav.length > 0 ? (
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead className="text-center">Coin</TableHead>
                                <TableHead className="text-center">Name</TableHead>
                                <TableHead className="text-center">Price (THB)</TableHead>
                                <TableHead className="text-center">24h Change</TableHead>
                                <TableHead className="text-center">Market Cap</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fav.map((item) => (
                                <TableRow key={item.id} className="text-center border-none rounded-lg">
                                    <TableCell>
                                        <div className='flex justify-start'>
                                            <ButtonIconFav onClick={() => handleFav(item.id)} />
                                        </div>
                                    </TableCell>
                                    <TableCell className='flex items-center justify-center'>
                                        <img src={item.image} alt={item.name} className="w-10 h-10" />
                                    </TableCell>
                                    <TableCell>{item.name} ({item.symbol.toUpperCase()})</TableCell>
                                    <TableCell>{item.current_price.toLocaleString()} ฿</TableCell>
                                    <TableCell className={`${item.price_change_percentage_24h < 0 ? "text-red-500" : "text-green-500"}`}>
                                        {item.price_change_percentage_24h.toFixed(2)}%
                                    </TableCell>
                                    <TableCell>{item.market_cap.toLocaleString()} ฿</TableCell>
                                    <TableCell>
                                        <Link href={`/coin/${item.id}`}>
                                            <MoveDiagonal className="text-blue" size={16} />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-center text-lg text-gray-500">ยังไม่มีเหรียญที่ชอบ</p>
            )}
        </div>
    );
};

export default page;
