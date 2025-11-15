/// <reference types="react" />
import { Product } from "../types";
import { useState } from "react";

interface Props {
  products: Product[];
  onRegisterProduct: (
    sku: string,
    name: string,
    price: number,
    quantity: number
  ) => void;
  onAdjustStock: (id: string, amount: number) => void;
}

/* ---------- Registration Form ---------- */
const ProductRegistrationForm = ({
  onRegisterProduct,
}: {
  onRegisterProduct: Props["onRegisterProduct"];
}) => {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name || !price || !quantity) {
      setError("All fields required");
      return;
    }
    const p = parseFloat(price),
      q = parseInt(quantity, 10);
    if (isNaN(p) || p <= 0 || isNaN(q) || q < 0) {
      setError("Valid price & quantity");
      return;
    }
    onRegisterProduct(sku, name, p, q);
    setSku("");
    setName("");
    setPrice("");
    setQuantity("");
    setError("");
  };

  const inp =
    "block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition";

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-violet-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Register New Product
      </h2>
      {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}
      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className={inp}
        />
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inp} lg:col-span-2`}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0.01"
          step="0.01"
          className={inp}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          step="1"
          className={inp}
        />
        <button
          type="submit"
          className="lg:col-span-1 bg-violet-600 text-white font-semibold py-3 rounded-xl hover:bg-violet-700 transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

/* ---------- Product List ---------- */
const ProductList = ({
  products,
  onAdjustStock,
}: {
  products: Product[];
  onAdjustStock: Props["onAdjustStock"];
}) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg overflow-hidden">
    <h2 className="text-xl font-bold text-slate-800 mb-5">Product Inventory</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {["SKU", "Name", "Price", "Qty", "Last Updated", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.length ? (
            products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {p.sku}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{p.name}</td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-slate-900">
                  {p.quantity}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(p.lastUpdated).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onAdjustStock(p.id, -1)}
                      disabled={p.quantity === 0}
                      className="p-2 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:opacity-40 transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                      onClick={() => onAdjustStock(p.id, 1)}
                      className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
              <td colSpan={6} className="text-center py-12 text-slate-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
                <p className="font-medium">No products yet</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default function ProductManagement({
  products,
  onRegisterProduct,
  onAdjustStock,
}: Props) {
  return (
    <div className="space-y-8">
      <ProductRegistrationForm onRegisterProduct={onRegisterProduct} />
      <ProductList products={products} onAdjustStock={onAdjustStock} />
    </div>
  );
}
