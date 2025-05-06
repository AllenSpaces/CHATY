import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { getString } from "@/hooks/useLanguage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function WalletView() {
  const [hidden, setHidden] = useState<Boolean>(false);
  const [actionList, _] = useState([
    {
      title: "",
      data: [
        {
          actionName: "收付款",
          route: "/collection-and-payment",
        },

        {
          actionName: "其他服务",
          route: "/wallet-others",
        },
      ],
    },
  ]);

  return (
    <SafeAreaView style={style.containerSafe}>
      <View
        style={{
          ...style.walletDesc,
          backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
        }}
      >
        <View
          style={{
            ...style.walletLogoView,
          }}
        >
          <View style={style.walletLogoBody}>
            <View
              style={{
                ...style.walletLogo,
                backgroundColor: Colors[useColorScheme() ?? "light"].devIcon,
              }}
            >
              <Ionicons name="wallet-outline" size={15} color={"#fff"} />
            </View>
            <ThemeText
              size={16}
              content={getString().InfoConfigWallet}
              style={{ fontWeight: "bold" }}
            />
          </View>
          <Pressable onPress={() => setHidden((hidden) => !hidden)}>
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              color={Colors[useColorScheme() ?? "light"].text}
              size={20}
            />
          </Pressable>
        </View>
        <View
          style={{
            ...style.moneyView,
            borderTopColor: Colors[useColorScheme() ?? "light"].borderColor,
            borderBottomColor: Colors[useColorScheme() ?? "light"].borderColor,
          }}
        >
          <ThemeText
            size={30}
            content={hidden ? "*****" : "¥ 0.00"}
            style={{ fontWeight: "bold" }}
            config={{
              numberOfLines: 1,
              ellipsizeMode: "tail",
            }}
          />
          <View style={style.revenueAndExpenditure}>
            <ThemeText
              size={15}
              content={hidden ? "收入：*****" : "收入：0.00"}
              style={{
                width: "50%",
                fontWeight: "bold",
                marginRight: 10,
              }}
              config={{
                numberOfLines: 1,
                ellipsizeMode: "tail",
              }}
            />
            <ThemeText
              size={15}
              content={hidden ? "支出：*****" : "支出：0.00"}
              style={{ width: "50%", fontWeight: "bold" }}
              config={{
                numberOfLines: 1,
                ellipsizeMode: "tail",
              }}
            />
          </View>
        </View>
        <Pressable onPress={() => router.push({ pathname: "/bill-detail" })}>
          <View
            style={{
              ...style.billView,
            }}
          >
            <ThemeText
              size={16}
              content={"账单详情"}
              style={{
                fontWeight: "500",
              }}
            />
            <Ionicons
              name="chevron-forward-outline"
              color={Colors[useColorScheme() ?? "light"].devIcon}
            />
          </View>
        </Pressable>
      </View>
      <SectionList
        style={{ flex: 1 }}
        sections={actionList}
        keyExtractor={(item: any) => item?.actionName}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index, section }) => (
          <Pressable
            onPress={() => router.push({ pathname: item.route as any })}
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
                backgroundColor:
                  Colors[useColorScheme() ?? "light"].viewBackGround,
              }}
            >
              <ThemeText
                size={18}
                content={item?.actionName}
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
            size={15}
            style={{
              marginBottom: title ? 15 : 0,
              marginTop: title ? 15 : 0,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  containerSafe: {
    flex: 1,
    padding: 20,
  },
  walletDesc: {
    height: 220,
    padding: 20,
    paddingBottom: 10,
    borderRadius: 15,
  },
  walletDescContent: {
    flex: 1,
    height: "100%",
    borderRadius: 15,
  },
  walletLogoView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletLogoBody: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletLogo: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  moneyView: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "space-evenly",
  },
  revenueAndExpenditure: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  billView: {
    height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

export default WalletView;
