import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { router, SplashScreen, Stack } from "expo-router";
import "react-native-reanimated";
import { Platform, useColorScheme } from "react-native";
import { getString } from "@/hooks/useLanguage";
import { useEffect, useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import { StatusBar } from "expo-status-bar";
import { SocketProvider } from "@/context/socketContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { getSecureValue, saveSecureValue } = useStorage();
  const [accountState, setAccountState] = useState(false);

  const accountStatus = () => {
    getSecureValue("user").then(async (result) => {
      if (!result) {
        saveSecureValue("user", JSON.stringify({})).then(() => {
          accountStatus();
        });
      } else {
        if (Object.keys(JSON.parse(result)).length > 0) {
          router.replace({
            pathname: "/(tabs)",
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await SplashScreen.hideAsync();
        }
        setAccountState(() => {
          SplashScreen.hideAsync();
          return Object.keys(JSON.parse(result)).length > 0;
        });
      }
    });
  };

  useEffect(() => {
    accountStatus();
  }, []);

  return (
    <SocketProvider>
      <ThemeProvider
        value={useColorScheme() === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack
          screenOptions={{
            animation: Platform.OS === "ios" ? "default" : "slide_from_bottom",
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: getString().HomeTitle,
              animation: !accountState ? "default" : "none",
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              title: getString().AccountTitle,
            }}
          />
          <Stack.Screen
            name="pay-pass-set"
            options={{
              headerShown: false,
              title: getString().AccountTitle,
            }}
          />
          <Stack.Screen
            name="pay-pass-reset"
            options={{
              headerShown: false,
              title: getString().AccountTitle,
            }}
          />
          <Stack.Screen
            name="config"
            options={{
              headerShown: false,
              title: getString().ConfigTitle,
            }}
          />
          <Stack.Screen
            name="verify-code"
            options={{
              headerShown: false,
              title: getString().ConfigTitle,
            }}
          />
          <Stack.Screen
            name="about"
            options={{
              headerShown: false,
              title: getString().AboutTitle,
            }}
          />
          <Stack.Screen
            name="chat-message"
            options={{
              headerShown: false,
              title: getString().AboutTitle,
            }}
          />
          <Stack.Screen
            name="version-history"
            options={{
              headerShown: false,
              headerTitleAlign: "center",
              title: getString().HistoryTitle,
            }}
          />
          <Stack.Screen name="wallet" options={{ headerShown: false }} />
          <Stack.Screen name="bill-detail" options={{ headerShown: false }} />
          <Stack.Screen
            name="collection-and-payment"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="wallet-others" options={{ headerShown: false }} />
          <Stack.Screen name="self-info" options={{ headerShown: false }} />
          <Stack.Screen name="languages" options={{ headerShown: false }} />
          <Stack.Screen name="general" options={{ headerShown: false }} />
          <Stack.Screen name="chat-detail" options={{ headerShown: false }} />
          <Stack.Screen name="extensions" options={{ headerShown: false }} />
          <Stack.Screen name="collect" options={{ headerShown: false }} />
          <Stack.Screen name="scan-faild" options={{ headerShown: false }} />
          <Stack.Screen
            name="version-history-detail"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="system-permission"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="friend-permission"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="application-authorization"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="extensions-detail"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="change-account"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="friend-add"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="scan-code"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="user-qr-code"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="android-search-address-book"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen name="new-friend" options={{ headerShown: false }} />
          <Stack.Screen
            name="friend-detail"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen name="payment" options={{ headerShown: false }} />
        </Stack>
        <StatusBar />
      </ThemeProvider>
    </SocketProvider>
  );
}
