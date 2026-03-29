"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  MessageSquare,
  Globe,
  Plus,
  LayoutDashboard,
  Users,
  Store,
  Briefcase,
  List,
  Layers,
  Flag,
  LifeBuoy,
  ShieldCheck,
  Star,
  Megaphone,
  BarChart3,
  Settings,
  UserCircle2,
  UserCog,
  Download,
  MoreVertical,
  AlertTriangle,
  ShieldAlert,
  Activity,
  UserRound,
  CheckCircle2,
  Clock3,
  Shield,
  ListChecks,
  CircleDollarSign,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const metricCards = [
  { label: "Total Users", value: "842.1k", change: "↗ 12.5%", icon: Users, down: false },
  { label: "Active Merchants", value: "42,850", change: "↗ 8.2%", icon: Store, down: false },
  { label: "Total Listings", value: "1.2M", change: "↗ 4.1%", icon: ListChecks, down: false },
  { label: "Pending Approvals", value: "1,204", change: "↘ 15.8%", icon: Clock3, down: true },
  { label: "Overall Reports", value: "84", change: "↘ 2.4%", icon: AlertTriangle, down: true },
  { label: "Platform Revenue", value: "₹4.8Cr", change: "↗ 18.9%", icon: CircleDollarSign, down: false },
];

const regions = [
  { city: "Mumbai", value: "12.4k", growth: "+12%", width: "100%" },
  { city: "Delhi", value: "10.8k", growth: "+8%", width: "87%" },
  { city: "Bangalore", value: "9.2k", growth: "+15%", width: "74%" },
  { city: "Hyderabad", value: "7.5k", growth: "-2%", width: "60%" },
  { city: "Chennai", value: "6.1k", growth: "+5%", width: "49%" },
];

const categories = [
  { name: "Used Cars", growth: "+24% Growth", color: "bg-[#eef6fb]" },
  { name: "Rentals", growth: "+18% Growth", color: "bg-[#edf8f2]" },
  { name: "Smartphones", growth: "+15% Growth", color: "bg-[#f2f1fa]" },
  { name: "Furniture", growth: "+12% Growth", color: "bg-[#f7f2e7]" },
  { name: "Fitness Gear", growth: "+9% Growth", color: "bg-[#f8f0f1]" },
  { name: "Home Svcs", growth: "+5% Growth", color: "bg-[#f3f4f6]" },
];

const merchants = [
  { name: "AutoHub India", vol: "₹12.5L", rating: "4.9 ★" },
  { name: "Modern Living", vol: "₹8.1L", rating: "4.7 ★" },
  { name: "TechWhiz", vol: "₹6.9L", rating: "4.8 ★" },
];

