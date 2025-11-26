import { SendHorizonal } from "lucide-react";
import { FormField } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./ChatCard.scss"
import { useToast } from "@/hooks/useToast";

type ChatMessage = {
  id: string;
  message: string;
  author?: string;
};

const chatMessages: ChatMessage[] = [
  { id: "1", author: "Camilo", message: "hola, saludos" },
  {
    id: "2",
    author: "Lina",
    message: "bienvenido a la llamada grupal",
  },
  { id: "3", author: "Camilo", message: "gracias por aceptarme" },
  { id: "4", message: "bienvenido camilo" },
  { id: "5", message: "bienvenida lina" },
];

const chatSchema = z.object({
  message: z
    .string()
    .min(1, "El mensaje es requerido")
    .max(100, "Máximo 100 caracteres")
})

type ChatFormSchema = z.infer<typeof chatSchema>;

export const ChatPanel = () => {
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChatFormSchema>({
    resolver: zodResolver(chatSchema),
  });

  const onSubmit = async (data: ChatFormSchema) => {
    console.log("Mensaje: ", data.message)
  }

  return (
    <aside className="card chat-panel">
      <h2 className="card-header" >Mensajes</h2>

      <div className="chat-messages">
        {chatMessages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </div>

      <form className="card-footer" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Mensaje"
          type="text"
          register={register("message")}
          endIcon={{
            icon: <SendHorizonal />,
            onClick: () => handleSubmit(onSubmit)()
          }}
        />
      </form>
    </aside>
  );
};

const ChatMessage: React.FC<ChatMessage> = ({ author, message }) => (
  <div className={`chat-message chat-message--${author ? "left" : "right"}`}>
    <span className="chat-message__author">{author}</span>
    <div className="chat-message__bubble">{message}</div>
  </div>
);