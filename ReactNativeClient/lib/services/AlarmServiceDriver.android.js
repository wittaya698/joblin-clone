const PushNotificationIOS =
    require('@react-native-community/push-notification-ios').default;

class AlarmServiceDriver {
    hasPersistentNotifications() {
        return true;
    }

    notificationIsSet(alarmId) {
        throw new Error('Available only for non-persistent alarms');
    }

    async clearNotification(id) {
        PushNotificationIOS.cancelLocalNotifications({ id: id });
    }

    async scheduleNotification(notification) {
        const androidNotification = {
            id: notification.id,
            message: notification.title, // No idea what the limits are for title and body but set something reasonable anyway
            date: notification.date
        };

        if ('body' in notification)
            androidNotification.body = notification.body;

        PushNotificationIOS.scheduleLocalNotification(androidNotification);
    }
}
module.exports = AlarmServiceDriver;
