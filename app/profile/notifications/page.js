"use client";

import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GolocalProfileSidebar from "../../components/GolocalProfileSidebar";
import { Bell, ChevronDown, Gift, Clock3, Star, CheckCircle2, Circle, MoreVertical, SquareCheckBig } from "lucide-react";
import { useState } from "react";

const tabs = ["All", "Unread", "Deals", "Rewards", "Coupons"];

const notifications = [
  {
    title: "New Deal: 50% Off Signature Thali",
    description: "Enjoy a feast at Rajdhani Thali. Valid for the next 24 hours only!",
    time: "2 hours ago",
    action: "View Deal",
    accent: "#157a4f",
    icon: Bell,
    dot: true,
  },
  {
    title: "Points Milestone Reached!",
    description: "You just earned 500 GOLO points. Check your rewards balance.",
    time: "5 hours ago",
    action: "View Rewards",
    accent: "#f4a632",
    icon: Star,
    dot: true,
  },
  {
    title: "Claim Your Weekend Coupon",
    description: "Get extra Rs. 200 off on any wellness service above Rs. 1000.",
    time: "2 days ago",
    action: "Claim Coupon",
    secondaryAction: "Dismiss",
    accent: "#157a4f",
    icon: Gift,
    dot: false,
  },
  {
    title: "Appointment Reminder",
    description: "Your spa session at Azure Wellness is scheduled for tomorrow at 10 AM.",
    time: "3 days ago",
    action: "View Details",
    accent: "#157a4f",
    icon: Clock3,
    dot: false,
  },
];

const summaryItems = [
  { label: "Unread Notifications", value: "2 New", highlight: true },
  { label: "Active Coupons", value: "5" },
  { label: "Available Points", value: "2,450 pts", strong: true },
];

