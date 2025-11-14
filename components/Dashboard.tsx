import React, { useMemo } from "react";
import { Product, User, Transaction } from "../types.ts";

interface DashboardProps {
  products: Product[];
  users: User[];
  transactions: Transaction[];
}

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4">
    <div className="bg-violet-100 text-violet-600 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const LowStockProducts = ({ products }: { products: Product[] }) => {
  const lowStockItems = products
    .filter((p) => p.quantity <= 5)
    .sort((a, b) => a.quantity - b.quantity);

  if (lowStockItems.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Low Stock Warning
        </h3>
        <div className="text-center py-8 text-slate-500">
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 text-emerald-500 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-slate-700">
              All products are well-stocked!
            </h3>
            <p className="text-sm">No items are currently running low.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Low Stock Warning
      </h3>
      <ul className="divide-y divide-slate-200">
        {lowStockItems.map((product) => (
          <li
            key={product.id}
            className="py-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-slate-800">{product.name}</p>
              <p className="text-sm text-slate-500">SKU: {product.sku}</p>
            </div>
            <p className="text-lg font-bold text-rose-500">
              {product.quantity} units
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Dashboard = ({ products, users, transactions }: DashboardProps) => {
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
    const inventoryValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const totalUsers = users.length;
    return { totalProducts, totalUnits, inventoryValue, totalUsers };
  }, [products, users]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Units"
          value={stats.totalUnits}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
        />
        <StatCard
          title="Inventory Value"
          value={`$${stats.inventoryValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>
          }
        />
        <StatCard
          title="Registered Users"
          value={stats.totalUsers}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.78-4.125"
              />
            </svg>
          }
        />
      </div>

      <LowStockProducts products={products} />
    </div>
  );
};

export default Dashboard;
