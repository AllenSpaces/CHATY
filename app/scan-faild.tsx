import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, Platform, ToastAndroid, View } from "react-native";

function HomeScreen() {
  useEffect(() => {
    Platform.OS === "ios"
      ? Alert.alert("提示", "无法识别该二维码", [
          {
            text: "确定",
            onPress: () => {
              router.replace("/scan-code");
            },
          },
        ])
      : ToastAndroid.show("无法识别该二维码", 2000);
  }, []);
  return <View></View>;
}

export default HomeScreen;
