import * as SystemLanguage from "expo-localization";
import { ENUS, JPJA, ZHCN } from "@/languages";

export function getString(globalLanguage?: string) {
  const SystemLocales = SystemLanguage.getLocales();
  const languageCode =
    globalLanguage && globalLanguage == "default"
      ? SystemLocales[0].languageCode
      : globalLanguage;

  switch (languageCode) {
    case "cn":
      return ZHCN;
    case "us":
      return ENUS;
    case "ja":
      return JPJA;
    default:
      return ZHCN;
  }
}
