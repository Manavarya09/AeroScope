import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFFFFF',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  // In a real app, you would send this token to your server
  // const token = (await Notifications.getExpoPushTokenAsync()).data;
  // console.log(token);
};

export const scheduleFlightNotification = async (
  flightId: string,
  flightNumber: string,
  message: string,
  trigger: Notifications.NotificationTriggerInput
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Flight ${flightNumber}`,
      body: message,
      data: { flightId },
      sound: false,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });
};

export const scheduleLandingNotification = async (flightNumber: string, eta: string) => {
  // TODO: Implement landing notifications when trigger types are properly configured
  console.log(`Would schedule landing notification for ${flightNumber} at ${eta}`);
};

export const scheduleDepartureNotification = async (flightNumber: string, departureTime: string) => {
  // TODO: Implement departure notifications when trigger types are properly configured
  console.log(`Would schedule departure notification for ${flightNumber} at ${departureTime}`);
};

export const scheduleFavoriteNotification = async (flightNumber: string) => {
  // Simple immediate notification for favorites
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Flight Added to Favorites',
      body: `Now tracking ${flightNumber} in your favorites`,
      data: { flightNumber, type: 'favorite_added' },
    },
    trigger: null,
  });
};

export const cancelFlightNotification = async (notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};
