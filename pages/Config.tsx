import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { getString } from "@/hooks/useLanguage";
import { useStorage } from "@/hooks/useStorage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SectionList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ConfigView() {
  const [configList, _] = useState([
    {
      title: "",
      data: [
        {
          title: "个人信息",
          route: "/self-info",
        },
        {
          title: "语言",
          route: "/languages",
        },
        {
          title: "通用",
          route: "/pay-pass-set",
        },
      ],
    },
    {
      title: "隐私与安全",
      data: [
        {
          title: "系统权限",
          route: "/system-permission",
        },
        {
          title: "好友权限",
          route: "/friend-permission",
        },
        {
          title: "三方应用授权",
          route: "/application-authorization",
        },
      ],
    },
    {
      title: "插件",
      data: [
        {
          title: "插件详情",
          route: "/extensions-detail",
        },
      ],
    },
    {
      title: "账户操作",
      data: [
        {
          title: "切换账号",
          route: "/change-account",
        },
        {
          title: "退出登录",
        },
      ],
    },
  ]);
  const storage = useStorage();

  return (
    <SafeAreaView style={style.containerSafe}>
      <View style={style.configDesc}>
        <View
          style={{
            ...style.configLogoView,
            backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          }}
        >
          <View
            style={{
              ...style.configLogo,
              backgroundColor: Colors[useColorScheme() ?? "light"].devIcon,
            }}
          >
            <Ionicons name="settings-outline" size={32} color={"#fff"} />
          </View>
          <ThemeText
            size={20}
            content={getString().InfoConfigSetting}
            style={{ fontWeight: "bold" }}
          />
          <ThemeText
            size={14}
            content={
              "在这里您可以根据您的喜好自由配置，例如聊天记录，消息通知，隐私权限等"
            }
            style={{
              textAlign: "center",
              maxWidth: "90%",
              lineHeight: 20,
            }}
            config={{
              numberOfLines: 2,
              ellipsizeMode: "tail",
            }}
          />
        </View>
      </View>
      <View style={style.configListView}>
        <SectionList
          style={{ flex: 1 }}
          stickySectionHeadersEnabled={false}
          sections={configList}
          keyExtractor={(item) => item.title}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index, section }: any) => (
            <Pressable
              onPress={() => {
                if (item.route) {
                  router.push({
                    pathname: item.route,
                  });
                } else {
                  storage.deleteSecureValue("user").then(() => {
                    Alert.alert("提示", "确定要退出登录吗", [
                      {
                        text: "取消",
                      },
                      {
                        text: "确定",
                        onPress() {
                          router.dismissTo("/(tabs)");
                          router.replace("/");
                        },
                      },
                    ]);
                  });
                }
              }}
            >
              <View
                style={{
                  ...style.configItem,
                  borderTopLeftRadius: index === 0 ? 10 : 0,
                  borderTopEndRadius: index === 0 ? 10 : 0,
                  borderBottomLeftRadius:
                    index === section.data.length - 1 ? 10 : 0,
                  borderBottomEndRadius:
                    index === section.data.length - 1 ? 10 : 0,
                  borderBottomWidth: index !== section.data.length - 1 ? 1 : 0,
                  borderBottomColor:
                    index !== section.data.length - 1
                      ? Colors[useColorScheme() ?? "light"].borderColor
                      : "transparent",
                  marginBottom: index === section.data.length - 1 ? 10 : 0,
                  backgroundColor:
                    Colors[useColorScheme() ?? "light"].viewBackGround,
                }}
              >
                <ThemeText
                  size={18}
                  content={item.title}
                  style={{
                    fontWeight: "500",
                  }}
                />
                <Ionicons
                  name="chevron-forward-outline"
                  color={Colors[useColorScheme() ?? "light"].text}
                />
              </View>
            </Pressable>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemeText
              content={title}
              size={16}
              style={{
                fontWeight: 600,
                marginBottom: title ? 15 : 0,
                marginTop: title ? 15 : 0,
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  containerSafe: {
    flex: 1,
  },
  configDesc: {
    height: 220,
    padding: 20,
  },
  configDescContent: {
    flex: 1,
    borderRadius: 15,
  },
  configLogoView: {
    flex: 1,
    height: "100%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  configLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  configListView: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  configItem: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 8,
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
  },
});

export default ConfigView;
