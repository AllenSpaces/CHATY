import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { getString } from "@/hooks/useLanguage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStorage } from "@/hooks/useStorage";
import { useCallback, useEffect, useState } from "react";

function InfoView() {
  const storage = useStorage();
  const [users, setUser] = useState<any>({});

  useFocusEffect(
    useCallback(() => {
      storage.getSecureValue("user").then((result: any) => {
        const newRes = JSON.parse(result);
        fetch("http://192.168.66.211:3000/chaty/v1/user-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: newRes.id }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code == 200) {
              setUser(data.data);
            }
          });
      });
    }, []),
  );

  return (
    <View style={style.container}>
      <View
        style={{
          ...style.foundation,
          backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
        }}
      >
        <SafeAreaView style={style.foundationSafe} edges={["top"]}>
          <View style={style.foundationInfo}>
            <View style={style.foundationInfoLeft}>
              <Image
                source={require("@/assets/Avatar-1024.jpg")}
                style={{
                  ...style.infoAvatar,
                  borderColor: Colors[useColorScheme() ?? "light"].borderColor,
                }}
              />
              <View style={style.foundationInfoContent}>
                <ThemeText
                  size={26}
                  content={users.username}
                  style={{ fontWeight: "bold" }}
                />
                <ThemeText
                  size={15}
                  content={"ID: " + users.chaty_id}
                  style={{ fontWeight: "bold" }}
                  config={{ numberOfLines: 1, ellipsizeMode: "tail" }}
                />
              </View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/user-qr-code",
                    params: {
                      chatyId: users.chaty_id,
                      username: users.username,
                      id: users.id,
                    },
                  })
                }
              >
                <Ionicons name="qr-code-outline" color={"#aaa"} size={20} />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
      <View style={style.infoEntry}>
        <Pressable
          style={{
            ...style.infoItem,
            backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          }}
          onPress={() => router.push("/wallet")}
        >
          <View style={style.infoLeft}>
            <View
              style={{
                ...style.infoLogo,
                backgroundColor: Colors[useColorScheme() ?? "light"].devIcon,
              }}
            >
              <Ionicons name="wallet-outline" size={16} color={"#fff"} />
            </View>
            <ThemeText
              size={20}
              content={getString().InfoConfigWallet}
              style={{
                fontWeight: "bold",
              }}
            />
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={16}
            color={Colors[useColorScheme() ?? "light"].text}
          />
        </Pressable>
        <Pressable
          style={{
            ...style.infoItem,
            backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          }}
          onPress={() => router.push("/config")}
        >
          <View style={style.infoLeft}>
            <View
              style={{
                ...style.infoLogo,
                backgroundColor: Colors[useColorScheme() ?? "light"].devIcon,
              }}
            >
              <Ionicons name="settings-outline" size={16} color={"#fff"} />
            </View>
            <ThemeText
              size={20}
              content={getString().InfoConfigSetting}
              style={{
                fontWeight: "bold",
              }}
            />
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={16}
            color={Colors[useColorScheme() ?? "light"].text}
          />
        </Pressable>
        <Pressable
          style={{
            ...style.infoItem,
            backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          }}
          onPress={() => router.push("/collect")}
        >
          <View style={style.infoLeft}>
            <View
              style={{
                ...style.infoLogo,
                backgroundColor: Colors[useColorScheme() ?? "light"].devIcon,
              }}
            >
              <Ionicons name="briefcase-outline" size={16} color={"#fff"} />
            </View>
            <ThemeText
              size={20}
              content={getString().InfoConfigCollect}
              style={{
                fontWeight: "bold",
              }}
            />
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={16}
            color={Colors[useColorScheme() ?? "light"].text}
          />
        </Pressable>
        <Pressable
          style={{
            ...style.infoItem,
            backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          }}
          onPress={() => router.push("/extensions")}
        >
          <View style={style.infoLeft}>
            <View
              style={{
                ...style.infoLogo,
                backgroundColor: Colors[useColorScheme() ?? "light"].devIcon,
              }}
            >
              <Ionicons
                name="extension-puzzle-outline"
                size={16}
                color={"#fff"}
              />
            </View>
            <ThemeText
              size={20}
              content={getString().InfoConfigPlugs}
              style={{
                fontWeight: "bold",
              }}
            />
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={16}
            color={Colors[useColorScheme() ?? "light"].text}
          />
        </Pressable>
        <Pressable
          style={{
            ...style.infoItem,
            backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          }}
          onPress={() => router.push("/about")}
        >
          <View style={style.infoLeft}>
            <View
              style={{
                ...style.infoLogo,
                backgroundColor: Colors[useColorScheme() ?? "light"].devIcon,
              }}
            >
              <Ionicons name="information-outline" size={16} color={"#fff"} />
            </View>
            <ThemeText
              size={20}
              content={getString().InfoConfigAbout}
              style={{
                fontWeight: "bold",
              }}
            />
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={16}
            color={Colors[useColorScheme() ?? "light"].text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  foundation: {
    height: "25%",
  },
  foundationSafe: {
    height: "100%",
  },
  foundationInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  foundationInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  foundationInfoContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    height: 70,
    paddingRight: 15,
  },
  infoAvatar: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginRight: 16,
    borderWidth: 1,
  },
  infoEntry: {
    flex: 1,
    marginTop: 7,
  },
  infoItem: {
    width: "100%",
    height: 60,
    borderRadius: 0,
    marginBottom: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLogo: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#8f8788",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
});

export default InfoView;
