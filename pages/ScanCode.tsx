import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import {
  CameraView,
  scanFromURLAsync,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import ThemeText from "@/components/ThemeText";
import { useLinkUri } from "@/hooks/useLinkUri";
import { useStorage } from "@/hooks/useStorage";

function ScanCodeView() {
  let isScanned = false;
  const [flashLight, setFlashLight] = useState(true);
  const [scanState, setScanState] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, requestPermission]: any = useCameraPermissions();
  const storage = useStorage();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    if (Platform.OS === "android") {
      return (
        <View
          style={{
            ...style.container,
          }}
        >
          <ThemeText
            size={14}
            content={"We need your permission to show the camera"}
            style={style.message}
          />
          <Button onPress={requestPermission} title={"Get Permission"} />
        </View>
      );
    }
  }

  const pickImage = async () => {
    if (scanState) return;

    setScanState(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      const results = await scanFromURLAsync(result.assets[0].uri);

      if (results.length > 0) {
        qrCodeDetection(results[0].data);
        setScanState(false);
      } else {
        Platform.OS === "ios"
          ? Alert.alert("提示", "未检测到二维码")
          : ToastAndroid.show("未检测到二维码", 2000);
        setScanState(false);
        return;
      }
    } else {
      setScanState(false);
    }
  };

  const qrCodeDetection = async (data: any) => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/scan-success.mp3"),
    );

    await sound.playAsync();

    if (data && /chaty:\/\//.test(data)) {
      const { params } = useLinkUri(data);
      storage
        .getSecureValue("user")
        .then((result: any) => JSON.parse(result))
        .then((result) => {
          fetch(
            `http://192.168.66.211:3000/chaty/v1/isfriend?send=${result.id}&receive=${params.id}`,
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.code == 200) {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
                let timers = setTimeout(() => {
                  router.back();
                  router.push({
                    pathname: "/friend-add",
                    params: params,
                  });
                  clearTimeout(timers);
                }, 0);
              } else {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
                let timers = setTimeout(() => {
                  router.back();
                  router.push({
                    pathname: "/friend-detail",
                    params: params,
                  });
                  clearTimeout(timers);
                }, 0);
              }
            });
        });
    } else {
      let timers = setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          "糟糕",
          "很抱歉,暂时无法识别该类型二维码,我们会尽快支持，请不要捉急...",
          [
            {
              text: "取消",
              onPress() {
                router.back();
                clearTimeout(timers);
              },
            },
            {
              text: "重新扫码",
              onPress() {
                isScanned = false;
                clearTimeout(timers);
              },
            },
          ],
          {},
        );
      }, 0);
    }
  };

  return (
    <View style={style.scanCodeSafe}>
      <CameraView
        style={style.camera}
        facing={"back"}
        onCameraReady={() => setCameraReady(true)}
        enableTorch={!flashLight}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(result) => {
          if (!isScanned) {
            isScanned = true;
            setTimeout(() => {
              if (result) {
                qrCodeDetection(result.data);
              }
            }, 300);
          }
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() => {
              setFlashLight(() => {
                return !flashLight;
              });
            }}
            style={{
              width: 60,
              height: 60,
              backgroundColor: !flashLight ? "#eee" : "#333",
              opacity: 0.5,
              backdropFilter: "blur(20px)",
              position: "absolute",
              left: 50,
              bottom: 50,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="flashlight"
              size={30}
              color={!flashLight ? "#333" : "#fff"}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              pickImage();
            }}
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#333",
              opacity: 0.6,
              backdropFilter: "blur(20px)",
              position: "absolute",
              right: 50,
              bottom: 50,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="images" size={30} color={"#fff"} />
          </Pressable>
        </View>
      </CameraView>
      {scanState ? (
        <View style={style.mark}>
          <ActivityIndicator color="#fff" size={"large"} />
        </View>
      ) : null}
      <StatusBar barStyle={"light-content"} />
    </View>
  );
}

const style = StyleSheet.create({
  scanCodeSafe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 10,
    maxWidth: "50%",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  mark: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#000",
    opacity: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ScanCodeView;
