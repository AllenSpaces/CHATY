import { Colors } from "@/constants/Colors";
import {
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import ThemeText from "@/components/ThemeText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

function AboutView() {
  return (
    <View
      style={{
        ...style.aboutContainer,
        backgroundColor: Colors[useColorScheme() ?? "dark"].viewBackGround,
      }}
    >
      <View style={style.aboutInfo}>
        <SafeAreaView style={style.aboutSafe}>
          <View style={style.aboutHeader}>
            <Image
              source={require("@/assets/Chaty-1024.png")}
              style={style.aboutIcon}
            />
            <ThemeText
              size={16}
              content={"Version  " + Constants.expoConfig?.version}
              style={style.aboutVersion}
            />
          </View>
          <View
            style={{
              width: "100%",
              marginTop: 50,
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <Pressable
              style={style.aboutItem}
              onPress={() => router.push("/version-history")}
            >
              <View style={style.aboutLeft}>
                <View
                  style={{
                    ...style.aboutLogo,
                    backgroundColor:
                      Colors[useColorScheme() ?? "light"].devIcon,
                  }}
                >
                  <Ionicons name="receipt-outline" size={16} color={"#fff"} />
                </View>
                <ThemeText
                  size={20}
                  content="历史版本"
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
            <Pressable style={style.aboutItem} onPress={() => {}}>
              <View style={style.aboutLeft}>
                <View
                  style={{
                    ...style.aboutLogo,
                    backgroundColor:
                      Colors[useColorScheme() ?? "light"].devIcon,
                  }}
                >
                  <Ionicons name="star-half" size={16} color={"#fff"} />
                </View>
                <ThemeText
                  size={20}
                  content="去评分"
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
            <Pressable style={style.aboutItem} onPress={() => {}}>
              <View style={style.aboutLeft}>
                <View
                  style={{
                    ...style.aboutLogo,
                    backgroundColor:
                      Colors[useColorScheme() ?? "light"].devIcon,
                  }}
                >
                  <Ionicons name="pencil-outline" size={16} color={"#fff"} />
                </View>
                <ThemeText
                  size={20}
                  content="反馈"
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
            <Pressable style={style.aboutItem} onPress={() => {}}>
              <View style={style.aboutLeft}>
                <View
                  style={{
                    ...style.aboutLogo,
                    backgroundColor:
                      Colors[useColorScheme() ?? "light"].devIcon,
                  }}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={16}
                    color={"#fff"}
                  />
                </View>
                <ThemeText
                  size={20}
                  content="检查更新"
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
        </SafeAreaView>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  aboutContainer: {
    flex: 1,
  },
  aboutInfo: {
    height: "100%",
  },
  aboutHeader: {
    alignItems: "center",
  },
  aboutSafe: {
    flex: 4 / 5,
    justifyContent: "center",
    alignItems: "center",
  },
  aboutIcon: {
    height: 70,
    width: 70,
    borderRadius: 15,
  },
  aboutVersion: {
    marginTop: 25,
    fontWeight: "bold",
  },
  aboutItem: {
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
  aboutLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  aboutLogo: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
});

export default AboutView;
