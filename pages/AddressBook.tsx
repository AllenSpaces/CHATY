import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { useSocket } from "@/context/socketContext";
import { useStorage } from "@/hooks/useStorage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

function AddressBookView() {
  const [addressList, setAdressList] = useState([]);
  const [searchAddressList, setSearchAddressList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const alphabet = searchAddressList.map((item: any) => item.title);
  const { text, viewBackGround, borderColor } =
    Colors[useColorScheme() ?? "light"];
  const [friendRequest, setFriendRequest] = useState(false);
  const { socket } = useSocket();
  const storage = useStorage();

  useFocusEffect(
    useCallback(() => {
      storage.getSecureValue("user").then((result: any) => {
        if (Object.keys(JSON.parse(result)).length > 0) {
          fetch(
            "http://192.168.66.211:3000/chaty/v1/friend_list?id=" +
              JSON.parse(result).id,
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.code == 200) {
                setAdressList(() => data.data);
                setSearchAddressList(() => data.data);
              }
            });
        }
      });

      socket?.on("friend-request", () => {
        setFriendRequest(true);
      });
    }, []),
  );

  return (
    <View style={style.addressContainer}>
      {friendRequest ? (
        <Pressable
          onPress={() => {
            setFriendRequest(false);
            router.push({
              pathname: "/new-friend",
            });
          }}
        >
          <View style={style.friendRequest}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: Platform.OS === "ios" ? 16 : 16 * 0.85,
                color: "#fff",
              }}
            >
              您有新的好友请求
            </Text>
            <Ionicons name="chevron-forward" color={"#fff"} />
          </View>
        </Pressable>
      ) : null}
      {Platform.OS === "ios" ? (
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
          value={searchValue}
          onChangeText={(text) => {
            setSearchValue(text);
            if (!text) {
              setSearchAddressList(addressList);
              return;
            }

            const filtered: any = addressList
              .map((section: any) => ({
                title: section.title,
                data: section.data.filter((item: any) =>
                  item.username.includes(text),
                ),
              }))
              .filter((section) => section.data.length > 0); // 移除空分组

            setSearchAddressList(filtered);
          }}
        />
      ) : null}

      {searchAddressList.length > 0 ? (
        <SectionList
          style={{ flex: 1, marginTop: 15, marginBottom: -15 }}
          stickySectionHeadersEnabled={false}
          sections={searchAddressList}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: 50,
            offset: 50 * index,
            index,
          })}
          renderItem={({ item, index, section }: any) => (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/friend-detail",
                  params: {
                    id: item.id,
                    nickname: item.nickname,
                    username: item.username,
                  },
                });
              }}
            >
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
                    content={item.nickName ? item.nickName : item.username}
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
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="file-tray-full" size={45} color={text} />
          <ThemeText
            content={"暂无数据"}
            size={16}
            style={{ fontWeight: "bold" }}
          />
        </View>
      )}
      <View style={style.alphabetSidebar}>
        {alphabet.map((letter) => (
          <TouchableOpacity key={letter}>
            <ThemeText content={letter} size={14} style={style.letter} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  addressContainer: {
    flex: 1,
    padding: 15,
  },
  containerSafe: {
    flex: 1,
  },
  friendRequest: {
    width: "100%",
    height: 45,
    backgroundColor: "#6db071",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
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

export default AddressBookView;
