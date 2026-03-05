"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  deleteConversation,
  getConversationMessages,
  getMyConversations,
  sendConversationMessage,
  startConversation,
  uploadChatAttachment,
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
  const [typingMap, setTypingMap] = useState({});
  const [presenceMap, setPresenceMap] = useState({});

  const socketRef = useRef(null);
  const selectedConversationIdRef = useRef(null);
  const typingStopTimeoutRef = useRef(null);

  const joinSelectedConversationRoom = () => {
    const activeConversationId = selectedConversationIdRef.current;
    if (!socketRef.current?.connected || !activeConversationId) return;
    socketRef.current.emit("join_conversation", { conversationId: activeConversationId });
    socketRef.current.emit("mark_read", { conversationId: activeConversationId });
  };

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
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 20,
        reconnectionDelay: 1000,
        auth: {
          token,
        },
      });

      socket.on("connect", () => {
        setPageError("");
        joinSelectedConversationRoom();
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
                    lastMessageText: incoming.text || (incoming.attachments?.length ? "📎 Attachment" : ""),
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
                    lastMessageText: event.lastMessageText || (event?.message?.attachments?.length ? "📎 Attachment" : ""),
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

      socket.on("typing_state", (event) => {
        if (!event?.conversationId || !event?.userId) return;
        setTypingMap((prev) => {
          const existing = prev[event.conversationId] || {};
          return {
            ...prev,
            [event.conversationId]: {
              ...existing,
              [event.userId]: Boolean(event.isTyping),
            },
          };
        });
      });

      socket.on("presence_state", (event) => {
        if (!event?.userId) return;
        setPresenceMap((prev) => ({
          ...prev,
          [event.userId]: {
            online: Boolean(event.online),
            lastSeenAt: event.lastSeenAt || null,
          },
        }));
      });

      socket.on("messages_read", (event) => {
        if (!event?.conversationId || !Array.isArray(event?.messageIds) || !event?.readerId) return;
        if (event.conversationId !== selectedConversationIdRef.current) return;

        const readSet = new Set(event.messageIds.map(String));
        setMessages((prev) =>
          prev.map((message) => {
            if (!readSet.has(String(message.id))) return message;
            const readBy = Array.isArray(message.readBy) ? [...message.readBy] : [];
            if (!readBy.includes(event.readerId)) {
              readBy.push(event.readerId);
            }
            return {
              ...message,
              readBy,
            };
          })
        );
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
    if (socketRef.current.connected) {
      socketRef.current.emit("join_conversation", { conversationId: selectedConversationId });
    }
    return () => {
      socketRef.current?.emit("leave_conversation", { conversationId: selectedConversationId });
    };
  }, [selectedConversationId]);

  useEffect(() => {
    if (!socketRef.current || !selectedConversationId || messages.length === 0) return;
    socketRef.current.emit("mark_read", { conversationId: selectedConversationId });
  }, [messages, selectedConversationId]);

  useEffect(() => {
    return () => {
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = async ({ text, files = [] }) => {
    if (!selectedConversationId) return;
    const trimmedText = (text || "").trim();
    if (!trimmedText && (!files || files.length === 0)) return;

    setSending(true);
    setPageError("");
    try {
      const adContextId =
        selectedConversation?.ad?.id || selectedConversation?.lastMessageAdId || selectedConversation?.adId;

      const attachments = files.length
        ? await Promise.all(files.map((file) => uploadChatAttachment(file)))
        : [];

      let message;

      if (socketRef.current?.connected) {
        try {
          message = await Promise.race([
            new Promise((resolve, reject) => {
              socketRef.current.emit(
                "send_message",
                {
                  conversationId: selectedConversationId,
                  text: trimmedText,
                  adId: adContextId,
                  attachments,
                },
                (ack) => {
                  if (!ack || ack.success === false) {
                    reject(new Error(ack?.message || "Failed to send message."));
                    return;
                  }
                  resolve(ack.data);
                }
              );
            }),
            new Promise((_, reject) => {
              setTimeout(() => reject(new Error("Socket ack timeout")), 2500);
            }),
          ]);
        } catch {
          const response = await sendConversationMessage(selectedConversationId, trimmedText, adContextId, attachments);
          message = response?.data;
        }
      } else {
        const response = await sendConversationMessage(selectedConversationId, trimmedText, adContextId, attachments);
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
                  lastMessageText: message.text || (message.attachments?.length ? "📎 Attachment" : ""),
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

  const handleDeleteConversation = async (conversationId) => {
    try {
      await deleteConversation(conversationId);

      setConversations((prev) => {
        const updated = prev.filter((conversation) => conversation.id !== conversationId);

        if (selectedConversationIdRef.current === conversationId) {
          setSelectedConversation(updated[0] || null);
          setMessages([]);
        }

        return updated;
      });
    } catch (error) {
      setPageError(error?.data?.message || error.message || "Failed to delete conversation.");
    }
  };

  const handleTyping = (isTyping) => {
    if (!selectedConversationId || !socketRef.current?.connected) return;
    if (isTyping) {
      socketRef.current.emit("typing_start", { conversationId: selectedConversationId });
      if (typingStopTimeoutRef.current) clearTimeout(typingStopTimeoutRef.current);
      typingStopTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit("typing_stop", { conversationId: selectedConversationId });
      }, 1300);
      return;
    }

    if (typingStopTimeoutRef.current) {
      clearTimeout(typingStopTimeoutRef.current);
      typingStopTimeoutRef.current = null;
    }
    socketRef.current.emit("typing_stop", { conversationId: selectedConversationId });
  };

  const otherUserId = selectedConversation?.otherUser?.id;
  const selectedPresence = otherUserId ? presenceMap[otherUserId] : null;
  const isOtherUserTyping = Boolean(
    selectedConversationId &&
      otherUserId &&
      typingMap[selectedConversationId] &&
      typingMap[selectedConversationId][otherUserId]
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* CHAT SECTION */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-[360px] bg-white border-r border-gray-200 flex flex-col h-full min-h-0 overflow-hidden">
          <ChatSidebar
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelectConversation={setSelectedConversation}
            onDeleteConversation={handleDeleteConversation}
            loading={loadingConversations}
          />
        </aside>

        {/* CHAT WINDOW */}
        <main className="flex-1 flex flex-col bg-[#F8F6F2] h-full min-h-0 overflow-hidden">
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
            presence={selectedPresence}
            isOtherUserTyping={isOtherUserTyping}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
          />
        </main>

      </div>
    </div>
  );
}