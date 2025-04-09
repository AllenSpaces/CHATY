import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getString } from "@/hooks/useLanguage";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: getString().TabBarMineName,
          tabBarIcon: ({ color }) => (
            <Ionicons size={22} name="chatbox-ellipses-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: getString().TabBarMineName,
          tabBarIcon: ({ color }) => (
            <Ionicons size={22} name="information-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
