import ThemeText from "@/components/ThemeText";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import SafeVerifyCode from "@/components/SafeVeriryCode";
import { router, useLocalSearchParams } from "expo-router";
import useWeekPasswordVerify from "@/hooks/useWeekPasswordVerify";

function PayPassSetView() {
  const [value, setValue] = useState("");
  const [errorTips, setErrorTips] = useState("");

  const params = useLocalSearchParams();
  let timer: any;

  useEffect(() => {
    if (params.errorTips) {
      setErrorTips(params.errorTips as any);
      timer = setTimeout(() => {
        setErrorTips("");
        clearTimeout(timer);
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <SafeAreaView style={style.passSafe} edges={["top"]}>
      <View style={style.passView}>
        <ThemeText
          size={32}
          content={"设置支付密码"}
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
          请设置您的支付密码,请勿使用生日/连续数字等易猜数字,每次支付均需验证该密码
        </Text>
      </View>
      <SafeVerifyCode
        codeNum={6}
        password={true}
        onChange={(value): any => setValue(value)}
        onComplete={(password, clear): any => {
          const passwordVerify = useWeekPasswordVerify(password);
          if (passwordVerify) {
            if (timer) {
              clearTimeout(timer);
            }
            clear();
            setErrorTips("密码不能是连续或重复数字");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            timer = setTimeout(() => {
              setErrorTips("");
              clearTimeout(timer);
            }, 2000);
          } else {
            clear();
            router.replace({
              pathname: "/pay-pass-reset",
              params: {
                initialPassword: value,
              },
            });
          }
        }}
      />
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
});

export default PayPassSetView;
