import * as SecureStore from "expo-secure-store";

export function useStorage() {
  const saveSecureValue = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  };

  // 获取安全数据
  const getSecureValue = async (key: string) => {
    return await SecureStore.getItemAsync(key);
  };

  // 删除安全数据
  const deleteSecureValue = async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  };

  return {
    saveSecureValue,
    getSecureValue,
    deleteSecureValue,
  };
}
