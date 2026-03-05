"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  getConversationMessages,
  getMyConversations,
  sendConversationMessage,
  startConversation,
} from "../lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export default function ChatsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-600">
          Loading chats...
        </div>
      }
    >
      <ChatsPageContent />
    </Suspense>
  );
}

function ChatsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [pageError, setPageError] = useState("");

  const socketRef = useRef(null);
  const selectedConversationIdRef = useRef(null);

  const adId = searchParams.get("adId");
  const sellerId = searchParams.get("sellerId");

  const selectedConversationId = useMemo(
    () => selectedConversation?.id || null,
    [selectedConversation]
  );

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/chats");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadConversations = async () => {
      setLoadingConversations(true);
      setPageError("");
      try {
        const response = await getMyConversations();
        const items = response?.data || [];
        setConversations(items);

        if (adId) {
          const started = await startConversation({ adId, sellerId: sellerId || undefined });
          const conversation = started?.data;

          if (conversation) {
            setConversations((prev) => {
              const exists = prev.find((item) => item.id === conversation.id);
              if (exists) {
                return prev.map((item) => (item.id === conversation.id ? conversation : item));
              }
              return [conversation, ...prev];
            });
            setSelectedConversation(conversation);
            router.replace("/chats");
            return;
          }
        }

        if (items.length > 0) {
          setSelectedConversation(items[0]);
        }
      } catch (error) {
        setPageError(error?.data?.message || error.message || "Failed to load chats.");
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
  }, [isAuthenticated, adId, sellerId, router]);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);
      setPageError("");
      try {
        const response = await getConversationMessages(selectedConversationId, { page: 1, limit: 100 });
        setMessages(response?.data?.items || []);
      } catch (error) {
        setPageError(error?.data?.message || error.message || "Failed to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedConversationId]);

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    let mounted = true;

    const setupSocket = async () => {
      const { io } = await import("socket.io-client");
      if (!mounted) return;

      const socket = io(`${API_BASE}/chat`, {
        transports: ["websocket"],
        auth: {
          token,
        },
      });

      socket.on("connect_error", () => {
        setPageError("Realtime connection failed. Messages still work via API.");
      });

      socket.on("new_message", (incoming) => {
        if (incoming.conversationId === selectedConversationIdRef.current) {
          setMessages((prev) => {
            const exists = prev.some((item) => item.id === incoming.id);
            if (exists) return prev;
            return [...prev, incoming];
          });
        }

        setConversations((prev) =>
          prev
            .map((conversation) =>
              conversation.id === incoming.conversationId
                ? {
                    ...conversation,
                    lastMessageText: incoming.text,
                    lastMessageAt: incoming.createdAt,
                    lastMessageAdId: incoming.adId || conversation.lastMessageAdId,
                    lastMessageAdTitle: incoming.adTitle || conversation.lastMessageAdTitle,
                    ad: conversation.ad
                      ? {
                          ...conversation.ad,
                          id: incoming.adId || conversation.ad.id,
                          title: incoming.adTitle || conversation.ad.title,
                        }
                      : conversation.ad,
                  }
                : conversation
            )
            .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
        );
      });

      socket.on("conversation_updated", (event) => {
        setConversations((prev) =>
          prev
            .map((conversation) =>
              conversation.id === event.conversationId
                ? {
                    ...conversation,
                    lastMessageText: event.lastMessageText,
                    lastMessageAt: event.lastMessageAt,
                    lastMessageAdId: event.lastMessageAdId || conversation.lastMessageAdId,
                    lastMessageAdTitle: event.lastMessageAdTitle || conversation.lastMessageAdTitle,
                    ad: conversation.ad
                      ? {
                          ...conversation.ad,
                          id: event.lastMessageAdId || conversation.ad.id,
                          title: event.lastMessageAdTitle || conversation.ad.title,
                        }
                      : conversation.ad,
                  }
                : conversation
            )
            .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
        );

        if (event.conversationId === selectedConversationIdRef.current && event.message) {
          setMessages((prev) => {
            const exists = prev.some((item) => item.id === event.message.id);
            if (exists) return prev;
            return [...prev, event.message];
          });
        }
      });

      socketRef.current = socket;
    };

    setupSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socketRef.current || !selectedConversationId) return;
    socketRef.current.emit("join_conversation", { conversationId: selectedConversationId });
    return () => {
      socketRef.current?.emit("leave_conversation", { conversationId: selectedConversationId });
    };
  }, [selectedConversationId]);

  const handleSendMessage = async (text) => {
    if (!selectedConversationId || !text?.trim()) return;

    setSending(true);
    setPageError("");
    try {
      const adContextId =
        selectedConversation?.ad?.id || selectedConversation?.lastMessageAdId || selectedConversation?.adId;

      let message;

      if (socketRef.current?.connected) {
        message = await new Promise((resolve, reject) => {
          socketRef.current.emit(
            "send_message",
            {
              conversationId: selectedConversationId,
              text,
              adId: adContextId,
            },
            (ack) => {
              if (!ack || ack.success === false) {
                reject(new Error(ack?.message || "Failed to send message."));
                return;
              }
              resolve(ack.data);
            }
          );
        });
      } else {
        const response = await sendConversationMessage(selectedConversationId, text, adContextId);
        message = response?.data;
      }

      setMessages((prev) => {
        const exists = prev.some((item) => item.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });

      setConversations((prev) =>
        prev
          .map((conversation) =>
            conversation.id === selectedConversationId
              ? {
                  ...conversation,
                  lastMessageText: message.text,
                  lastMessageAt: message.createdAt,
                  lastMessageAdId: message.adId || conversation.lastMessageAdId,
                  lastMessageAdTitle: message.adTitle || conversation.lastMessageAdTitle,
                  ad: conversation.ad
                    ? {
                        ...conversation.ad,
                        id: message.adId || conversation.ad.id,
                        title: message.adTitle || conversation.ad.title,
                      }
                    : conversation.ad,
                }
              : conversation
          )
          .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      );
    } catch (error) {
      setPageError(error?.data?.message || error.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <Navbar />

      {/* CHAT SECTION */}
      <div className="flex flex-1 min-h-[85vh]">

        {/* SIDEBAR */}
        <aside className="w-[360px] bg-white border-r border-gray-200 flex flex-col">
          <ChatSidebar
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelectConversation={setSelectedConversation}
            loading={loadingConversations}
          />
        </aside>

        {/* CHAT WINDOW */}
        <main className="flex-1 flex flex-col bg-[#F8F6F2]">
          {pageError && (
            <div className="mx-8 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-lg px-4 py-2">
              {pageError}
            </div>
          )}
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUserId={user?.id}
            loading={loadingMessages}
            sending={sending}
            onSendMessage={handleSendMessage}
          />
        </main>

      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}