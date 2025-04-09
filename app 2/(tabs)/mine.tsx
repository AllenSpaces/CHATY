import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>我的</Text>
      </View>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({});
