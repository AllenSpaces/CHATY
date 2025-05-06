import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, TextInput, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function PaymentView() {
  const params: any = useLocalSearchParams();

  return (
    <SafeAreaView style={style.paymentSafe}>
      <View
        style={{
          ...style.accountView,
          backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
        }}
      >
        <TextInput value={params.account} />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  paymentSafe: {
    flex: 1,
    padding: 15,
  },
  accountView: {
    width: "100%",
    height: "15%",
  },
});

export default PaymentView;
