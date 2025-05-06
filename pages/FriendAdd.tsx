import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { useSocket } from "@/context/socketContext";
import { useStorage } from "@/hooks/useStorage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FriendAddView() {
  const params = useLocalSearchParams();
  const { socket } = useSocket();
  const [user, setUser] = useState<any>({});
  const storage = useStorage();

  useEffect(() => {
    storage
      .getSecureValue("user")
      .then((result: any) => JSON.parse(result))
      .then((result: any) => {
        setUser(result);
      });
  }, []);

  return (
    <SafeAreaView style={style.friendAddSafe} edges={["bottom"]}>
      <View style={style.friendAddView}>
        <Image
          source={require("@/assets/Avatar-1024.jpg")}
          style={{
            width: 90,
            height: 90,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors[useColorScheme() ?? "dark"].borderColor,
            marginBottom: 20,
          }}
        />
        <ThemeText
          size={28}
          content={params.username}
          style={{ fontWeight: "bold", marginBottom: 20 }}
        />
        <ThemeText
          size={16}
          content={"ID：" + params.userChatyID}
          style={{ fontWeight: "bold" }}
        />
      </View>
      <View style={style.friendAddInfo}></View>
      <Pressable
        onPress={() => {
          fetch("http://192.168.66.211:3000/chaty/v1/add-friend-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              send: user.id,
              receive: params.id,
              method: params.method,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.code == 200) {
                socket?.emit("friend-add", {
                  receive: params.id,
                  username: user.username,
                });
                router.back();
              } else if (data.code == 400700) {
                Alert.alert("提示", data.msg, [
                  {
                    text: "确定",
                  },
                ]);
              }
            });
        }}
        style={{
          ...style.friendAddActions,
          backgroundColor: Colors[useColorScheme() ?? "light"].tint,
        }}
      >
        <View
          style={{
            ...style.friendAddButton,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
            添加好友
          </Text>
        </View>
      </Pressable>
      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  friendAddSafe: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  friendAddView: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  friendAddInfo: {
    flex: 1,
  },
  friendAddActions: {
    height: 60,
    marginTop: 15,
    borderRadius: 10,
  },
  friendAddButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FriendAddView;
