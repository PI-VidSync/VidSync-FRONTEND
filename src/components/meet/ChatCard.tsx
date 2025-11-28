import React, { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { FormField } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./ChatCard.scss";
import { socket } from "@/service/sockets/socketManager";

type ChatMessage = {
  id: string;
  message: string;
  author?: string; // will store display name (not internal userId)
  timestamp?: string;
};

const chatSchema = z.object({
  message: z.string().min(1, "El mensaje es requerido").max(500, "Máximo 500 caracteres")
});

type ChatFormSchema = z.infer<typeof chatSchema>;

export const ChatPanel: React.FC = () => {
  const usernameRef = useRef<string>(localStorage.getItem("chat_username") || `user-${Math.random().toString(36).slice(2, 8)}`);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const pendingIdsRef = useRef<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    reset
  } = useForm<ChatFormSchema>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" }
  });

  useEffect(() => {
    localStorage.setItem("chat_username", usernameRef.current);
    socket.emit("newUser", usernameRef.current);

    const onMessage = (payload: any) => {
      // prefer explicit display name fields if provided by server
      const displayName = payload && (payload.name ?? payload.displayName ?? payload.userName ?? payload.userId) ? (payload.name ?? payload.displayName ?? payload.userName ?? payload.userId) : "unknown";
      const clientId = payload && payload.clientId ? payload.clientId : undefined;
      const ts = payload && payload.timestamp ? payload.timestamp : Date.now();
      const msgId = clientId ? clientId : `${displayName}-${ts}`;

      // determine whether this message is from the current local user (compare display names)
      const isOwn = displayName === usernameRef.current;

      const incoming: ChatMessage = {
        id: msgId,
        message: payload.message,
        // only set author (display name) when not own message
        author: isOwn ? undefined : displayName,
        timestamp: payload.timestamp ?? new Date().toISOString()
      };

      // if we have an optimistic message with same clientId, replace it
      if (clientId && pendingIdsRef.current.has(clientId)) {
        setMessages(prev =>
          prev.map(m => (m.id === clientId ? incoming : m))
        );
        pendingIdsRef.current.delete(clientId);
        return;
      }

      setMessages(prev => [...prev, incoming]);
    };

    const onUsersOnline = (_payload: any) => {
      // optional presence handling
    };

    socket.on("chat:message", onMessage);
    socket.on("usersOnline", onUsersOnline);

    return () => {
      socket.off("chat:message", onMessage);
      socket.off("usersOnline", onUsersOnline);
    };
  }, []);

  // auto-scroll
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const onSubmit = handleSubmit((data) => {
    const trimmed = data.message.trim();
    if (!trimmed) return;

    const clientId = (crypto && (crypto as any).randomUUID)
      ? (crypto as any).randomUUID()
      : `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const timestamp = new Date().toISOString();

    const payload = {
      userId: usernameRef.current, // keep for server
      message: trimmed,
      timestamp,
      clientId
    };

    pendingIdsRef.current.add(clientId);
    // optimistic update: show as own message (author undefined)
    setMessages(prev => [
      ...prev,
      { id: clientId, message: payload.message, author: undefined, timestamp: payload.timestamp }
    ]);

    socket.emit("chat:message", payload);
    reset();
  });

  return (
    <aside className="card chat-panel">
      <h2 className="card-header">Mensajes</h2>

      <div ref={listRef} className="chat-messages" style={{ maxHeight: 360, overflowY: "auto" }}>
        {messages.length === 0 ? (
          <div className="text-muted" style={{ padding: 12 }}>No hay mensajes todavía</div>
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
  // author now contains display name (or undefined for   own messages)
  const isOwn = author === undefined || author === currentUser;
  const className = `chat-message chat-message--${isOwn ? "right" : "left"}`;
  return (
    <div className={className}>
      {!isOwn && <span className="chat-message__author">{author}</span>}
      <div className="chat-message__bubble">{message}</div>
      {timestamp && <div style={{ fontSize: 10, color: "#889096", marginTop: 4 }}>{new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>}
    </div>
  );
};