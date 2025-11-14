import React, { useState } from "react";
import { Product } from "../types.ts";

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
    "block w-full rounded-lg border border-slate-300 px-3 py-2.5 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200";

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

export default ProductManagement;
