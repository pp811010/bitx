  'use client'

  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { useEffect, useState, useCallback } from "react";
  import { FetchCoinData } from "@/data/fetchCoinData";
  import { Coin } from "@/utils/allType";
  import { MoveDiagonal, TrendingUp, Search } from 'lucide-react';
  import { Input } from "../ui/input";
  import Link from "next/link";
  import { ButtonIconUnFav } from "@/components/ui/ButtonIcoUnFav";
  import { addFav, getFav, unFav } from "@/actions/Fav/Fav";
  import { ButtonIconFav } from "../ui/ButtonIconFav";

  export default function CoinAllTable() {
    const [coin, setCoin] = useState<Coin[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 20;
    const [filterCoins, setFilterCoins] = useState<Coin[]>([]);
    const [choose, setChoose] = useState(true);
    const [favCoins, setFavCoins] = useState<string[]>([]);


    useEffect(() => {
      const getData = async () => {
        try {
          const data = await FetchCoinData();
          setCoin(data);
          setFilterCoins(data);

          const favData = await getFav();
          if (favData) {
            console.log('favData', favData);
            if (Array.isArray(favData)) {
              setFavCoins(favData.map((fav: any) => fav.coinName));
            }
            console.log('FavCoin ::: ', favCoins)
          }
        } catch (error) {
          console.log(error);
        }
      };

      getData();
    }, []);


    const favoriteData = filterCoins.filter((data) => favCoins.includes(data.id));

    const totalPages = Math.max(1, Math.ceil((choose ? filterCoins.length : favoriteData.length) / itemsPerPage));
    const currentData = (choose ? filterCoins : favoriteData).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToPage = (page: number) => setCurrentPage(page);


    const handleSearch = (searchInput: string) => {
      if (searchInput === '') {
        setFilterCoins(coin);
      } else {
        const searchCoin = coin.filter((item) =>
          item.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilterCoins(searchCoin);
      }
      setCurrentPage(1);
    };


    const handleFav = async (coinName: string) => {
      setFavCoins((prevFavs) =>
          prevFavs.includes(coinName)
              ? prevFavs.filter((fav) => fav !== coinName) 
              : [...prevFavs, coinName] 
      );
      try {
          if (favCoins.includes(coinName)) {
              await unFav(coinName);
          } else {
              await addFav(coinName);
          }
      } catch (error) {
          console.error("Error updating favorite:", error);
      }
  };
  
  
  

    return (
      <div className='mt-14'>
        <div className='flex gap-1'>
          <Button
            className={`${
              choose ? "bg-white text-[#adadad]" : "bg-[#FF6723] text-white"
            } hover:bg-[#FF6723] hover:text-white dark:hover:bg-[#FF6723]`}
            onClick={() => setChoose(!choose)}
          >
            Favorites
          </Button>
          <Button
            className={`${
              choose ? "bg-[#FF6723] text-white" : "bg-white text-[#adadad] dark:bg-gray-200"
            } hover:bg-[#FF6723] hover:text-white dark:hover:bg-[#FF6723]`}
            onClick={() => setChoose(!choose)}
          >
            Market
          </Button>
        </div>

        <div className='flex items-center justify-between gap-3 mb-10 rounded-sm mt-5'>
          <div className="flex gap-5 items-center">
            <p className='text-4xl font-normal'>Cryptocurrency Market</p>
            <p className='text-red-700'><TrendingUp /></p>
          </div>
          <div className="relative w-[250px]">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className='w-5'/>
            </span>
            <Input
              type="text"
              className=" text-sm rounded-sm pl-10 border"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Coin Name..."
            />
          </div>
        </div>

        <Table className='w-full'> 
          <TableHeader>
            <TableRow className="">
              <TableHead></TableHead>
              <TableHead className="text-center">Coin</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Price (THB)</TableHead>
              <TableHead className="text-center">24h Change</TableHead>
              <TableHead className="text-center">Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(choose ? currentData : favoriteData).map((item: Coin) => (
              <TableRow key={item.id} className="text-center border-none rounded-lg">
                <TableCell>
                  <div className='flex justify-start'>
                    {favCoins.includes(item.id) ? (
                      <ButtonIconFav onClick={() => handleFav(item.id)} />
                    ) : (
                      <ButtonIconUnFav onClick={() => handleFav(item.id)} />
                    )}
                  </div>
                </TableCell>
                <TableCell className='flex items-center justify-center '>
                  <img src={item.image} alt={item.name} className="w-10 h-10 " />
                </TableCell>
                <TableCell>{item.name} ({item.symbol.toUpperCase()})</TableCell>
                <TableCell>{item.current_price.toLocaleString()} ฿</TableCell>
                <TableCell className={`${item.price_change_percentage_24h < 0 ? "text-red-500 " : "text-green-500 "}`}>
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

        {choose && (
          <div className="flex justify-end mt-6 space-x-2">
            <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages}>Next</Button>
          </div>
        )}


      </div>
    );
  }
