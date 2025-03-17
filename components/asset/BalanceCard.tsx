import { calAssettotal } from "@/actions/Coin/action";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { Asset } from "@/utils/allType";

type BalanceCardProps = {
  allMyAssets?: Asset[];
};

function BalanceCard({ allMyAssets = [] }: BalanceCardProps) {
  const [balance, setBalance] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [profitPercent, setProfitPercent] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (allMyAssets.length === 0) {
        setBalance(0);
        setProfit(0);
        setProfitPercent(0);
        return;
      }

      try {
        const response = await calAssettotal(allMyAssets);
        if ("message" in response) {
          console.log("Error total assets : ", response.message);
        } else {
          setBalance(response.total);
          setProfit(response.profitTotal);
          setProfitPercent(response.profitTotalPercent);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [allMyAssets]);

  return (
    <Card className="p-4 w-[350px] bg-white dark:bg-transparent rounded-xl shadow-md">
      <CardHeader>
        <CardTitle>
          <div className="grid grid-cols-2">
            <div>
              <CardDescription className="font-normal text-lg">Assets Balance</CardDescription>
            </div>
            <div className="flex justify-end text-green-400">
              <Link href="/cash/">
                <CirclePlus size={22} />
              </Link>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex items-center justify-between">
            <CardDescription className="text-xl my-3 text-center w-full font-normal">
              {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} THB
              {allMyAssets.length !== 1 && (
                <span
                  className={`ml-2 ${profit >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {profit >= 0
                    ? `+${profit.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${profitPercent.toLocaleString(undefined, { minimumFractionDigits: 2 })}%)`
                    : `${profit.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${profitPercent.toLocaleString(undefined, { minimumFractionDigits: 2 })}%)`}
                </span>
              )}
            </CardDescription>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default BalanceCard;
