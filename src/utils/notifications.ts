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
  // Schedule notification for when flight is expected to land
  const etaTime = new Date();
  const [hours, minutes] = eta.split(':').map(Number);
  etaTime.setHours(hours, minutes - 5, 0, 0); // 5 minutes before ETA

  if (etaTime > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Flight ${flightNumber}`,
        body: `Flight ${flightNumber} is landing in 5 minutes`,
        data: { flightId: flightNumber },
        sound: false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: etaTime,
    });
  }
};

export const scheduleDepartureNotification = async (flightNumber: string, departureTime: string) => {
  // Schedule notification for departure
  const departureDateTime = new Date();
  const [hours, minutes] = departureTime.split(':').map(Number);
  departureDateTime.setHours(hours, minutes, 0, 0);

  if (departureDateTime > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Flight ${flightNumber}`,
        body: `Flight ${flightNumber} is departing soon`,
        data: { flightId: flightNumber },
        sound: false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: departureDateTime,
    });
  }
};

export const scheduleFavoriteNotification = async (flightNumber: string) => {
  // Immediate notification when flight is favorited
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Flight Added to Favorites',
      body: `Now tracking ${flightNumber} in your favorites`,
      data: { flightNumber, type: 'favorite_added' },
    },
    trigger: null, // Show immediately
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
