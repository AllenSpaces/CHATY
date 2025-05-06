import * as Notifications from "expo-notifications";

export async function useNotification(
  {
    title,
    body,
    data,
  }: {
    title: string;
    body: string;
    data?: object;
  },
  successCallBack: Function,
  errorCallBack: Function,
) {
  try {
    const result = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
        data,
      },
      trigger: null,
    });
    successCallBack(result);
  } catch (error) {
    errorCallBack(error);
  }
}