const milestones = [
  { title: "Gold Member Status", subtitle: "Unlocked on Oct 10", icon: CheckCircle2 },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f4f4f4]">
        <div className="w-full px-0 py-0">
          <div className="grid lg:grid-cols-[250px_1fr] min-h-[760px]">
            <GolocalProfileSidebar active="notifications" />

            <main className="bg-white px-5 md:px-8 lg:px-10 py-6 md:py-8">
              <div className="grid xl:grid-cols-[minmax(0,1fr)_280px] gap-6 xl:gap-8 items-start">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-[32px] md:text-[34px] leading-none font-semibold text-[#1f1f1f]">Notifications</h1>
                    </div>
                    <button className="text-[#157a4f] text-[12px] md:text-[13px] font-semibold mt-2 whitespace-nowrap">Mark all as read</button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {tabs.map((tab) => {
                      const active = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`h-8 px-4 rounded-full border text-[12px] font-medium transition ${active ? "bg-[#157a4f] border-[#157a4f] text-white" : "bg-white border-[#e5e5e5] text-[#7a7a7a] hover:border-[#cfd8d3] hover:text-[#4c4c4c]"}`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-semibold">Today</p>
                      <div className="mt-3 space-y-3">
                        {notifications.slice(0, 2).map((notification) => {
                          const Icon = notification.icon;
                          return (
                            <div key={notification.title} className="border border-[#d7e7df] rounded-[14px] bg-[#fbfcfd] px-3 md:px-4 py-3 md:py-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                              <div className="flex items-start gap-3">
                                <button type="button" className="mt-0.5 text-[#c4c4c4] shrink-0" aria-label="Select notification">
                                  <SquareCheckBig size={16} />
                                </button>

                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#efefef] shadow-sm shrink-0">
                                  <Icon size={15} className="text-[#f4a632]" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-[15px] md:text-[16px] font-semibold text-[#222222] leading-tight inline-flex items-center gap-1">
                                        {notification.title}
                                        {notification.dot && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f4a632] mt-1" />}
                                      </p>
                                      <p className="mt-1 text-[12px] md:text-[13px] text-[#6f6f6f]">{notification.description}</p>
                                      <p className="mt-2 text-[11px] text-[#a1a1a1]">{notification.time}</p>
                                    </div>

                                    <button type="button" className="text-[#9aa0a6] hover:text-[#4b5563]">
                                      <MoreVertical size={16} />
                                    </button>
                                  </div>

                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <button className="h-8 px-4 rounded-md bg-[#157a4f] text-white text-[12px] font-semibold hover:opacity-95 transition">{notification.action}</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-semibold">This Week</p>
                      <div className="mt-3 space-y-3">
                        {notifications.slice(2).map((notification) => {
                          const Icon = notification.icon;
                          return (
                            <div key={notification.title} className="border border-[#d7e7df] rounded-[14px] bg-[#fbfcfd] px-3 md:px-4 py-3 md:py-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                              <div className="flex items-start gap-3">
                                <button type="button" className="mt-0.5 text-[#c4c4c4] shrink-0" aria-label="Select notification">
                                  <Circle size={16} />
                                </button>

                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#efefef] shadow-sm shrink-0">
                                  <Icon size={15} className="text-[#f4a632]" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="text-[15px] md:text-[16px] font-semibold text-[#222222] leading-tight">{notification.title}</p>
                                      <p className="mt-1 text-[12px] md:text-[13px] text-[#6f6f6f]">{notification.description}</p>
                                      <p className="mt-2 text-[11px] text-[#a1a1a1]">{notification.time}</p>
                                    </div>

                                    <button type="button" className="text-[#9aa0a6] hover:text-[#4b5563]">
                                      <MoreVertical size={16} />
                                    </button>
                                  </div>

                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <button className="h-8 px-4 rounded-md bg-[#157a4f] text-white text-[12px] font-semibold hover:opacity-95 transition">{notification.action}</button>
                                    {notification.secondaryAction && (
                                      <button className="h-8 px-4 rounded-md border border-[#d5d5d5] bg-white text-[#4b4b4b] text-[12px] font-semibold">{notification.secondaryAction}</button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="space-y-4 xl:sticky xl:top-6">
                  <div className="rounded-[16px] border border-[#ececec] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)] px-4 py-4">
                    <h2 className="text-[15px] font-semibold text-[#1e1e1e]">Notification Summary</h2>
                    <div className="mt-4 space-y-3">
                      {summaryItems.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3 text-[12px]">
                          <span className="text-[#7d7d7d]">{item.label}</span>
                          <span className={item.highlight ? "inline-flex items-center rounded-full bg-[#f4a632] px-2 py-0.5 text-[10px] font-semibold text-white" : item.strong ? "font-semibold text-[#157a4f]" : "font-semibold text-[#222222]"}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 border-t border-[#ececec] pt-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#9ca3af] font-semibold">Recent Milestone</p>
                      {milestones.map((milestone) => {
                        const Icon = milestone.icon;
                        return (
                          <div key={milestone.title} className="mt-3 flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf8f2] border border-[#d4eadf] text-[#157a4f] shrink-0">
                              <Icon size={15} />
                            </div>
                            <div>
                              <p className="text-[12px] font-semibold text-[#1d1d1d] leading-tight">{milestone.title}</p>
                              <p className="text-[11px] text-[#8a8a8a] mt-0.5">{milestone.subtitle}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[18px] border border-[#ececec] bg-[#1f170f] shadow-[0_16px_32px_rgba(15,23,42,0.16)] min-h-[250px]">
                    <div className="absolute inset-0">
                      <Image src="/images/place2.avif" alt="Featured wellness offer" fill className="object-cover opacity-95" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0b08]/95 via-[#2a1b12]/40 to-transparent" />
                    </div>
                    <div className="relative z-10 flex h-full min-h-[250px] flex-col justify-end p-4 text-white">
                      <span className="inline-flex w-fit items-center rounded-full bg-[#f4a632] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        Featured
                      </span>
                      <h3 className="mt-2 text-[22px] leading-[1.05] font-semibold">Signature Wellness Day</h3>
                      <p className="mt-1 text-[12px] text-white/82">Special price Rs. 1,200</p>
                      <button className="mt-4 h-10 rounded-[8px] bg-[#f4b232] text-[#fff] text-[13px] font-semibold shadow-sm">Claim Now</button>
                    </div>
                  </div>
                </aside>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
