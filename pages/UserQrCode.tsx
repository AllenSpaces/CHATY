import { Colors } from "@/constants/Colors";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import UserConfig from "@/system/userInfo.json";
import ThemeText from "@/components/ThemeText";
import { getString } from "@/hooks/useLanguage";
import { useLocalSearchParams } from "expo-router";

function UserQrCodeView() {
  const params = useLocalSearchParams();

  return (
    <SafeAreaView style={style.containerSafe}>
      <View style={style.qrCodeView}>
        <View
          style={{
            ...style.qrCodeBody,
            backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          }}
        >
          <View style={style.qrCodeTips}>
            <View style={style.qrCodeTipsLeft}>
              <Image
                source={require("@/assets/Avatar-1024.jpg")}
                style={{
                  ...style.userAvatar,
                  borderColor: Colors[useColorScheme() ?? "light"].borderColor,
                }}
              />
              <View style={style.userInfo}>
                <ThemeText
                  size={20}
                  content={params.username}
                  style={{ fontWeight: "bold" }}
                />
                <ThemeText
                  size={13}
                  content={UserConfig.area}
                  style={{ fontWeight: "bold" }}
                />
              </View>
            </View>
          </View>
          <View style={style.qrCodeMain}>
            <View style={style.qrCodeMainBody}>
              <QRCode
                value={`chaty://friend?userChatyID=${params.chatyId}&username=${params.username}&id=${params.id}&method=scan`}
                quietZone={10}
                logo={require("@/assets/Avatar-1024.jpg")}
                logoSize={Platform.OS === "ios" ? 50 : 50 * 0.85}
                logoBorderRadius={10}
                size={Platform.OS === "ios" ? 250 : 250 * 0.85}
                backgroundColor="#fff"
              />
            </View>
          </View>
          <View style={style.qrCodeDesc}>
            <ThemeText
              size={13}
              content={getString().UserQrCodeTips}
              config={{
                numberOfLines: 2,
              }}
            />
          </View>
        </View>
      </View>

      <StatusBar barStyle={"light-content"} />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  containerSafe: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  qrCodeView: {
    flex: 2 / 3,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCodeBody: {
    width: "90%",
    flex: 1,
    borderRadius: 15,
  },
  qrCodeMain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCodeMainBody: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  qrCodeTips: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  qrCodeTipsLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
  },
  userInfo: {
    height: 60,
    marginLeft: 15,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  qrCodeDesc: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default UserQrCodeView;
