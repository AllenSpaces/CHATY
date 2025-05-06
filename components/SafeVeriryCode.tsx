import { Colors } from "@/constants/Colors";
import { useEffect, useMemo, useState } from "react";
import { TextInput, useColorScheme, View } from "react-native";
import ThemeText from "./ThemeText";

type CodeNum = 4 | 6;

function SafeVerifyCode({
  codeNum,
  password,
  onComplete,
  onChange,
}: {
  codeNum: CodeNum;
  password?: boolean;
  onComplete: (verifyCode: string, clear: Function) => {};
  onChange: (verifyCode: string) => {};
}) {
  const [verifyCode, setVerifyCode] = useState("");
  const [codeNums, setCodeNums] = useState([]);
  const [isPassword, setIsPassword] = useState(false);
  const verifyViewBg = Colors[useColorScheme() ?? "light"].background;
  const verifyNumberBg = Colors[useColorScheme() ?? "light"].text;
  const verifyCodeBorder = Colors[useColorScheme() ?? "light"].borderColor;

  const clear = () => {
    setVerifyCode("");
  };

  useEffect(() => {
    if (verifyCode.length == codeNum) {
      onComplete(verifyCode, clear);
    }
  }, [verifyCode]);

  useEffect(() => {
    setIsPassword((): any => (password ? password : isPassword));
    setCodeNums((): any => {
      let newArr = [];
      if (codeNum) {
        for (let i = 0; i < codeNum; i++) {
          newArr.push(1);
        }
      } else {
        return [1, 1, 1, 1];
      }
      return newArr;
    });
  }, []);

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        height: 65,
      }}
    >
      <TextInput
        value={verifyCode}
        keyboardType="numeric"
        autoFocus={true}
        style={{
          width: "85%",
          height: codeNum == 4 ? 60 : 45,
          position: "relative",
          opacity: 0,
          zIndex: 2,
        }}
        onChangeText={(value) => {
          setVerifyCode(value);
          onChange(value);
        }}
        maxLength={codeNums.length}
      />
      <View
        style={{
          width: "85%",
          position: "absolute",
          top: 0,
          left: "50%",
          marginLeft: "-42.5%",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        {codeNums.map((_, index: number) => {
          return (
            <View
              key={index}
              style={{
                width: codeNum == 4 ? 60 : 45,
                height: codeNum == 4 ? 60 : 45,
                backgroundColor: verifyViewBg,
                borderRadius: 10,
                justifyContent: "center",
                borderWidth: verifyCode.length == index ? 3 : 1,
                borderColor: verifyCodeBorder,
                alignItems: "center",
              }}
            >
              {!isPassword ? (
                <ThemeText
                  size={24}
                  content={verifyCode[index]}
                  style={{ fontBold: "bold" }}
                />
              ) : verifyCode[index] ? (
                <View
                  style={{
                    backgroundColor: verifyNumberBg,
                    width: 12,
                    height: 12,
                    borderRadius: 50,
                  }}
                ></View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default SafeVerifyCode;
