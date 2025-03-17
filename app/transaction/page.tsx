"use client";
import { ShoppingCart, HandCoins } from "lucide-react";
import { useEffect, useState } from "react";
import { FetchTransaction } from "@/actions/activity/action";
import Barcoin from "@/components/Homepage/Barcoin";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isBuy, setIsBuy] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await FetchTransaction();
      setTransactions(res.transaction);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="mt-[-45px] content2">
      <Barcoin />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Transactions
      </h1>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <p className="ml-4 text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div
              key={index}
              className="relative flex flex-col dark:from-gray-800 dark:to-gray-700 shadow-lg border border-gray-300 dark:border-gray-600 rounded-xl p-5 transition-all hover:scale-105 hover:shadow-xl "
            >
              <p className="mb-2 text-gray-500 dark:text-gray-400 text-sm">
                {new Date(transaction.timestamp).toLocaleString("th-TH")}
              </p>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="flex justify-start">
                  {transaction.type === "BUY" ? (
                    <ShoppingCart
                      size={48}
                      className="text-green-500 dark:text-green-400"
                    />
                  ) : (
                    <HandCoins
                      size={48}
                      className="text-red-500 dark:text-red-400"
                    />
                  )}

                </div>
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {transaction.type === "BUY"
                      ? `ซื้อ ${transaction.asset.name}`
                      : `ขาย ${transaction.asset.name}`}
                  </h1>
                  <p
                    className={`text-sm font-semibold ${transaction.status === "Success"
                      ? "text-green-500"
                      : "text-red-500"
                      }`}
                  >
                    {transaction.status}
                  </p>
                </div>

                <div className="flex flex-col justify-end text-right">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {transaction.type === "BUY" ? (
                      <>
                        <span>{transaction.price}</span>
                        <span className="text-black dark:text-gray-200"> บาท</span>
                      </>
                    ) : (
                      <>
                        <span>{transaction.quantity}</span>
                        {/* <span className="text-gray-500 dark:text-gray-400"> {transaction.asset.name}</span> */}
                      </>
                    )}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ได้รับ{" "}
                    <span className="text-green-400">
                      {transaction.type === "BUY" ? (
                        <>
                        <span>{transaction.quantity}</span>
                        <span className="text-gray-500 dark:text-gray-400"> {transaction.asset.name}</span>
                        </>
                      ) : (
                        <>
                          <span>{transaction.price}</span>
                          <span className="text-gray-500 dark:text-gray-400"> บาท</span>
                        </>
                      )}
                    </span>
                  </p>
                </div>

              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
            ไม่มีรายการ
          </p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
