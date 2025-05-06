import ThemeText from "@/components/ThemeText";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import SafeVerifyCode from "@/components/SafeVeriryCode";
import { Colors } from "@/constants/Colors";
import { useStorage } from "@/hooks/useStorage";

function VerifyCodeView() {
  const params = useLocalSearchParams();
  const [value, setValue] = useState("");
  const [resendTime, setResendTime] = useState<any>(59);
  const [trigger, setTrigger] = useState(false);
  const [errorTips, setErrorTips] = useState("");
  const [loading, setLoading] = useState(false);
  const storage = useStorage();

  const loadingColor = Colors[useColorScheme() ?? "light"].text;
  let timer: any;

  const fetchVerifyCode = () => {
    if (trigger || loading) return;

    fetch("http://192.168.66.211:3000/chaty/v1/send-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account: params.phoneNumber }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.data.body.Code == "isv.BUSINESS_LIMIT_CONTROL") {
          Alert.alert("提示", "验证码已达上限，请稍后尝试", [
            {
              text: "确定",
              onPress() {
                router.back();
              },
            },
          ]);
        }
      });

    setTrigger(true);
    const timer = setInterval(() => {
      setResendTime((prevTime: number) => {
        if (prevTime <= 0) {
          setTrigger(false);
          clearInterval(timer);
          return "重新发送";
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const resend = () => {
    setResendTime(() => {
      fetchVerifyCode();
      return 59;
    });
  };

  useEffect(() => {
    fetchVerifyCode();
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={style.verifySafe} edges={["top"]}>
      <View style={style.verifyView}>
        <ThemeText
          size={32}
          content={"登陆校验"}
          style={{ fontWeight: "bold", marginBottom: 20 }}
        />
        <Text
          style={{
            fontSize: 15,
            color: "#c9c9c9",
            textAlign: "center",
            fontWeight: "bold",
            lineHeight: 25,
          }}
        >
          由4位数字组成的安全验证码已发送至您的手机号
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: "#c9c9c9",
            textAlign: "center",
            fontWeight: "bold",
            lineHeight: 25,
          }}
        >
          {"+86" + params.phoneNumber}
        </Text>
      </View>
      <SafeVerifyCode
        codeNum={4}
        onChange={(value): any => setValue(value)}
        onComplete={(verifyCode, clear): any => {
          setLoading(true);

          fetch("http://192.168.66.211:3000/chaty/v1/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              account: params.phoneNumber,
              code: verifyCode,
            }),
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.code == 200) {
                storage
                  .saveSecureValue("user", JSON.stringify(result.data))
                  .then(() => {
                    router.dismissTo("/");
                    router.replace("/(tabs)");
                  });
              } else {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Error,
                );
                setLoading(false);
                setValue("");
                clear();
                setErrorTips(result.msg);
                let tipTimer = setTimeout(() => {
                  setErrorTips("");
                  clearTimeout(tipTimer);
                }, 2000);
              }
            });
        }}
      />
      {loading ? (
        <View style={style.loadingView}>
          <ActivityIndicator color={loadingColor} style={{ marginTop: 15 }} />
        </View>
      ) : null}
      {loading ? null : (
        <View style={style.timeView}>
          <Text
            style={{
              textAlign: "center",
              color: "#ff9191",
              marginBottom: errorTips ? 15 : 0,
            }}
          >
            {errorTips}
          </Text>
          <Pressable
            onPress={() => {
              if (resendTime == "重新发送") {
                resend();
              }
            }}
          >
            <ThemeText
              size={16}
              content={resendTime.toString()}
              style={{ textAlign: "center", fontWeight: "bold" }}
            />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  verifySafe: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  verifyView: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingView: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  timeView: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default VerifyCodeView;
