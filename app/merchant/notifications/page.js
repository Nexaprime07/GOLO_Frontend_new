"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  MessageSquare,
  Globe,
  Plus,
  UserCircle2,
  LayoutDashboard,
  UserCog,
  List,
  Layers,
  Flag,
  LifeBuoy,
  ShieldAlert,
  Star,
  Megaphone,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronDown,
  Send,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  Filter,
  Download,
  Smartphone,
  Clock3,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../lib/api";

export default function MerchantNotificationsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [rows, setRows] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setPageLoading(true);
      setError("");
      const res = await getNotifications({ page: 1, limit: 50 });
      const payload = res?.data || {};
      const notifications = Array.isArray(payload.notifications) ? payload.notifications : [];
      setRows(notifications.map((n) => ({
        id: n._id,
        title: n.message || n.type || "Notification",
        tags: [n.type || "in-app"],
        audience: n.adTitle || "Merchant",
        status: n.read ? "Read" : "Unread",
        createdAt: n.createdAt,
      })));
      setUnreadCount(Number(payload.unreadCount || 0));
    } catch (err) {
      setError(err?.message || "Failed to load notifications");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/notifications");
      return;
    }
    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user?.accountType === "merchant") {
      loadNotifications();
    }
  }, [loading, user]);

  const topCards = useMemo(() => {
    const read = rows.filter((row) => row.status === "Read").length;
    const unread = rows.filter((row) => row.status === "Unread").length;
    return [
      { label: "Total Notifications", value: String(rows.length), trend: "Live", icon: Send, down: false },
      { label: "Unread", value: String(unreadCount || unread), trend: "Needs attention", icon: CalendarCheck, down: false },
      { label: "Read", value: String(read), trend: "Processed", icon: AlertCircle, down: false },
      { label: "Avg. Open Rate", value: rows.length ? `${Math.round((read / rows.length) * 100)}%` : "0%", trend: "Live", icon: BarChart3, down: false },
      { label: "Active Alerts", value: String(unread), trend: "Current", icon: CheckCircle2, down: unread > 0 },
    ];
  }, [rows, unreadCount]);

  const markOneRead = async (id) => {
    try {
      await markNotificationRead(id);
      await loadNotifications();
    } catch (err) {
      setError(err?.message || "Failed to mark notification as read");
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch (err) {
      setError(err?.message || "Failed to mark all notifications as read");
    }
  };

  if (loading || !user) return <div className="min-h-screen bg-[#f3f4f6]" />;
  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-[#111827] flex" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <aside className="w-[250px] bg-[#f8f9fb] border-r border-[#e4e6eb] px-3.5 py-4 hidden lg:flex lg:flex-col">
        <button type="button" onClick={() => router.push("/")} className="flex items-center gap-2 px-2 mb-5 text-left">
          <div className="h-7 w-7 rounded-md bg-[#157A4F] text-white text-[12px] font-bold flex items-center justify-center">G</div>
          <div>
            <p className="text-[14px] font-bold text-[#157A4F] leading-none">GOLO</p>
            <p className="text-[21px] font-semibold text-[#157A4F] leading-none mt-[2px]">Dashboard</p>
          </div>
        </button>

        <SideTitle text="GENERAL" />
        <SideItem icon={LayoutDashboard} label="Dashboard" onClick={() => router.push("/merchant/dashboard")} />

        <SideTitle text="MANAGEMENT" />
        <SideItem icon={UserCog} label="User Management" caret />
        <SideSub label="Customers" />
        <SideSub label="Merchants" />
        <SideSub label="Service Providers" />
        <SideItem icon={List} label="Listing Management" onClick={() => router.push("/merchant/listing-management")} />
        <SideItem icon={Layers} label="Categories" caret />
        <SideItem icon={Flag} label="Reports & Complaints" caret />

        <SideTitle text="MODERATION" />
        <SideItem icon={LifeBuoy} label="Support Center" />
        <SideSub label="Support Tickets" />
        <SideItem icon={ShieldAlert} label="Content Moderation" onClick={() => router.push("/merchant/content-moderation")} />
        <SideItem icon={Star} label="Reviews & Ratings" onClick={() => router.push("/merchant/reviews-ratings")} />
        <SideItem icon={Bell} label="Notifications" active onClick={() => router.push("/merchant/notifications")} />
        <SideItem icon={Megaphone} label="Banner / Advertisement" onClick={() => router.push("/merchant/banner-advertisement")} />

        <SideTitle text="ANALYTICS" />
        <SideItem icon={BarChart3} label="Analytics" />
        <SideItem icon={ShieldCheck} label="Security & Fraud" />

        <SideTitle text="SYSTEM" />
        <SideItem icon={Settings} label="Settings" caret />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-12 bg-white border-b border-[#e4e6eb] px-4 flex items-center justify-between">
          <div className="w-[470px] max-w-full relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full h-8 rounded-[4px] border border-[#e5e7eb] bg-[#fafafa] pl-8 pr-3 text-[12px] outline-none"
              placeholder="Search listings, users, or merchants..."
            />
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <Bell size={14} />
            <MessageSquare size={14} />
            <div className="text-[11px] flex items-center gap-1">EN <Globe size={12} /></div>
            <button className="h-8 px-3.5 rounded-[5px] bg-[#157A4F] text-white text-[12px] font-semibold inline-flex items-center gap-1.5">
              <Plus size={12} /> Create Listing
            </button>
            <UserCircle2 size={20} className="text-gray-400" />
          </div>
        </header>

        <main className="px-4 py-3 flex-1">
          <h1 className="text-[30px] font-bold leading-none">Notification Management</h1>

          <section className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
            {topCards.slice(0, 3).map((card) => (
              <div key={card.label} className="bg-white border border-[#e6e8ec] rounded-[10px] px-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="h-6 w-6 rounded-md bg-[#eaf5ef] text-[#157A4F] flex items-center justify-center"><card.icon size={12} /></div>
                  <span className={`text-[9px] font-semibold ${card.down ? "text-[#ef4444]" : "text-gray-500"}`}>{card.trend}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">{card.label}</p>
                <p className="text-[36px] font-extrabold leading-none mt-1">{card.value}</p>
                <svg viewBox="0 0 90 18" className="w-full h-5 mt-1">
                  <path d="M2 14 C15 10, 20 8, 30 11 C40 14, 50 3, 60 8 C68 12, 78 4, 88 6" stroke={card.down ? "#ef4444" : "#157A4F"} strokeWidth="1.6" fill="none" />
                </svg>
              </div>
            ))}

            <div className="bg-white border border-[#e6e8ec] rounded-[10px] px-4 py-3 lg:col-span-2">
              <div className="flex items-start justify-between">
                <div className="h-6 w-6 rounded-md bg-[#fff3e2] text-[#f59e0b] flex items-center justify-center"><BarChart3 size={12} /></div>
                <span className="text-[9px] font-semibold text-gray-500">+5.4%</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Avg. Open Rate</p>
              <p className="text-[36px] font-extrabold leading-none mt-1">24.8%</p>
              <svg viewBox="0 0 240 24" className="w-full h-6 mt-1">
                <path d="M2 20 C36 18, 50 17, 80 13 C120 8, 130 17, 160 12 C196 6, 208 13, 238 6" stroke="#157A4F" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <div className="bg-white border border-[#e6e8ec] rounded-[10px] px-4 py-3 lg:col-span-1">
              <div className="flex items-start justify-between">
                <div className="h-6 w-6 rounded-md bg-[#eaf5ef] text-[#157A4F] flex items-center justify-center"><CheckCircle2 size={12} /></div>
                <span className="text-[9px] font-semibold text-gray-500">+2.1%</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Active Alerts</p>
              <p className="text-[36px] font-extrabold leading-none mt-1">12</p>
              <svg viewBox="0 0 90 18" className="w-full h-5 mt-1">
                <path d="M2 15 C12 8, 20 9, 29 14 C40 19, 50 3, 61 9 C70 13, 80 2, 88 5" stroke="#157A4F" strokeWidth="1.6" fill="none" />
              </svg>
            </div>
          </section>

          <section className="mt-3 grid grid-cols-1 xl:grid-cols-[1fr_290px] gap-3">
            <div className="bg-white border border-[#e6e8ec] rounded-[10px] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#eceff2] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-[30px] font-bold leading-none">Live Activity</h2>
                  <span className="text-[9px] px-2 py-1 rounded-full bg-[#f3f4f6] text-gray-600">Syncing Live</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={markAllRead} className="h-8 px-3 rounded-[6px] border border-[#e5e7eb] text-[11px] inline-flex items-center gap-1"><Filter size={11} /> Mark All Read</button>
                  <button className="h-8 px-3 rounded-[6px] border border-[#e5e7eb] text-[11px] inline-flex items-center gap-1"><Download size={11} /> Export CSV</button>
                </div>
              </div>

              {error ? <p className="px-4 py-2 text-[12px] text-[#ef4444]">{error}</p> : null}

              <div className="px-4 py-3 border-b border-[#eceff2]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select className="h-8 rounded-[7px] border border-[#e5e7eb] bg-[#fafafa] px-3 text-[11px]"><option>All Types</option></select>
                  <select className="h-8 rounded-[7px] border border-[#e5e7eb] bg-[#fafafa] px-3 text-[11px]"><option>Any Status</option></select>
                  <select className="h-8 rounded-[7px] border border-[#e5e7eb] bg-[#fafafa] px-3 text-[11px]"><option>All Channels</option></select>
                </div>
                <input className="h-9 w-full mt-2 rounded-[8px] border border-[#e5e7eb] px-3 text-[11px]" placeholder="Search campaign..." />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead className="bg-[#fafbfc] text-gray-500">
                    <tr>
                      <th className="text-left px-4 py-2.5">ID</th>
                      <th className="text-left px-4 py-2.5">CAMPAIGN TITLE</th>
                      <th className="text-left px-4 py-2.5">AUDIENCE</th>
                      <th className="text-left px-4 py-2.5">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageLoading ? (
                      <tr><td className="px-4 py-4" colSpan={4}>Loading notifications...</td></tr>
                    ) : rows.map((row, index) => (
                      <tr key={`${row.id}-${index}`} className={`border-t border-[#eef1f3] ${index === 0 ? "bg-[#fffaf0] border-y border-dashed border-[#f0b74d]" : ""}`}>
                        <td className="px-4 py-2.5 text-gray-500">{row.id}</td>
                        <td className="px-4 py-2.5">
                          <p className="text-[12px] font-semibold text-[#1f2937]">{row.title}</p>
                          <div className="flex gap-1.5 mt-1">
                            {row.tags.map((tag) => (
                              <span key={tag} className="text-[8px] px-1.5 py-[2px] rounded-full bg-[#f3f4f6] text-gray-600">{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">{row.audience}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-[9px] px-2 py-[3px] rounded-full ${statusClass(row.status)}`}>{row.status}</span>
                          {row.status === "Unread" ? (
                            <button onClick={() => markOneRead(row.id)} className="ml-2 text-[10px] text-[#157A4F]">Mark read</button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 border-t border-[#eceff2] flex items-center justify-end gap-2 text-[11px]">
                <button className="h-8 px-3 rounded-[16px] border border-[#e5e7eb] inline-flex items-center gap-1"><ArrowLeft size={11} /> Previous</button>
                <button className="h-8 px-3 rounded-[16px] border border-[#e5e7eb] inline-flex items-center gap-1">Next <ArrowRight size={11} /></button>
              </div>
            </div>

            <aside className="bg-white border border-[#e6e8ec] rounded-[10px] overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-[#eceff2]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] px-2 py-1 rounded-full bg-[#e7f5ec] text-[#157A4F] font-semibold">Campaign Details</span>
                  <AlertCircle size={12} className="text-[#ef4444]" />
                </div>
                <h3 className="text-[27px] font-bold leading-none mt-2">System Maintenance: Cluster A</h3>
                <p className="text-[11px] text-gray-500 mt-2">Created by Ram Patil • 2023-11-24 09:15 AM</p>
              </div>

              <div className="px-4 py-3 border-b border-[#eceff2]">
                <p className="text-[10px] tracking-wide font-semibold text-gray-500">MOBILE PREVIEW (IN-APP)</p>
                <div className="mt-2 mx-auto w-[150px] rounded-[14px] border-4 border-[#1f2937] bg-white p-2.5">
                  <div className="space-y-2">
                    <div className="rounded-[8px] bg-[#f6f8fa] p-2 text-[8px]">
                      <p className="font-semibold">System Update</p>
                      <p className="text-gray-500">New security patch available.</p>
                      <button className="mt-1 h-4 px-2 rounded-full bg-[#157A4F] text-white">Update</button>
                    </div>
                    <div className="rounded-[8px] bg-[#f6f8fa] p-2 text-[8px]">
                      <p className="font-semibold">Flash Sale!</p>
                      <button className="mt-1 h-4 px-2 rounded-full bg-[#157A4F] text-white">Shop</button>
                    </div>
                    <div className="rounded-[8px] bg-[#f6f8fa] p-2 text-[8px]">
                      <p className="font-semibold">Payment Sent</p>
                      <div className="mt-1 flex gap-1">
                        <button className="h-4 px-2 rounded-full bg-[#157A4F] text-white">Receipt</button>
                        <button className="h-4 px-2 rounded-full bg-[#e5e7eb]">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-b border-[#eceff2]">
                <p className="text-[10px] tracking-wide font-semibold text-gray-500">PERFORMANCE METRICS</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-[#f8fafb] border border-[#eef1f3] rounded-[8px] p-2.5">
                    <p className="text-[8px] text-gray-500">DELIVERY RATE</p>
                    <p className="text-[26px] font-extrabold text-[#157A4F] leading-none mt-1">99.2%</p>
                  </div>
                  <div className="bg-[#f8fafb] border border-[#eef1f3] rounded-[8px] p-2.5">
                    <p className="text-[8px] text-gray-500">OPEN RATE</p>
                    <p className="text-[26px] font-extrabold text-[#f59e0b] leading-none mt-1">42.1%</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 mt-2">Reach Progress <span className="font-semibold">8,240 / 10,000</span></p>
                <div className="h-1.5 rounded-full bg-[#eef1f3] mt-1 overflow-hidden"><div className="h-full w-[82%] bg-[#157A4F]" /></div>
              </div>

              <div className="px-4 py-3 border-b border-[#eceff2]">
                <p className="text-[10px] tracking-wide font-semibold text-gray-500">ACTIVITY LOG</p>
                <div className="space-y-2 mt-2 text-[10px]">
                  <div className="flex items-start gap-2"><CheckCircle2 size={11} className="text-[#157A4F] mt-[2px]" /><div><p className="font-semibold">Campaign Finished</p><p className="text-gray-500">Today, 09:45 AM</p></div></div>
                  <div className="flex items-start gap-2"><Clock3 size={11} className="text-[#f59e0b] mt-[2px]" /><div><p className="font-semibold">Broadcasting via SMTP</p><p className="text-gray-500">Today, 09:15 AM</p></div></div>
                  <div className="flex items-start gap-2"><Smartphone size={11} className="text-gray-500 mt-[2px]" /><div><p className="font-semibold">Campaign Created</p><p className="text-gray-500">Yesterday, 11:20 PM</p></div></div>
                </div>
              </div>

              <div className="px-4 py-3 grid grid-cols-2 gap-2 mt-auto">
                <button className="h-9 rounded-[8px] bg-[#157A4F] text-white text-[12px] font-semibold">Resend</button>
                <button className="h-9 rounded-[8px] border border-[#f4d1d1] text-[#ef4444] text-[12px] font-semibold inline-flex items-center justify-center gap-1"><Trash2 size={11} /> Delete</button>
              </div>
            </aside>
          </section>
        </main>

        <footer className="h-14 bg-[#edb841] border-t border-[#daa22f] px-4 flex items-center justify-between text-[10px] text-[#5c4513]">
          <div className="flex items-center gap-2 font-semibold">
            <div className="h-5 w-5 rounded-sm bg-white/70 text-[#157A4F] flex items-center justify-center">G</div>
            Golo
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span>About Us</span><span>Contact Us</span><span>Support Center</span><span>Privacy Policy</span><span>Terms of Service</span><span>Cookie Policy</span>
          </div>
          <div className="flex items-center gap-2">
            <span>© 2026 Golo. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function statusClass(status) {
  if (status === "Read") return "bg-[#f3f4f6] text-gray-700";
  if (status === "Unread") return "bg-[#fff3dd] text-[#d18a0f]";
  return "bg-[#fee2e2] text-[#ef4444]";
}

function SideTitle({ text }) {
  return <p className="text-[9px] tracking-wide font-semibold text-[#9ca3af] px-2 mt-3 mb-1">{text}</p>;
}

function SideItem({ icon: Icon, label, active = false, onClick, caret = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-9 px-2.5 rounded-[7px] flex items-center justify-between text-left text-[12px] mb-1 ${
        active ? "bg-[#157A4F] text-white" : "text-[#4b5563] hover:bg-[#f0f3f5]"
      }`}
    >
      <span className="inline-flex items-center gap-2.5">
        <Icon size={13} />
        <span>{label}</span>
      </span>
      {caret && <ChevronDown size={12} className={active ? "text-white" : "text-[#9ca3af]"} />}
    </button>
  );
}

function SideSub({ label }) {
  return <p className="text-[11px] text-[#8b93a1] pl-9 mb-1">{label}</p>;
}
