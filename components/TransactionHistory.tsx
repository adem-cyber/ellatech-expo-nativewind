import React, { useState, useMemo } from "react";
import { Transaction } from "../types.ts";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const ITEMS_PER_PAGE = 10;

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

  const currentTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const getTransactionTypePill = (type: Transaction["type"]) => {
    const styles = {
      initial: "bg-sky-100 text-sky-800",
      increase: "bg-emerald-100 text-emerald-800",
      decrease: "bg-rose-100 text-rose-800",
    };
    const text = {
      initial: "Initial",
      increase: "Increase",
      decrease: "Decrease",
    };
    return (
      <span
        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[type]}`}
      >
        {text[type]}
      </span>
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Transaction History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {currentTransactions.length > 0 ? (
              currentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {tx.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {tx.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getTransactionTypePill(tx.type)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      tx.type === "increase" || tx.type === "initial"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {tx.type === "decrease" ? "−" : "+"}
                    {tx.amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-16 text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-slate-400 mb-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-slate-700">
                      No Transactions Found
                    </h3>
                    <p className="text-sm">
                      Changes to product stock will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
