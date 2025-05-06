import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import { useLocalSearchParams } from "expo-router";
import versionList from "@/system/versionHistory.json";
import { useEffect, useState } from "react";
import { Platform, ScrollView, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

function VersionHistoryDetailView() {
  const params = useLocalSearchParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    const string = versionList
      .filter((item) => item.title == params.version)[0]
      .data.filter((item) => item.desc.title == params.title)[0].desc.detail;
    setContent(() => {
      return string;
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ height: "100%" }}
      >
        <Markdown
          style={{
            body: { fontSize: 16, color: "#333" },
            heading1: {
              fontSize: Platform.OS === "ios" ? 24 : 18,
              fontWeight: "bold",
              color: Colors[useColorScheme() ?? "light"].text,
              marginBottom: 15,
            },
            heading2: {
              fontSize: Platform.OS === "ios" ? 22 : 16,
              color: Colors[useColorScheme() ?? "light"].text,
              fontWeight: "bold",
              marginBottom: 15,
            },
            link: { color: "blue" },
          }}
        >
          {content}
        </Markdown>
      </ScrollView>
    </SafeAreaView>
  );
}

export default VersionHistoryDetailView;
