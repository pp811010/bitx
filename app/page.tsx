"use client";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import Barcoin from "@/components/Homepage/Barcoin";
import CoinAllTable from "@/components/Homepage/CoinAllTable";
import { createProfile } from "@/actions/Profile/action";
import { createCash } from "@/actions/Coin/action";
import HotCard from "@/components/Homepage/HotCard";
import { ChartNoAxesGantt } from 'lucide-react';
import HotCard2 from "@/components/Homepage/HotCard2";

const Page = () => {
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createProfileAndCash = async () => {
      if (isSignedIn) {
        try {
          console.time("createProfile & createCash");
          await Promise.all([createProfile(), createCash()]);
          console.timeEnd("createProfile & createCash");
          console.log("เส็ดเเล้ว");
        } catch (err) {
          console.error("Error creating profile or cash:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    

    createProfileAndCash();
  }, [isSignedIn, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p> 
      </div>
    );
  }

  return (
    <div className="mt-[-2px]">
      <Barcoin />
      <SignedOut>
        <div className="my-20">
          <p className="text-3xl font-semibold">
            Welcome to{" "}
            <span className="text-5xl text-[#FF8247] font-bold">BitX</span>{" "}
          </p>
          <p className="text-ml mt-2 text-gray-600">
            We are excited to have all crypto traders here to practice and
            enhance their trading skills.
          </p>
        </div>
      </SignedOut>

      <div className="bg-[#3F384C] dark:bg-[#232323] p-7 rounded-xl shadow-xl">
        <div className="flex items-center gap-2">
          <p className="text-4xl font-normal text-white">Market Overview </p>
          <ChartNoAxesGantt className="text-white" />
        </div>
        <div className="flex gap-5 mt-7">
          <HotCard />
          <SignedIn>
            <HotCard2 />
          </SignedIn>
        </div>
      </div>
      <CoinAllTable />
    </div>
  );
};

export default Page;
