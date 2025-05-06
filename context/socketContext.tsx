import { useNotification } from "@/hooks/useNotification";
import { useSqlLite } from "@/hooks/useSqlLite";
import { useStorage } from "@/hooks/useStorage";
import React, { createContext, useContext, useEffect } from "react";
import io, { Socket } from "socket.io-client";
interface SocketContextType {
  socket: Socket | null;
}

const socketInstance = io("http://192.168.66.211:3000", {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
});

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { saveMessage, getOrCreateConversation } = useSqlLite();
  const storage = useStorage();

  useEffect(() => {
    socketInstance.on("friend-request", () => {
      useNotification(
        {
          title: "茶言",
          body: "您有一个好友请求",
        },
        () => {},
        () => {},
      );
    });

    socketInstance?.on("msg-recieve", async (result: any) => {
      await saveMessage(
        result.conversationId,
        result.send,
        result.receive,
        result.message,
        result.created_at,
      );

      useNotification(
        {
          title: result.send.username,
          body: result.message,
          data: { chatId: result.send },
        },
        () => {},
        () => {},
      );
    });

    socketInstance?.on("friend-status-receive", (result: any) => {
      useNotification(
        {
          title: "茶言",
          body:
            result.state == "resolve"
              ? "您的好友申请已通过"
              : "您的好友申请已被拒绝",
          data: {},
        },
        () => {
          if (result.state == "resolve") {
            storage
              .getSecureValue("user")
              .then((res: any) => JSON.parse(res))
              .then((res: any) => {
                console.log(result);
              });
          }
        },
        () => {},
      );
    });

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
