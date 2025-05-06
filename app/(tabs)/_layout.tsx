import { router, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getString } from "@/hooks/useLanguage";
import * as Notifications from "expo-notifications";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, _] = useState(false);

  async function requestNotificationPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarPosition: "bottom",
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].viewBackGround,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: {
            height: Platform.OS === "ios" ? 100 : 90,
          },
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: Platform.OS == "ios" ? "bold" : "light",
          },
          title: isLoading ? "读取中" : getString().TabBarChatName,
          tabBarIcon: ({ color }) =>
            isLoading ? (
              <ActivityIndicator color="#009479" />
            ) : (
              <Ionicons
                size={22}
                name="chatbox-ellipses-outline"
                color={color}
              />
            ),
          headerRight: () => (
            <Ionicons
              name="scan-outline"
              color={useColorScheme() == "dark" ? "#fff" : "#111"}
              size={18}
              style={{ marginRight: 15 }}
              onPress={() => {
                router.push("/scan-code");
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="address-book"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: {
            height: Platform.OS === "ios" ? 100 : 90,
          },
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: Platform.OS == "ios" ? "bold" : "light",
          },
          headerRight: () => {
            return Platform.OS === "ios" ? (
              <Ionicons
                name="person-add"
                color={useColorScheme() == "dark" ? "#fff" : "#111"}
                size={18}
                style={{ marginRight: 15 }}
                onPress={() => {
                  router.push("/new-friend");
                }}
              />
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Ionicons
                  name="search-outline"
                  color={useColorScheme() == "dark" ? "#fff" : "#111"}
                  size={18}
                  style={{ marginRight: 15 }}
                  onPress={() => {
                    router.push("/android-search-address-book");
                  }}
                />
                <Ionicons
                  name="person-add"
                  color={useColorScheme() == "dark" ? "#fff" : "#111"}
                  size={18}
                  style={{ marginRight: 15 }}
                  onPress={() => {
                    router.push("/new-friend");
                  }}
                />
              </View>
            );
          },
          title: getString().TabBarAddressBookName,
          tabBarIcon: ({ color }) => (
            <Ionicons size={22} name="people-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          headerShown: false,
          title: getString().TabBarInfoName,
          tabBarIcon: ({ color }) => (
            <Ionicons size={22} name="information-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