export default function MerchantDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/merchant/dashboard");
      return;
    }
    if (!loading && user && user.accountType !== "merchant") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-[#f3f4f6]" />;
  }

  if (user.accountType !== "merchant") return null;

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-[#111827] flex" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <aside className="w-[250px] bg-[#f8f9fb] border-r border-[#e4e6eb] px-3.5 py-4 hidden lg:flex lg:flex-col">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-2 mb-5 text-left"
        >
          <div className="h-7 w-7 rounded-md bg-[#157A4F] text-white text-[12px] font-bold flex items-center justify-center">G</div>
          <div>
            <p className="text-[14px] font-bold text-[#157A4F] leading-none">GOLO</p>
            <p className="text-[21px] font-semibold text-[#157A4F] leading-none mt-[2px]">Dashboard</p>
          </div>
        </button>

        <SideTitle text="GENERAL" />
        <SideItem icon={LayoutDashboard} label="Dashboard" active onClick={() => router.push("/merchant/dashboard")} />

        <SideTitle text="MANAGEMENT" />
        <SideItem icon={UserCog} label="User Management" />
        <SideSub label="Customers" />
        <SideSub label="Merchants" />
        <SideSub label="Service Providers" />
        <SideItem icon={List} label="Listing Management" />
        <SideItem icon={Layers} label="Categories" />
        <SideItem icon={Flag} label="Reports & Complaints" />

        <SideTitle text="MODERATION" />
        <SideItem icon={LifeBuoy} label="Support Center" />
        <SideSub label="Support Tickets" />
        <SideItem icon={ShieldAlert} label="Content Moderation" onClick={() => router.push("/merchant/content-moderation")} />
        <SideItem icon={Star} label="Reviews & Ratings" onClick={() => router.push("/merchant/reviews-ratings")} />
        <SideItem icon={Bell} label="Notifications" onClick={() => router.push("/merchant/notifications")} />
        <SideItem icon={Megaphone} label="Banner / Advertisement" onClick={() => router.push("/merchant/banner-advertisement")} />

        <SideTitle text="ANALYTICS" />
        <SideItem icon={BarChart3} label="Analytics" />
        <SideItem icon={ShieldCheck} label="Security & Fraud" />

        <SideTitle text="SYSTEM" />
        <SideItem icon={Settings} label="Settings" />

        <div className="mt-auto rounded-lg bg-[#ecf6ef] border border-[#d7eadf] p-2.5">
          <p className="text-[9px] tracking-wide font-semibold text-[#157A4F]">PLATFORM STATUS</p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-gray-600">
            <span>Server Load</span>
            <span className="font-bold">24%</span>
          </div>
          <div className="mt-1.5 h-1 rounded-full bg-white overflow-hidden">
            <div className="h-full w-1/4 bg-[#157A4F]" />
          </div>
        </div>
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

        <main className="px-4 py-3">
          <h1 className="text-[27px] font-bold leading-[1.15]">GOLO Platform Overview</h1>
          <p className="text-[11px] text-gray-500 mt-1">Real-time data synchronization active • Last updated 2 mins ago</p>

          <section className="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
            {metricCards.map(({ label, value, change, icon: Icon, down }) => (
              <div key={label} className="bg-white border border-[#e6e8ec] rounded-[9px] p-2.5">
                <div className="flex items-start justify-between">
                  <div className="h-6 w-6 rounded-md bg-[#fcecc8] text-[#a9710f] flex items-center justify-center"><Icon size={12} /></div>
                  <span className={`text-[9px] font-semibold ${down ? "text-[#ef4444]" : "text-gray-500"}`}>{change}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1.5">{label}</p>
                <p className="text-[35px] font-extrabold leading-none mt-1">{value}</p>
                <svg viewBox="0 0 80 16" className="w-full h-4 mt-1">
                  <path d="M2 12 C16 9, 22 14, 32 10 C42 7, 52 11, 63 7 C70 5, 76 3, 78 4" stroke={down ? "#ef4444" : "#059669"} strokeWidth="1.6" fill="none" />
                </svg>
              </div>
            ))}
          </section>

          <section className="mt-3 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-3">
            <div className="bg-white border border-[#e6e8ec] rounded-[10px] p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[24px] font-bold leading-none">India Regional Analytics</h2>
                  <p className="text-[10px] text-gray-500 mt-1">Listing density by major metropolitan areas</p>
                </div>
                <button className="h-7 px-3 rounded-[5px] bg-[#f0b534] text-[#6a4b07] text-[10px] font-semibold inline-flex items-center gap-1.5">
                  <Download size={11} /> Download CSV
                </button>
              </div>

              <div className="mt-2 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-3">
                <div className="h-[190px] rounded-[6px] bg-[#1e1f23] border border-[#2f3238] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(245,184,73,0.46),transparent_38%),radial-gradient(circle_at_36%_70%,rgba(16,185,129,0.34),transparent_35%)]" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#f0d57a] text-[11px] font-semibold tracking-wider">INDIA MAP</div>
                </div>

                <div className="space-y-2.5">
                  {regions.map((r) => (
                    <div key={r.city}>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-semibold">{r.city}</span>
                        <span className="text-gray-500">{r.value}</span>
                        <span className={r.growth.startsWith("-") ? "text-[#ef4444]" : "text-gray-500"}>{r.growth}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#eef1f3] overflow-hidden">
                        <div className="h-full bg-[#1f925f]" style={{ width: r.width }} />
                      </div>
                    </div>
                  ))}
                  <button className="text-[9px] font-semibold text-[#157A4F] mt-1">VIEW ALL REGIONS</button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#fff5f5] border border-[#f8dbdb] rounded-[10px] p-3">
                <h3 className="text-[24px] font-bold text-[#ef4444] leading-none">Security Monitoring</h3>
                <p className="text-[10px] text-[#ef4444] mt-1">3 critical alerts require attention</p>

                <div className="mt-2.5 space-y-2">
                  <AlertRow icon={AlertTriangle} text="Suspicious IP Activity" time="12 mins ago" />
                  <AlertRow icon={ShieldAlert} text="Bulk Listing Attempt" time="45 mins ago" />
                  <AlertRow icon={Activity} text="Reported Merchant: COLO-42" time="2 hours ago" />
                </div>

                <button className="w-full h-8 rounded-[5px] bg-[#e24d4d] text-white text-[10px] font-semibold mt-2.5">LAUNCH SECURITY PANEL</button>
              </div>
            </div>
          </section>

          <section className="mt-0 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-3">
            <div className="bg-white border border-[#e6e8ec] rounded-[10px] p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[26px] font-bold leading-none">Listings Performance</h2>
                  <p className="text-[10px] text-gray-500 mt-1">Analytical breakdown of platform listing health</p>
                </div>
                <div className="inline-flex rounded-[5px] border border-[#e5e7eb] overflow-hidden text-[9px] font-semibold">
                  <button className="h-6 px-2.5 bg-[#157A4F] text-white">Growth</button>
                  <button className="h-6 px-2.5 bg-white text-gray-500">Daily Ads</button>
                  <button className="h-6 px-2.5 bg-white text-gray-500">Approvals</button>
                </div>
              </div>

              <div className="h-[172px] mt-2 rounded-[6px] bg-gradient-to-b from-[#e7f4ec] to-[#fdfefe] border border-[#d9ebdf] relative overflow-hidden">
                <svg viewBox="0 0 720 180" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0.03" />
                    </linearGradient>
                  </defs>
                  <path d="M0,145 C85,110 130,95 180,104 C240,114 290,128 345,90 C405,58 465,66 530,52 C595,40 662,28 720,14 L720,180 L0,180 Z" fill="url(#greenFill)" />
                  <path d="M0,145 C85,110 130,95 180,104 C240,114 290,128 345,90 C405,58 465,66 530,52 C595,40 662,28 720,14" stroke="#12a150" strokeWidth="3" fill="none" />
                </svg>
                <div className="absolute bottom-1.5 left-2 right-2 flex justify-between text-[9px] text-gray-400">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-[#e6e8ec] rounded-[10px] p-3">
                <h3 className="text-[22px] font-bold leading-none">Quick Admin Forms</h3>
                <p className="text-[9px] text-gray-500 mt-2">CREATE NEW CATEGORY</p>
                <div className="mt-1.5 flex gap-1.5">
                  <input className="h-7 flex-1 rounded-[4px] border border-[#e5e7eb] px-2 text-[10px]" placeholder="Category Name" />
                  <button className="h-7 w-7 rounded-[4px] bg-[#157A4F] text-white flex items-center justify-center"><Plus size={12} /></button>
                </div>

                <p className="text-[9px] text-gray-500 mt-2">BROADCAST MESSAGE</p>
                <div className="mt-1.5 flex gap-1.5">
                  <input className="h-7 flex-1 rounded-[4px] border border-[#e5e7eb] px-2 text-[10px]" placeholder="Message content..." />
                  <button className="h-7 w-7 rounded-[4px] bg-[#f4bf45] text-[#6a4b07] flex items-center justify-center"><MessageSquare size={12} /></button>
                </div>

                <button className="w-full h-7 mt-2 rounded-[4px] border border-[#cae6d8] text-[#157A4F] text-[9px] font-semibold inline-flex items-center justify-center gap-1">
                  <Megaphone size={10} /> CREATE MARKETING BANNER
                </button>
              </div>

              <div className="bg-[#d7f0df] border border-[#c3e4ce] rounded-[10px] p-3">
                <h3 className="text-[21px] font-bold text-[#157A4F] leading-none">Support Summary</h3>
                <p className="text-[9px] text-[#2f6d4f] mt-1">Last 24 hours ticket status</p>
                <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                  <div className="bg-white/70 rounded-[4px] p-2">
                    <p className="text-[24px] font-extrabold text-[#157A4F] leading-none">12</p>
                    <p className="text-[9px] text-[#2f6d4f] mt-1">OPEN TICKETS</p>
                  </div>
                  <div className="bg-white/70 rounded-[4px] p-2">
                    <p className="text-[24px] font-extrabold text-[#157A4F] leading-none">48</p>
                    <p className="text-[9px] text-[#2f6d4f] mt-1">RESOLVED</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-2 grid grid-cols-1 xl:grid-cols-[1.05fr_1fr_1fr] gap-3">
            <div className="bg-white border border-[#e6e8ec] rounded-[10px] p-3">
              <h3 className="text-[22px] font-bold leading-none">Trending Categories</h3>
              <p className="text-[10px] text-gray-500 mt-1">Top demand by user search volume</p>
              <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                {categories.map((c) => (
                  <div key={c.name} className={`rounded-[6px] p-2 ${c.color}`}>
                    <p className="text-[10px] font-semibold">{c.name}</p>
                    <p className="text-[9px] text-gray-500 mt-1">{c.growth}</p>
                  </div>
                ))}
              </div>
              <button className="text-[9px] font-semibold text-gray-500 mt-3">EXPLORE CATEGORY TRENDS</button>
            </div>

            <div className="bg-white border border-[#e6e8ec] rounded-[10px] p-3">
              <h3 className="text-[22px] font-bold leading-none">Recent Activity</h3>
              <div className="space-y-2 mt-2.5">
                <ActivityItem name="Rahul Sharma" text="approved listing #GL-902" tag="System" />
                <ActivityItem name="Priya Patel" text="flagged merchant ‘BestDeals’" tag="Manual" />
                <ActivityItem name="Amit Kumar" text="updated platform fees" tag="Admin" />
                <ActivityItem name="Sonia Gill" text="resolved ticket #SUP-441" tag="Support" />
              </div>
              <button className="text-[9px] font-semibold text-gray-500 mt-3">VIEW FULL AUDIT LOG</button>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-[#e6e8ec] rounded-[10px] p-3">
                <h3 className="text-[22px] font-bold leading-none">Top Merchants</h3>
                <div className="space-y-2 mt-2">
                  {merchants.map((m) => (
                    <div key={m.name} className="flex items-center justify-between rounded-[6px] bg-[#f7faf8] border border-[#ecf2ee] px-2.5 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-[#e2f2e8] text-[#157A4F] flex items-center justify-center"><UserRound size={11} /></div>
                        <div>
                          <p className="text-[10px] font-semibold">{m.name}</p>
                          <p className="text-[9px] text-gray-500">Vol: {m.vol}</p>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#e6f6ee] text-[#157A4F] font-semibold">{m.rating}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#e6e8ec] rounded-[10px] p-3">
                <h3 className="text-[22px] font-bold leading-none">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                  <ActionBtn icon={Users} label="BULK USER IMPORT" />
                  <ActionBtn icon={Shield} label="GLOBAL AUDIT" />
                  <ActionBtn icon={Globe} label="GEO SETTINGS" />
                  <ActionBtn icon={CheckCircle2} label="IP WHITELIST" />
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="h-10 bg-[#edb841] border-t border-[#daa22f] px-4 flex items-center justify-between text-[9px] text-[#5c4513]">
          <div className="flex items-center gap-1.5 font-semibold">
            <div className="h-4 w-4 rounded-sm bg-white/70 text-[#157A4F] flex items-center justify-center">G</div>
            Golo
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span>About Us</span><span>Contact Us</span><span>Support Center</span><span>Privacy Policy</span><span>Terms of Service</span><span>Cookie Policy</span>
          </div>
          <div>© 2026 Golo.</div>
        </footer>
      </div>
    </div>
  );
}

function SideTitle({ text }) {
  return <p className="text-[9px] tracking-wide font-semibold text-[#9ca3af] px-2 mt-3 mb-1">{text}</p>;
}

function SideItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-9 px-2.5 rounded-[7px] flex items-center gap-2.5 text-left text-[12px] mb-1 ${
        active ? "bg-[#157A4F] text-white" : "text-[#4b5563] hover:bg-[#f0f3f5]"
      }`}
    >
      <Icon size={13} />
      <span>{label}</span>
    </button>
  );
}

function SideSub({ label }) {
  return <p className="text-[11px] text-[#8b93a1] pl-9 mb-1">{label}</p>;
}

function AlertRow({ icon: Icon, text, time }) {
  return (
    <div className="flex items-center justify-between bg-white border border-[#f2dddd] rounded-[6px] px-2.5 py-2">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-[5px] bg-[#fff2f2] text-[#ef4444] flex items-center justify-center"><Icon size={10} /></div>
        <div>
          <p className="text-[10px] font-semibold text-[#374151]">{text}</p>
          <p className="text-[9px] text-[#9ca3af]">{time}</p>
        </div>
      </div>
      <MoreVertical size={10} className="text-[#9ca3af]" />
    </div>
  );
}

function ActivityItem({ name, text, tag }) {
  return (
    <div className="flex items-start gap-2 border-b border-[#f0f2f4] pb-2 last:border-b-0">
      <div className="h-6 w-6 rounded-full bg-[#f3f4f6] text-[#6b7280] flex items-center justify-center"><UserRound size={10} /></div>
      <div>
        <p className="text-[10px]"><span className="font-semibold">{name}</span> <span className="text-gray-500">{text}</span></p>
        <p className="text-[9px] text-gray-400">3 hours ago <span className="ml-1 px-1.5 py-[1px] rounded-full bg-[#e9f6ef] text-[#157A4F]">{tag}</span></p>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label }) {
  return (
    <button className="h-10 rounded-[6px] border border-[#d9ecdf] bg-[#f6fcf8] text-[#4b5563] text-[9px] font-semibold inline-flex flex-col items-center justify-center gap-0.5">
      <Icon size={10} className="text-[#157A4F]" />
      <span>{label}</span>
    </button>
  );
}
