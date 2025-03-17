'use client'
import CoinCard from "@/components/asset/CoinCard"
import { getAllAsset } from "@/actions/Coin/action"
import { useEffect, useState } from "react"
// import { UserRound } from 'lucide-react';
import BalanceCard from "@/components/asset/BalanceCard";
// import { Button } from "@/components/ui/button";
import { CircleUserRound } from 'lucide-react';
import { Asset, User } from "@/utils/allType";

const Assets = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchAsset = async () => {
      const response = await getAllAsset()
      if (response && response.result) {
        setUser(response.result) 
        console.log('Fetched assets:', response.result)
      } else {
        setUser(null)
      }
    }
    fetchAsset()
  }, [])

  

  return (
    <div className="content2 flex flex-col gap-[13px]">
      <div className='flex items-center gap-3 justify-between px-[5px]'>
        <div className='flex gap-4 items-center'>
          <CircleUserRound />
          <p className='text-2xl font-sans'>{user?.firstName} {user?.lastName}</p>
        </div>
        <div className="flex flex-col gap-2 w-[400px]">
          <BalanceCard allMyAssets={user?.assets} />
        </div>
      </div>

      <div className='w-full'>
        <div className='flex flex-col gap-10'>
          <div className="sm:w-full flex flex-col">
            <div className=' rounded-xl  mt-5 mb-8 '>
              <p className='text-2xl font-normal'>Your Assets : {user?.assets.length}</p>
            </div>
            <div className={ 'grid grid-cols-3 gap-5'}>
              {user?.assets ? (
                user.assets.map((data) => (
                  <CoinCard
                    key={data.id} 
                    data={data}  />
                ))
              ) : (
                <p>Loading assets...</p>
              )}
            </div>
          </div>
        </div>

      </div>

     
    </div>
  )
}

export default Assets
