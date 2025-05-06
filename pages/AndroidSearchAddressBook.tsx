import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { useStorage } from "@/hooks/useStorage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SectionList,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function AndroidSearchAddressBookView() {
  const [searchValue, setSearchValue] = useState("");
  const [addressList, setAdressList] = useState([]);
  const [searchAddressList, setSearchAddressList] = useState([]);
  const { text, viewBackGround, borderColor } =
    Colors[useColorScheme() ?? "light"];
  const storage = useStorage();

  useEffect(() => {
    storage.getSecureValue("user").then((result: any) => {
      if (Object.keys(JSON.parse(result)).length > 0) {
        fetch(
          "http://192.168.66.211:3000/chaty/v1/friend_list?id=" +
            JSON.parse(result).id,
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.code == 200) {
              setSearchAddressList(() => data.data);
            }
          });
      }
    });
  }, []);

  return (
    <SafeAreaView style={style.searchSafe}>
      <TextInput
        style={{
          height: 50,
          marginTop: 15,
          backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          borderRadius: 12,
          paddingLeft: 15,
          paddingRight: 15,
          color: Colors[useColorScheme() ?? "light"].text,
          fontSize: 16,
          fontWeight: "bold",
        }}
        placeholderTextColor="#888"
        placeholder="搜索联系人"
        autoFocus={true}
        value={searchValue}
        onChangeText={(text) => {
          setSearchValue(text);
          if (!text) {
            setAdressList([]);
            return;
          }

          const filtered: any = addressList
            .map((section: any) => ({
              title: section.title,
              data: section.data.filter((item: any) =>
                item.username.includes(text),
              ),
            }))
            .filter((section) => section.data.length > 0);

          setAdressList(filtered);
        }}
      />
      <SectionList
        style={{ flex: 1, marginTop: 15, marginBottom: -15 }}
        stickySectionHeadersEnabled={false}
        sections={addressList}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
        renderItem={({ item, index, section }: any) => (
          <Pressable onPress={() => {}}>
            <View
              style={{
                ...style.addressItem,
                borderTopLeftRadius: index === 0 ? 10 : 0,
                borderTopEndRadius: index === 0 ? 10 : 0,
                borderBottomLeftRadius:
                  index === section.data.length - 1 ? 10 : 0,
                borderBottomEndRadius:
                  index === section.data.length - 1 ? 10 : 0,
                borderBottomWidth: index !== section.data.length - 1 ? 1 : 0,
                borderBottomColor:
                  index !== section.data.length - 1
                    ? borderColor
                    : "transparent",
                backgroundColor: viewBackGround,
                marginBottom: index === section.data.length - 1 ? 10 : 0,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("@/assets/Avatar-1024.jpg")}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    marginRight: 10,
                  }}
                />
                <ThemeText
                  size={18}
                  content={item.username}
                  style={{
                    fontWeight: "500",
                  }}
                />
              </View>
              <Ionicons name="chevron-forward-outline" color={text} />
            </View>
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <ThemeText
            content={title}
            size={16}
            style={{
              fontWeight: 600,
              marginBottom: title ? 15 : 0,
              marginTop: title && title !== "A" ? 15 : 0,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  searchSafe: {
    flex: 1,
    padding: 15,
  },
  addressDesc: {
    height: 180,
    marginBottom: 15,
  },
  addressDescContent: {
    flex: 1,
    borderRadius: 15,
  },
  addressLogoView: {
    flex: 1,
    height: "100%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  addressLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addressItem: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 8,
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
  },
  alphabetSidebar: {
    position: "absolute",
    right: -2,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  letter: {
    paddingVertical: 2,
    fontWeight: "bold",
  },
});

export default AndroidSearchAddressBookView;
