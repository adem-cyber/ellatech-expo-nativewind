import React, { useState, useCallback, useMemo, useEffect } from "react";
import ReactDOM from "react-dom/client";

// --- From types.ts ---
interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  lastUpdated: string;
}

type TransactionType = "initial" | "increase" | "decrease";

interface Transaction {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
}

type AppTab = "dashboard" | "products" | "users" | "history";

// --- From hooks/useLocalStorage.ts ---
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// --- From components/Dashboard.tsx ---
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

const Dashboard = ({ products, users }: DashboardProps) => {
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

// --- From components/ProductManagement.tsx ---
interface ProductManagementProps {
  products: Product[];
  onRegisterProduct: (
    sku: string,
    name: string,
    price: number,
    quantity: number
  ) => void;
  onAdjustStock: (productId: string, amount: number) => void;
}

interface ProductRegistrationFormProps {
  onRegisterProduct: (
    sku: string,
    name: string,
    price: number,
    quantity: number
  ) => void;
}

const ProductRegistrationForm = ({
  onRegisterProduct,
}: ProductRegistrationFormProps) => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name || !price || !quantity) {
      setError("All fields are required.");
      return;
    }
    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity, 10);
    if (
      isNaN(priceNum) ||
      priceNum <= 0 ||
      isNaN(quantityNum) ||
      quantityNum < 0
    ) {
      setError("Please enter valid numbers for price and quantity.");
      return;
    }
    onRegisterProduct(sku, name, priceNum, quantityNum);
    setSku("");
    setName("");
    setPrice("");
    setQuantity("");
    setError("");
  };

  const inputClasses =
    "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Register New Product
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center"
      >
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className={inputClasses}
        />
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputClasses} lg:col-span-2`}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0.01"
          step="0.01"
          className={inputClasses}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          step="1"
          className={inputClasses}
        />
        <button
          type="submit"
          className="w-full md:col-span-2 lg:col-span-1 bg-violet-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-violet-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

interface ProductListProps {
  products: Product[];
  onAdjustStock: (productId: string, amount: number) => void;
}

const ProductList = ({ products, onAdjustStock }: ProductListProps) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Product Inventory
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(product.lastUpdated).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onAdjustStock(product.id, -1)}
                        disabled={product.quantity <= 0}
                        className="p-1.5 bg-rose-100 text-rose-700 rounded-full hover:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-rose-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 12H6"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onAdjustStock(product.id, 1)}
                        className="p-1.5 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-500">
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
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-slate-700">
                      No Products Found
                    </h3>
                    <p className="text-sm">
                      Register a new product to get started.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductManagement = ({
  products,
  onRegisterProduct,
  onAdjustStock,
}: ProductManagementProps) => {
  return (
    <div className="space-y-8">
      <ProductRegistrationForm onRegisterProduct={onRegisterProduct} />
      <ProductList products={products} onAdjustStock={onAdjustStock} />
    </div>
  );
};

// --- From components/UserManagement.tsx ---
interface UserManagementProps {
  users: User[];
  onRegisterUser: (fullName: string, email: string) => void;
}

interface UserRegistrationFormProps {
  onRegisterUser: (fullName: string, email: string) => void;
}

const UserRegistrationForm = ({
  onRegisterUser,
}: UserRegistrationFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError("Both fields are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    onRegisterUser(fullName, email);
    setFullName("");
    setEmail("");
    setError("");
  };

  const inputClasses =
    "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Register New User
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`${inputClasses} md:col-span-1`}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputClasses} md:col-span-1`}
        />
        <button
          type="submit"
          className="bg-violet-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-violet-700 transition duration-300 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Register User
        </button>
      </form>
    </div>
  );
};

interface UserListProps {
  users: User[];
}

const UserList = ({ users }: UserListProps) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Registered Users
      </h2>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 flex items-start space-x-4"
            >
              <div className="flex-shrink-0 h-10 w-10 bg-violet-200 text-violet-700 rounded-full flex items-center justify-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">
                  {user.fullName}
                </p>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.664v.005z"
              />
            </svg>
            <h3 className="text-lg font-medium text-slate-700">
              No Users Found
            </h3>
            <p className="text-sm">Register a new user to see them here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const UserManagement = ({ users, onRegisterUser }: UserManagementProps) => {
  return (
    <div className="space-y-8">
      <UserRegistrationForm onRegisterUser={onRegisterUser} />
      <UserList users={users} />
    </div>
  );
};

// --- From components/TransactionHistory.tsx ---
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

// --- App Component ---
const App = () => {
  const [users, setUsers] = useLocalStorage<User[]>("users", []);
  const [products, setProducts] = useLocalStorage<Product[]>("products", []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions",
    []
  );
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");

  const addTransaction = useCallback(
    (product: Product, type: TransactionType, amount: number) => {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        productId: product.id,
        sku: product.sku,
        productName: product.name,
        type: type,
        amount: Math.abs(amount),
        timestamp: new Date().toISOString(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    },
    [setTransactions]
  );

  const handleRegisterUser = useCallback(
    (fullName: string, email: string) => {
      const newUser: User = {
        id: crypto.randomUUID(),
        fullName,
        email,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
    },
    [setUsers]
  );

  const handleRegisterProduct = useCallback(
    (sku: string, name: string, price: number, quantity: number) => {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        sku,
        name,
        price,
        quantity,
        lastUpdated: new Date().toISOString(),
      };
      setProducts((prev) => [...prev, newProduct]);
      addTransaction(newProduct, "initial", quantity);
    },
    [setProducts, addTransaction]
  );

  const handleAdjustStock = useCallback(
    (productId: string, amount: number) => {
      setProducts((prevProducts) => {
        const newProducts = prevProducts.map((p) => {
          if (p.id === productId) {
            const newQuantity = p.quantity + amount;
            if (newQuantity < 0) return p;
            const updatedProduct = {
              ...p,
              quantity: newQuantity,
              lastUpdated: new Date().toISOString(),
            };
            addTransaction(
              updatedProduct,
              amount > 0 ? "increase" : "decrease",
              amount
            );
            return updatedProduct;
          }
          return p;
        });
        return newProducts;
      });
    },
    [setProducts, addTransaction]
  );

  const TabButton = ({
    tab,
    children,
  }: {
    tab: AppTab;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
        activeTab === tab
          ? "bg-violet-100 text-violet-700"
          : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <svg
                className="w-8 h-8 text-violet-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12.75h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                />
              </svg>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Inventory System
              </h1>
            </div>
            <nav className="flex space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-lg">
              <TabButton tab="dashboard">Dashboard</TabButton>
              <TabButton tab="products">Products</TabButton>
              <TabButton tab="users">Users</TabButton>
              <TabButton tab="history">History</TabButton>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "dashboard" && (
          <Dashboard
            products={products}
            users={users}
            transactions={transactions}
          />
        )}
        {activeTab === "products" && (
          <ProductManagement
            products={products}
            onRegisterProduct={handleRegisterProduct}
            onAdjustStock={handleAdjustStock}
          />
        )}
        {activeTab === "users" && (
          <UserManagement users={users} onRegisterUser={handleRegisterUser} />
        )}
        {activeTab === "history" && (
          <TransactionHistory transactions={transactions} />
        )}
      </main>
    </div>
  );
};

// --- Rendering Logic ---
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
