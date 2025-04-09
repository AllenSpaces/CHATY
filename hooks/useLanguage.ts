import * as SystemLanguage from "expo-localization";
import GlobalSetting from "@/system/globalSettings.json";
import { ENUS, JPJA, ZHCN } from "@/languages";

export function getString() {
  const SystemLocales = SystemLanguage.getLocales();
  const languageCode =
    GlobalSetting.SystemLanguage || SystemLocales[0].languageRegionCode;

  switch (languageCode) {
    case "CN":
      return ZHCN;
    case "US":
      return ENUS;
    case "JA":
      return JPJA;
    default:
      return ZHCN;
  }
}
