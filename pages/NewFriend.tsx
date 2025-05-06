import FriendStatus from "@/components/FriendStatus";
import ThemeText from "@/components/ThemeText";
import { Colors } from "@/constants/Colors";
import { useStorage } from "@/hooks/useStorage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  SectionList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function NewFriendView() {
  const [friendStatusList, setFriendStatusList] = useState([]);
  const storage = useStorage();
  const { viewBackGround, borderColor } = Colors[useColorScheme() ?? "light"];

  useEffect(() => {
    storage.getSecureValue("user").then((result: any) => {
      fetch(
        "http://192.168.66.211:3000/chaty/v1/friend-status-list?id=" +
          JSON.parse(result).id,
      )
        .then((response) => response.json())
        .then((data) => {
          let newArr: any = [];
          let objSend: any = {
            title: "我发起的好友申请",
            data: [],
          };
          let objRec: any = {
            title: "我接受的好友申请",
            data: [],
          };

          data.data.forEach((item: any) => {
            if (item.send === JSON.parse(result).id) {
              objSend.data.push({ ...item, sender: true });
            } else {
              objRec.data.push({ ...item, sender: false });
            }
          });

          if (objSend.data.length > 0) newArr.push(objSend);
          if (objRec.data.length > 0) newArr.push(objRec);

          setFriendStatusList(newArr);
        });
    });
  }, []);

  return (
    <SafeAreaView style={style.newContainer}>
      <View style={style.configDesc}>
        <View
          style={{
            ...style.configLogoView,
            backgroundColor: Colors[useColorScheme() ?? "light"].viewBackGround,
          }}
        >
          <View
            style={{
              ...style.configLogo,
              backgroundColor: Colors[useColorScheme() ?? "light"].devIcon,
            }}
          >
            <Ionicons name="happy-outline" size={32} color={"#fff"} />
          </View>
          <ThemeText
            size={20}
            content={"好友请求"}
            style={{ fontWeight: "bold" }}
          />
          <ThemeText
            size={14}
            content={
              "用户向其他用户发送好友申请可再次查看，接收方可以同意或拒绝该请求，双方确认后建立好友关系。"
            }
            style={{
              textAlign: "center",
              maxWidth: "90%",
              lineHeight: 20,
            }}
            config={{
              numberOfLines: 2,
              ellipsizeMode: "tail",
            }}
          />
        </View>
      </View>
      <SectionList
        style={{ flex: 1, marginTop: 15, marginBottom: -15 }}
        stickySectionHeadersEnabled={false}
        sections={friendStatusList}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index, section }: any) => (
          <View
            style={{
              ...style.addressItem,
              borderTopLeftRadius: index === 0 ? 10 : 0,
              borderTopEndRadius: index === 0 ? 10 : 0,
              borderBottomLeftRadius:
                index === section.data.length - 1 ? 10 : 0,
              borderBottomEndRadius: index === section.data.length - 1 ? 10 : 0,
              borderBottomWidth: index !== section.data.length - 1 ? 1 : 0,
              borderBottomColor:
                index !== section.data.length - 1 ? borderColor : "transparent",
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
            <FriendStatus
              sender={item.sender}
              status={item.status}
              send={item.send}
              receive={item.receive}
            />
          </View>
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
  newContainer: {
    flex: 1,
    padding: 15,
  },
  configDesc: {
    height: 180,
  },
  configDescContent: {
    flex: 1,
    borderRadius: 15,
  },
  configLogoView: {
    flex: 1,
    height: "100%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  configLogo: {
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
});

export default NewFriendView;
