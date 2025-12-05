import React, { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { FormField } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./ChatCard.scss";
import { socket } from "@/service/sockets/socketManager";
import { setCookie, getCookie, refreshCookie, deleteCookie } from "@/utils/cookie";

type ChatMessage = {
  id: string;
  message: string;
  author?: string; // display name
  timestamp?: string;
};

const chatSchema = z.object({
  message: z.string().min(1, "El mensaje es requerido").max(500, "Máximo 500 caracteres")
});

type ChatFormSchema = z.infer<typeof chatSchema>;

// helper: try to read meeting id from URL path (e.g. /meeting/:id or last segment)
function getRoomFromUrl(): string {
  try {
    const parts = window.location.pathname.split("/").map(p => p.trim()).filter(Boolean);
    if (!parts.length) return "";
    const idx = parts.findIndex(p => p.toLowerCase() === "meeting" || p.toLowerCase() === "meet");
    if (idx !== -1 && parts.length > idx + 1) return parts[idx + 1];
    return parts[parts.length - 1];
  } catch {
    return "";
  }
}
// ChatPanel component
export const ChatPanel: React.FC<{ meetingId: string }> = ({ meetingId }) => {
  // read existing auth-based cookie set by AuthContext; fallback to random if missing
  const usernameRef = useRef<string>(getCookie("username") || `user-${Math.random().toString(36).slice(2, 8)}`);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const pendingIdsRef = useRef<Set<string>>(new Set());
  // track which room we joined to avoid duplicate join/leave
  const joinedRoomRef = useRef<string | null>(null);

  const { register, handleSubmit, reset } = useForm<ChatFormSchema>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" }
  });

  // attempt to join on mount using prop -> cookies -> URL
  useEffect(() => {
    const candidateRoom = (meetingId ?? "").toString().trim() || getCookie("chat_room") || getRoomFromUrl();
    if (!candidateRoom) {
      console.warn("ChatPanel: no meetingId available on mount, will not auto-join");
      return;
    }

    const room = candidateRoom;
    // avoid re-joining same room repeatedly
    if (joinedRoomRef.current !== room) {
      joinedRoomRef.current = room;
      // persist room only; username comes from AuthContext cookie (do not create here)
      setCookie("chat_room", room, 7);
      //console.log("ChatPanel: auto-joining room", room);
      socket.emit("joinRoom", room, { uid: usernameRef.current, name: usernameRef.current });
    }

    // refresh cookie on activity to extend expiry
    const onActivity = () => refreshCookie("chat_room", 7);
    window.addEventListener("mousemove", onActivity);
    window.addEventListener("keydown", onActivity);
    window.addEventListener("click", onActivity);

    const onMessage = (payload: any) => {
      const displayName = payload && (payload.name ?? payload.displayName ?? payload.userName ?? payload.userId) ? (payload.name ?? payload.displayName ?? payload.userName ?? payload.userId) : "unknown";
      const clientId = payload && payload.clientId ? payload.clientId : undefined;
      const ts = payload && payload.timestamp ? payload.timestamp : Date.now();
      const msgId = clientId ? clientId : `${displayName}-${ts}`;
      const isOwn = displayName === usernameRef.current;

      const incoming: ChatMessage = {
        id: msgId,
        message: payload.message,
        author: isOwn ? undefined : displayName,
        timestamp: payload.timestamp ?? new Date().toISOString()
      };

      if (clientId && pendingIdsRef.current.has(clientId)) {
        setMessages(prev => prev.map(m => (m.id === clientId ? incoming : m)));
        pendingIdsRef.current.delete(clientId);
        return;
      }

      setMessages(prev => [...prev, incoming]);
    };

    socket.on("chat:message", onMessage);

    return () => {
      if (joinedRoomRef.current === room) {
        //console.log("ChatPanel: leaving room", room);
        socket.emit("leaveRoom", room);
        // remove persisted room cookie when leaving
        deleteCookie("chat_room");
        joinedRoomRef.current = null;
      }
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("click", onActivity);
      socket.off("chat:message", onMessage);
    };
  }, [meetingId]);

  // scroll to bottom on new messages
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  // before sending, ensure we have a room (try joinedRef -> cookie -> URL), auto-join if needed
  const onSubmit = handleSubmit((data) => {
    const trimmed = data.message.trim();
    if (!trimmed) return;

    let room = joinedRoomRef.current || getCookie("chat_room") || getRoomFromUrl();
    room = room?.toString().trim() || "";

    if (!room) {
      console.warn("chat:message received without room, ignoring (no room available).");
      return;
    }

    // if not joined yet, join now
    if (joinedRoomRef.current !== room) {
      joinedRoomRef.current = room;
      setCookie("chat_room", room, 7);
      socket.emit("joinRoom", room, { uid: usernameRef.current, name: usernameRef.current });
      //console.log("ChatPanel: joined room before send", room);
    }

    const clientId = (crypto && (crypto as any).randomUUID)
      ? (crypto as any).randomUUID()
      : `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const timestamp = new Date().toISOString();

    const payload = {
      userId: usernameRef.current,
      message: trimmed,
      timestamp,
      clientId,
      room // ensure server receives room
    };

    pendingIdsRef.current.add(clientId);
    setMessages(prev => [
      ...prev,
      { id: clientId, message: payload.message, author: undefined, timestamp: payload.timestamp }
    ]);

    // refresh only the room cookie
    refreshCookie("chat_room", 7);
    socket.emit("chat:message", payload);
    reset();
  });

  return (
    <aside className="card chat-panel">
      <h2 className="card-header">Mensajes</h2>

      <div ref={listRef} className="chat-messages">
        {messages.length === 0 ? (
          <div className="text-muted">No hay mensajes todavía</div>
        ) : messages.map((message) => (
          <ChatMessage key={message.id} {...message} currentUser={usernameRef.current} />
        ))}
      </div>

      <form className="card-footer" onSubmit={onSubmit}>
        <FormField
          label="Mensaje"
          type="text"
          register={register("message")}
          endIcon={{
            icon: <SendHorizonal />,
            onClick: () => onSubmit()
          }}
        />
      </form>
    </aside>
  );
};

const ChatMessage: React.FC<ChatMessage & { currentUser?: string }> = ({ author, message, timestamp, currentUser }) => {
  const isOwn = author === undefined || author === currentUser;
  const className = `chat-message chat-message--${isOwn ? "right" : "left"}`;
  return (
    <div className={className}>
      {!isOwn && <span className="chat-message__author">{author}</span>}
      <div className="chat-message__bubble">{message}</div>
      {timestamp &&
        <div className="chat-timestamp">
          {new Date(timestamp)
            .toLocaleTimeString(
              [], { hour: "2-digit", minute: "2-digit" }
            )
          }
        </div>}
    </div>
  );
};