import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function AccountView() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  return (
    <SafeAreaView style={style.accountSafe}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "padding"}
        style={{ flex: 1 }}
      >
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <View style={style.accountLogoView}>
            <Image
              source={require("@/assets/Chaty-1024.png")}
              style={style.logoBody}
            />
            <ThemeText
              size={22}
              content={"茶言"}
              style={{ fontWeight: "bold" }}
            />
          </View>
          <View style={style.actionsView}>
            <TextInput
              value={phoneNumber}
              onChangeText={(value: any) => setPhoneNumber(() => value)}
              style={{
                ...style.phoneNumber,
                borderBottomColor:
                  Colors[useColorScheme() ?? "light"].borderColor,
                color: Colors[useColorScheme() ?? "light"].text,
              }}
              keyboardType="numeric"
              placeholder="请输入手机号码..."
              placeholderTextColor={"#888"}
            />
            <Pressable
              style={style.actionsButtonView}
              onPress={() => {
                if (!phoneNumber) {
                  Alert.alert("提示", "手机号不能为空");
                  return;
                }

                const regex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

                if (!regex.test(phoneNumber)) {
                  Alert.alert("提示", "手机号不合法");
                  setPhoneNumber("");
                  return;
                } else {
                  router.push({
                    pathname: "/verify-code",
                    params: {
                      phoneNumber,
                    },
                  });
                }
              }}
            >
              <Text
                style={{
                  fontSize: Platform.OS === "ios" ? 20 : 20 * 0.85,
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                登陆/注册
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  accountSafe: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "transparent",
  },
  accountLogoView: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBody: {
    width: Platform.OS === "ios" ? 90 : 90 * 0.85,
    height: Platform.OS === "ios" ? 90 : 90 * 0.85,
    borderRadius: 15,
    marginBottom: 15,
  },
  actionsView: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  phoneNumber: {
    height: 50,
    width: "80%",
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: Platform.OS === "ios" ? 18 : 18 * 0.85,
    textAlign: "center",
    fontWeight: "bold",
  },
  actionsButtonView: {
    width: "65%",
    height: Platform.OS === "ios" ? 50 : 50 * 0.85,
    backgroundColor: "#009479",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});

export default AccountView;
