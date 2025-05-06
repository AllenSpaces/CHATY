import { Colors } from "@/constants/Colors";
import { useSocket } from "@/context/socketContext";
import { useSqlLite } from "@/hooks/useSqlLite";
import { useStorage } from "@/hooks/useStorage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  receiver_id: string;
  content: string;
  created_at: string;
}

interface User {
  id: string;
}

function ChatMessageView() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const viewBackGround = Colors[useColorScheme() ?? "light"].viewBackGround;
  const msgcolor = Colors[useColorScheme() ?? "light"].text;
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState("");
  const headerBG = Colors[useColorScheme() ?? "light"].viewBackGround;
  const { socket } = useSocket();
  const storage = useStorage();
  const [user, setUser] = useState<User | null>(null);

  const [messageList, setMessageList] = useState<Message[]>([]);
  const { getOrCreateConversation, saveMessage, getMessages } = useSqlLite();
  const [conversationId, setConversationId] = useState<string | null>(null);

  const initChat = async (cid: string) => {
    const history = await getMessages(cid);
    setMessageList(history.reverse());
  };

  const getConId = async (userC: User) => {
    const convId = await getOrCreateConversation(
      userC.id,
      params.id as string,
      (params.nickname ? params.nickname : params.username) as string,
    );
    setConversationId(convId);
    initChat(convId);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !conversationId || !user?.id) return;

    const newMessage = {
      send: user.id,
      receive: params.id,
      message,
      created_at: Date.now(),
      conversationId,
    };

    socket?.emit("send-msg", newMessage);
    saveMessage(
      conversationId,
      user.id,
      params.id as string,
      message,
      Date.now(),
    );
    initChat(conversationId);
    setMessage("");
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result: any = await storage.getSecureValue("user");
        const userData = JSON.parse(result);
        setUser(userData);
        await getConId(userData);

        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: false });
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();

    navigation.setOptions({
      headerShown: true,
      headerTitle: params.nickname ? params.nickname : params.username,
      headerBackVisible: false,
      headerTitleAlign: "center",
      headerStyle: {
        height: Platform.OS === "ios" ? 100 : 90,
        backgroundColor: headerBG,
      },
      headerTitleStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    });

    const messageListener = () => {
      if (conversationId) {
        initChat(conversationId);
      }
    };

    socket?.on("msg-recieve", messageListener);

    return () => {
      socket?.off("msg-recieve", messageListener);
    };
  }, [conversationId]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.select({
        ios: 66,
        android: 0,
      })}
      style={{
        flex: 1,
        backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
      }}
    >
      <SafeAreaView
        edges={["bottom"]}
        style={{
          flex: 1,
          backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
        }}
      >
        <View style={style.chatSafe}>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => {
              if (scrollViewRef.current && messageList.length > 0) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }
            }}
            style={{
              ...style.message,
              backgroundColor: Colors[useColorScheme() ?? "light"].chatView,
            }}
            showsVerticalScrollIndicator={false}
          >
            {messageList.map((item, index) => (
              <View
                key={`${item.created_at}-${index}`}
                style={{
                  width: "100%",
                  minHeight: 40,
                  marginBottom: 15,
                  flexDirection:
                    item.receiver_id === user?.id ? "row" : "row-reverse",
                  paddingHorizontal: 10,
                }}
              >
                <Image
                  source={require("@/assets/Avatar-1024.jpg")}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 7,
                  }}
                />
                <View
                  style={{
                    minHeight: 40,
                    backgroundColor:
                      item.receiver_id === user?.id
                        ? viewBackGround
                        : "#009479",
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: item.receiver_id === user?.id ? 15 : 0,
                    marginRight: item.receiver_id === user?.id ? 0 : 10,
                    marginLeft: item.receiver_id === user?.id ? 10 : 0,
                    maxWidth: "70%",
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: item.receiver_id === user?.id ? msgcolor : "#fff",
                      fontWeight: "bold",
                      lineHeight: 24,
                    }}
                  >
                    {item.content}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={style.actionView}>
            <Ionicons
              name="mic-circle-outline"
              size={28}
              color={Colors[useColorScheme() ?? "light"].text}
            />
            <TextInput
              placeholder="请输入消息..."
              placeholderTextColor="#888"
              style={{
                ...style.messageInput,
                borderColor: Colors[useColorScheme() ?? "light"].borderColor,
              }}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
            />
            <Ionicons
              name="ellipsis-horizontal-circle-outline"
              size={28}
              color={Colors[useColorScheme() ?? "light"].text}
            />
            {message && (
              <Pressable
                style={{
                  width: 40,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 7,
                  backgroundColor: "#6db071",
                  marginLeft: 5,
                }}
                onPress={handleSendMessage}
              >
                <Text
                  style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}
                >
                  发送
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({
  chatSafe: {
    flex: 1,
  },
  message: {
    flex: 1,
    paddingTop: 20,
  },
  actionView: {
    height: Platform.select({
      ios: 48,
      android: 60,
    }),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  messageInput: {
    flex: 1,
    height: Platform.select({
      ios: 36,
      android: 40,
    }),
    color: "#999",
    paddingHorizontal: 10,
    marginHorizontal: 10,
    fontSize: Platform.select({ ios: 16, android: 16 * 0.85 }),
    fontWeight: "bold",
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default ChatMessageView;
