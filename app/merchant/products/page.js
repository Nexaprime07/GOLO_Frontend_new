"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Package, Plus, Search, Trash2, User, Wallet } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { deleteMerchantProduct, getMerchantProducts } from "../../lib/api";

export default function MerchantProductsPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inventoryValue: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const handleMerchantLogout = async () => {
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/products");
      return;
    }

    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || user.accountType !== "merchant") return;

    const fetchProducts = async () => {
      try {
        setIsFetching(true);
        setFetchError("");
        const res = await getMerchantProducts({ page, limit: 10, search });
        setProducts(res?.data?.products || []);
        setStats(
          res?.data?.stats || {
            totalProducts: 0,
            inventoryValue: 0,
            lowStockProducts: 0,
            outOfStockProducts: 0,
          }
        );
        setPagination(
          res?.pagination || {
            total: 0,
            page,
            pages: 1,
            limit: 10,
          }
        );
      } catch (error) {
        setFetchError(error?.message || "Failed to load products");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProducts();
  }, [user, page, search]);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteMerchantProduct(productId);
      setProducts((prev) => prev.filter((item) => item.id !== productId));
      setStats((prev) => ({
        ...prev,
        totalProducts: Math.max(0, (prev.totalProducts || 0) - 1),
      }));
    } catch (error) {
      window.alert(error?.message || "Failed to delete product");
    }
  };

  const inventoryValueLabel = useMemo(() => {
    const value = Number(stats?.inventoryValue || 0);
    return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
  }, [stats?.inventoryValue]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#efefef]" />;
  }

  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#ececec] text-[#1b1b1b]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <header className="sticky top-0 z-[9999] h-16 bg-[#efb02e] border-b border-[#d7a02a] px-8 lg:px-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-[180px]">
          <button type="button" onClick={() => router.push("/merchant/dashboard")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow font-bold" style={{ color: "#157a4f" }}>
              G
            </div>
            <span className="text-xl font-semibold tracking-wide text-[#157a4f]">GOLO</span>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-8 text-[12px] font-semibold text-[#5a4514]">
          <nav className="flex items-center gap-8">
            <button onClick={() => router.push("/merchant/dashboard")}>Overview</button>
            <button onClick={() => router.push("/merchant/orders")}>Orders</button>
            <button onClick={() => router.push("/merchant/products")} className="relative h-16 text-[#157a4f]">
              Products
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#157a4f]" />
            </button>
            <button onClick={() => router.push("/merchant/offers")}>Offers</button>
            <button onClick={() => router.push("/merchant/banners")}>Banners</button>
            <button onClick={() => router.push("/merchant/analytics")}>Analytics</button>
          </nav>

          <button type="button" onClick={() => router.push("/merchant/profile")} className="w-10 h-10 rounded-full bg-white shadow-md hover:scale-105 transition flex items-center justify-center" aria-label="Profile">
            <User size={18} style={{ color: "#157a4f" }} />
          </button>
        </div>
      </header>

      <main className="w-full px-8 lg:px-10 py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-5">
          <section>
            <h1 className="text-[42px] font-semibold leading-none text-[#1e1e1e]">Product Inventory</h1>
            <p className="mt-3 text-[13px] text-[#6f6f6f] max-w-[500px]">
              Manage your product catalog, monitor stock levels, and update pricing.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-[12px] border border-[#e2e2e2] bg-white px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#666]">Total Products</p>
                <p className="text-[34px] font-semibold leading-none mt-1">{stats.totalProducts || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f4f4f1] text-[#2cb56e] flex items-center justify-center">
                <Package size={18} />
              </div>
            </div>

            <div className="rounded-[12px] border border-[#e2e2e2] bg-white px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#666]">Inventory Value</p>
                <p className="text-[34px] font-semibold leading-none mt-1">{inventoryValueLabel}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f4f4f1] text-[#e2a112] flex items-center justify-center">
                <Wallet size={18} />
              </div>
            </div>

            <div className="rounded-[12px] border border-[#e2e2e2] bg-white px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#666]">Out Of Stock</p>
                <p className="text-[34px] font-semibold leading-none mt-1">{stats.outOfStockProducts || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#f7eef0] text-[#f27f9f] flex items-center justify-center">
                <Package size={18} />
              </div>
            </div>
          </section>

          <section className="rounded-[12px] border border-[#e5e5e5] bg-[#f9f9f9] p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full max-w-[620px]">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a4a4a4]" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setPage(1);
                      setSearch(searchInput.trim());
                    }
                  }}
                  className="h-9 w-full rounded-[8px] border border-[#e2e2e2] bg-white pl-8 pr-3 text-[12px] outline-none"
                  placeholder="Search by product name"
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="h-9 rounded-[8px] border border-[#e2e2e2] bg-white px-4 text-[11px] text-[#666] inline-flex items-center gap-1.5">
                  <Download size={12} /> Export CSV
                </button>
                <button
                  onClick={() => {
                    setPage(1);
                    setSearch(searchInput.trim());
                  }}
                  className="h-9 rounded-[8px] border border-[#e2e2e2] bg-white px-4 text-[11px] text-[#666]"
                >
                  Apply Search
                </button>
                <button onClick={() => router.push("/merchant/products/add")} className="h-9 rounded-[8px] bg-[#2f9e58] px-4 text-[11px] font-semibold text-white inline-flex items-center gap-1.5">
                  <Plus size={12} /> Add New Product
                </button>
              </div>
            </div>

            {fetchError ? <p className="mt-3 text-[12px] text-[#ef4d4d]">{fetchError}</p> : null}

            <div className="mt-4 overflow-hidden rounded-[10px] border border-[#ececec] bg-white">
              <table className="w-full text-[12px]">
                <thead className="bg-[#f2f3f5] text-[#666]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Image</th>
                    <th className="px-4 py-3 text-left font-semibold">Product Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Price</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Stock</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.id} className="border-t border-[#f0f0f0]">
                      <td className="px-4 py-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden border border-[#ececec]">
                          <Image src={item.image || "/images/deal2.avif"} alt={item.name} width={32} height={32} className="h-full w-full object-cover" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#2a2a2a]">{item.name}</td>
                      <td className="px-4 py-3 font-semibold">{item.priceLabel || `?${item.price}`}</td>
                      <td className="px-4 py-3">
                        {item.status === "Out of Stock" ? (
                          <span className="inline-flex rounded-full bg-[#ef4d4d] px-2 py-0.5 text-[10px] font-semibold text-white">Out of Stock</span>
                        ) : (
                          <span>{item.status}</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 ${item.status === "Out of Stock" ? "text-[#ef4d4d]" : ""}`}>{item.stock}</td>
                      <td className="px-4 py-3 text-[11px]">
                        <button
                          onClick={() => router.push(`/merchant/products/details?id=${item.id}`)}
                          className="inline-flex items-center gap-1 rounded-[6px] border border-[#e5b54e] bg-[#fff7e2] px-3 py-1 text-[#b77905] font-semibold"
                        >
                          <Eye size={12} /> View
                        </button>
                        <span className="mx-2 text-[#cfcfcf]">/</span>
                        <button onClick={() => handleDeleteProduct(item.id)} className="text-[#ef4d4d] font-semibold">
                          <span className="inline-flex items-center gap-1 rounded-[6px] border border-[#f0c6c6] bg-[#fff0f0] px-3 py-1 text-[#d63f3f] font-semibold">
                            <Trash2 size={12} /> Delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!isFetching && products.length === 0 ? (
                    <tr className="border-t border-[#f0f0f0]">
                      <td colSpan={6} className="px-4 py-6 text-center text-[12px] text-[#777]">
                        No products found
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>

              <div className="flex items-center justify-between border-t border-[#ececec] bg-[#f2f3f5] px-4 py-3 text-[11px] text-[#666]">
                <p>Showing {products.length} of {pagination.total || 0} products</p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className="h-7 rounded-[6px] border border-[#e1e1e1] bg-white px-3 text-[#666] disabled:text-[#b3b3b3]"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= (pagination.pages || 1)}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="h-7 rounded-[6px] border border-[#7fc69a] bg-[#eefaf2] px-3 text-[#2f9e58] disabled:opacity-60"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-6 bg-[#e8ad2f] border-t border-[#d49b22] text-[#2f2a1f]">
        <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-10 py-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[3px] bg-[#0f7d49] text-white text-[26px] font-bold flex items-center justify-center leading-none">G</div>
              <span className="text-[34px] leading-none font-semibold text-[#0f7d49]">GOLO</span>
            </div>
            <p className="mt-3 text-[12px] max-w-[250px]">The all-in-one management platform for modern businesses. Empowering growth through analytics and intuitive product management.</p>
          </div>
          <div>
            <p className="text-[20px] font-bold">Links</p>
            <div className="mt-3 space-y-2 text-[13px]"><p>Overview</p><p>Inventory</p><p>Posts</p><p>Profile</p></div>
          </div>
          <div className="pt-8 md:pt-9 space-y-2 text-[13px]"><p>Analytics</p><p>Contact</p></div>
          <div>
            <p className="text-[20px] font-bold">Support</p>
            <div className="mt-3 space-y-2 text-[13px]"><p>Help Center</p><p>Security</p><p>Terms of Service</p></div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-10 py-3 border-t border-[#d49b22] flex items-center justify-between gap-3 text-[11px]"><p>� 2026 GOLO Dashboard. All rights reserved.</p></div>
      </footer>
    </div>
  );
}
