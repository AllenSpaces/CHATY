import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { useSocket } from "@/context/socketContext";
import { useSqlLite } from "@/hooks/useSqlLite";
import { useStorage } from "@/hooks/useStorage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, useColorScheme, View } from "react-native";

function ChatView() {
  const { socket } = useSocket();
  const viewBackGround = Colors[useColorScheme() ?? "light"].viewBackGround;
  const [chatList, setChatList] = useState<any>([]);
  const { getAllConversations } = useSqlLite();
  const storage = useStorage();
  const [user, setUser] = useState();
  const [forceRefresh, setForceRefresh] = useState(0);

  const forceUpdateComponent = () => {
    setForceRefresh((prev) => prev + 1);
  };

  function formatTimeAgo(
    pastTime: number,
    currentTime: Date | number = new Date(),
  ): string {
    const pastTimestamp = pastTime;
    const currentTimestamp =
      currentTime instanceof Date ? currentTime.getTime() : currentTime;

    const diffInSeconds = Math.floor((currentTimestamp - pastTimestamp) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (diffInSeconds < 60) {
      return "刚刚";
    } else if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      // 改造这里，统一显示为 1 小时前
      return "1小时前";
    } else if (days < 30) {
      return `${days}天前`;
    } else if (months < 12) {
      return `${months}个月前`;
    } else {
      return `${years}年前`;
    }
  }

  const getID = (id: any) => {
    const parts = id.split("_");
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] !== user.id) {
        return parts[i];
      }
    }
  };

  const getMessageList = async () => {
    try {
      const res: any = await storage.getSecureValue("user");
      const result = JSON.parse(res);
      setUser(result);
      const conversations = await getAllConversations();
      console.log(conversations);
      setChatList(conversations);
      socket?.emit("register", result.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    socket?.on("friend-status-receive", () => {
      setTimeout(() => {
        getMessageList();
      }, 100);
    });
    socket?.on("msg-recieve", () => {
      setTimeout(() => {
        getMessageList();
      }, 100);
    });
  });

  useFocusEffect(
    useCallback(() => {
      getMessageList();
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      {chatList.map((item: any, index: number) => {
        return (
          <Pressable
            key={item + index}
            onPress={() => {
              router.push({
                pathname: "/chat-message",
                params: {
                  id: getID(item.id),
                  nickname: item.nick_name,
                },
              });
            }}
          >
            <View
              style={{
                height: 70,
                backgroundColor: viewBackGround,
                marginBottom: 10,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Image
                source={require("@/assets/Avatar-1024.jpg")}
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 12,
                  marginRight: 10,
                }}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                  height: 55,
                  padding: 5,
                }}
              >
                <ThemeText
                  content={item.nick_name}
                  size={19}
                  style={{ fontWeight: "bold" }}
                  config={{ numberOfLines: 1, ellipsizeMode: "tail" }}
                />
                <ThemeText
                  content={item.last_message}
                  size={13}
                  style={{ fontWeight: "bold" }}
                  config={{ numberOfLines: 1, ellipsizeMode: "tail" }}
                />
              </View>
              <View
                style={{
                  maxWidth: 50,
                  height: "95%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <ThemeText
                  content={
                    item.created_at
                      ? formatTimeAgo(item.created_at, Date.now())
                      : ""
                  }
                  size={13}
                />
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default ChatView;
