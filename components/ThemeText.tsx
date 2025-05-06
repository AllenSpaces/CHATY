import { Colors } from "@/constants/Colors";
import { Platform, Text, useColorScheme } from "react-native";

function ThemeText({
  style,
  size,
  config,
  content,
}: {
  style?: any;
  size: number;
  config?: any;
  content: any;
}) {
  return (
    <Text
      style={{
        ...style,
        color: Colors[useColorScheme() ?? "dark"].text,
        fontSize: Platform.OS === "ios" ? size : size * 0.85,
      }}
      {...config}
    >
      {content}
    </Text>
  );
}

export default ThemeText;
