import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  SectionList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import versionList from "@/system/versionHistory.json";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

function VersionHistoryView() {
  return (
    <SafeAreaView
      style={{
        ...style.versionSafe,
      }}
    >
      <View
        style={{
          ...style.versionDesc,
        }}
      >
        <View
          style={{
            ...style.versionLogoView,
            backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          }}
        >
          <View
            style={{
              ...style.versionLogo,
              backgroundColor: Colors[useColorScheme() ?? "light"].devIcon,
            }}
          >
            <Ionicons name="receipt-outline" size={32} color={"#fff"} />
          </View>
          <ThemeText
            size={20}
            content={"历史版本"}
            style={{ fontWeight: "bold" }}
          />
          <ThemeText
            size={14}
            content={
              "在这里您可以查看本应用的历史版本信息，方便您更快熟悉操作和使用应用"
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
      <SectionList
        style={{ flex: 1 }}
        sections={versionList}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        renderItem={({ item, index, section }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/version-history-detail",
                params: {
                  version: item.version,
                  title: item.desc.title,
                },
              })
            }
          >
            <View
              style={{
                ...style.versionItem,
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
                backgroundColor:
                  Colors[useColorScheme() ?? "light"].viewBackGround,
              }}
            >
              <ThemeText
                content={item?.desc.title}
                size={17}
                style={{
                  fontWeight: "600",
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
            content={"v " + title}
            size={16}
            style={{
              fontWeight: "bold",
              marginBottom: title ? 15 : 0,
              marginTop: title ? 15 : 0,
              marginLeft: 10,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  versionSafe: {
    flex: 1,
    padding: 10,
  },
  versionDesc: {
    height: 200,
  },
  versionDescContent: {
    flex: 1,
    borderRadius: 15,
  },
  versionLogoView: {
    flex: 1,
    height: "100%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  versionLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  versionItem: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 8,
  },
});

export default VersionHistoryView;
