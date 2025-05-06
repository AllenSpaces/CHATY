import ThemeText from "@/components/ThemeText";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import SafeVerifyCode from "@/components/SafeVeriryCode";
import { Colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";

function PayPassResetView() {
  const params = useLocalSearchParams();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorTips, setErrorTips] = useState("");

  const loadingColor = Colors[useColorScheme() ?? "light"].text;

  return (
    <SafeAreaView style={style.passSafe} edges={["top"]}>
      <View style={style.passView}>
        <ThemeText
          size={32}
          content={"支付密码确认"}
          style={{ fontWeight: "bold", marginBottom: 20 }}
        />
        <Text
          style={{
            maxWidth: "85%",
            fontSize: 15,
            color: "#c9c9c9",
            textAlign: "center",
            fontWeight: "bold",
            lineHeight: 25,
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          请再次设置您的支付密码,请勿使用生日/连续数字等易猜数字,每次支付均需验证改密码
        </Text>
      </View>
      <SafeVerifyCode
        codeNum={6}
        password={true}
        onChange={(value): any => setValue(value)}
        onComplete={(password, clear): any => {
          if (password !== params.initialPassword) {
            clear();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            router.replace({
              pathname: "/pay-pass-set",
              params: {
                errorTips: "两次密码输入不一致",
              },
            });
          }
        }}
      />
      {loading ? (
        <View style={style.loadingView}>
          <ActivityIndicator color={loadingColor} style={{ marginTop: 15 }} />
        </View>
      ) : null}
      {errorTips ? (
        <Text
          style={{
            textAlign: "center",
            color: "#ff9191",
            marginBottom: errorTips ? 15 : 0,
          }}
        >
          {errorTips}
        </Text>
      ) : null}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  passSafe: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  passView: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingView: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PayPassResetView;
