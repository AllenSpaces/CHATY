import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FriendDetailView() {
  const params = useLocalSearchParams();

  const [userDetail, setUserDetail] = useState<any>({});

  useEffect(() => {
    fetch("http://192.168.66.211:3000/chaty/v1/user-detail?id=" + params.id)
      .then((response) => response.json())
      .then((data) => {
        if (data.code == 200) {
          setUserDetail(data.data[0]);
        }
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
          content={userDetail.username}
          style={{ fontWeight: "bold", marginBottom: 20 }}
        />
        <ThemeText
          size={16}
          content={"ID：" + userDetail.chaty_id}
          style={{ fontWeight: "bold" }}
        />
      </View>
      <View style={style.friendAddInfo}></View>
      <Pressable
        onPress={() => {
          router.back();
          router.push({
            pathname: "/chat-message",
            params: {
              id: params.id,
              username: params.username,
              nickname: params.nickname,
            },
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
            发送消息
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
export default FriendDetailView;
