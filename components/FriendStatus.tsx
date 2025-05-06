import { Pressable, Text, View } from "react-native";
import ThemeText from "./ThemeText";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/socketContext";
import { useSqlLite } from "@/hooks/useSqlLite";
import { useStorage } from "@/hooks/useStorage";

function FriendStatus({ status, sender, send, receive }: any) {
  const [statu, setStatus] = useState(status);
  const { socket } = useSocket();
  const [user, setUser] = useState<any>();
  const { getOrCreateConversation } = useSqlLite();
  const storage = useStorage();

  useEffect(() => {
    socket?.on("friend-status-receive", (result) => {
      setStatus(result.state);
    });
    storage
      .getSecureValue("user")
      .then((res: any) => JSON.parse(res))
      .then((res) => {
        console.log(res);
        setUser(res);
      });
  }, []);

  const resolveAndReject = (state: string) => {
    fetch("http://192.168.66.211:3000/chaty/v1/set-friend-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ send, receive, status: state }),
    }).then(() => {
      setStatus(state);
      getOrCreateConversation(send, receive);
      socket?.emit("friend-status-send", {
        send,
        receive,
        state,
        username: user.username,
      });
    });
  };
  if (statu == "pending") {
    if (sender) {
      return (
        <ThemeText
          content={"待验证"}
          size={14}
          style={{ fontWeight: "bold" }}
        />
      );
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <Pressable
            style={{
              width: 45,
              height: 25,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 7,
              backgroundColor: "#6db071",
              marginRight: 5,
            }}
            onPress={() => resolveAndReject("resolve")}
          >
            <Text style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}>
              接受
            </Text>
          </Pressable>
          <Pressable
            style={{
              width: 45,
              height: 25,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 7,
              backgroundColor: "#db9597",
            }}
            onPress={() => resolveAndReject("reject")}
          >
            <Text style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}>
              拒绝
            </Text>
          </Pressable>
        </View>
      );
    }
  } else if (statu == "resolve") {
    return (
      <ThemeText content={"已接受"} size={14} style={{ fontWeight: "bold" }} />
    );
  } else if (statu == "reject") {
    return (
      <ThemeText content={"已拒绝"} size={14} style={{ fontWeight: "bold" }} />
    );
  }
}

export default FriendStatus;
