cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "cordova-plugin-device-motion.Acceleration",
        "file": "plugins/cordova-plugin-device-motion/www/Acceleration.js",
        "pluginId": "cordova-plugin-device-motion",
        "clobbers": [
            "Acceleration"
        ]
    },
    {
        "id": "cordova-plugin-device-motion.accelerometer",
        "file": "plugins/cordova-plugin-device-motion/www/accelerometer.js",
        "pluginId": "cordova-plugin-device-motion",
        "clobbers": [
            "navigator.accelerometer"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification",
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification_android",
        "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-network-information.network",
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "id": "cordova-plugin-network-information.Connection",
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "id": "cordova-plugin-vibration.notification",
        "file": "plugins/cordova-plugin-vibration/www/vibration.js",
        "pluginId": "cordova-plugin-vibration",
        "merges": [
            "navigator.notification",
            "navigator"
        ]
    },
    {
        "id": "com.shazron.cordova.plugin.keychainutil.Keychain",
        "file": "plugins/com.shazron.cordova.plugin.keychainutil/www/keychain.js",
        "pluginId": "com.shazron.cordova.plugin.keychainutil",
        "clobbers": [
            "window.Keychain"
        ]
    },
    {
        "id": "de.appplant.cordova.plugin.email-composer.EmailComposer",
        "file": "plugins/de.appplant.cordova.plugin.email-composer/www/email_composer.js",
        "pluginId": "de.appplant.cordova.plugin.email-composer",
        "clobbers": [
            "cordova.plugins.email",
            "plugin.email"
        ]
    },
    {
        "id": "net.yoik.cordova.plugins.screenorientation.screenorientation",
        "file": "plugins/net.yoik.cordova.plugins.screenorientation/www/screenorientation.js",
        "pluginId": "net.yoik.cordova.plugins.screenorientation",
        "clobbers": [
            "cordova.plugins.screenorientation"
        ]
    },
    {
        "id": "net.yoik.cordova.plugins.screenorientation.screenorientation.android",
        "file": "plugins/net.yoik.cordova.plugins.screenorientation/www/screenorientation.android.js",
        "pluginId": "net.yoik.cordova.plugins.screenorientation",
        "merges": [
            "cordova.plugins.screenorientation"
        ]
    },
    {
        "id": "uk.co.whiteoctober.cordova.appversion.AppVersionPlugin",
        "file": "plugins/uk.co.whiteoctober.cordova.appversion/www/AppVersionPlugin.js",
        "pluginId": "uk.co.whiteoctober.cordova.appversion",
        "clobbers": [
            "cordova.getAppVersion"
        ]
    },
    {
        "id": "cordova-plugin-3dtouch.ThreeDeeTouch",
        "file": "plugins/cordova-plugin-3dtouch/www/ThreeDeeTouch.js",
        "pluginId": "cordova-plugin-3dtouch",
        "clobbers": [
            "ThreeDeeTouch"
        ]
    },
    {
        "id": "cordova-plugin-globalization.GlobalizationError",
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "id": "cordova-plugin-globalization.globalization",
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "pluginId": "cordova-plugin-globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    },
    {
        "id": "com.phonegap.plugins.PushPlugin.PushNotification",
        "file": "plugins/com.phonegap.plugins.PushPlugin/www/PushNotification.js",
        "pluginId": "com.phonegap.plugins.PushPlugin",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "id": "com.brodysoft.sqlitePlugin.SQLitePlugin",
        "file": "plugins/com.brodysoft.sqlitePlugin/www/SQLitePlugin.js",
        "pluginId": "com.brodysoft.sqlitePlugin",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "id": "hu.dpal.phonegap.plugins.SpinnerDialog.SpinnerDialog",
        "file": "plugins/hu.dpal.phonegap.plugins.SpinnerDialog/www/spinner.js",
        "pluginId": "hu.dpal.phonegap.plugins.SpinnerDialog",
        "merges": [
            "window.plugins.spinnerDialog"
        ]
    },
    {
        "id": "org.apache.cordova.plugin.ActivityIndicator.ActivityIndicator",
        "file": "plugins/org.apache.cordova.plugin.ActivityIndicator/www/activityIndicator.js",
        "pluginId": "org.apache.cordova.plugin.ActivityIndicator",
        "clobbers": [
            "ActivityIndicator"
        ]
    },
    {
        "id": "cordova-plugin-badge.Badge",
        "file": "plugins/cordova-plugin-badge/www/badge.js",
        "pluginId": "cordova-plugin-badge",
        "clobbers": [
            "plugin.notification.badge",
            "cordova.plugins.notification.badge"
        ]
    },
    {
        "id": "cordova-plugin-device-orientation.CompassError",
        "file": "plugins/cordova-plugin-device-orientation/www/CompassError.js",
        "pluginId": "cordova-plugin-device-orientation",
        "clobbers": [
            "CompassError"
        ]
    },
    {
        "id": "cordova-plugin-device-orientation.CompassHeading",
        "file": "plugins/cordova-plugin-device-orientation/www/CompassHeading.js",
        "pluginId": "cordova-plugin-device-orientation",
        "clobbers": [
            "CompassHeading"
        ]
    },
    {
        "id": "cordova-plugin-device-orientation.compass",
        "file": "plugins/cordova-plugin-device-orientation/www/compass.js",
        "pluginId": "cordova-plugin-device-orientation",
        "clobbers": [
            "navigator.compass"
        ]
    },
    {
        "id": "cordova-plugin-media.MediaError",
        "file": "plugins/cordova-plugin-media/www/MediaError.js",
        "pluginId": "cordova-plugin-media",
        "clobbers": [
            "window.MediaError"
        ]
    },
    {
        "id": "cordova-plugin-media.Media",
        "file": "plugins/cordova-plugin-media/www/Media.js",
        "pluginId": "cordova-plugin-media",
        "clobbers": [
            "window.Media"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-device": "1.1.4",
    "cordova-plugin-device-motion": "1.2.3",
    "cordova-plugin-dialogs": "1.3.1",
    "cordova-plugin-inappbrowser": "1.6.0",
    "cordova-plugin-network-information": "1.3.1",
    "cordova-plugin-splashscreen": "4.0.1",
    "cordova-plugin-statusbar": "2.2.2-dev",
    "cordova-plugin-vibration": "2.1.3",
    "com.shazron.cordova.plugin.keychainutil": "2.0.0",
    "de.appplant.cordova.plugin.email-composer": "0.8.2.1",
    "net.yoik.cordova.plugins.screenorientation": "1.3.3",
    "uk.co.whiteoctober.cordova.appversion": "0.1.7",
    "cordova-plugin-3dtouch": "1.3.6",
    "cordova-plugin-globalization": "1.0.9",
    "com.phonegap.plugins.PushPlugin": "3.2.0",
    "com.brodysoft.sqlitePlugin": "1.0.6",
    "hu.dpal.phonegap.plugins.SpinnerDialog": "1.3.1",
    "org.apache.cordova.plugin.ActivityIndicator": "1.0.0",
    "com.telerik.cordovaPlatformSpecificFiles": "0.1.0",
    "cordova-plugin-app-event": "1.2.1",
    "cordova-plugin-badge": "0.7.4",
    "cordova-plugin-device-orientation": "1.0.0",
    "cordova-plugin-media": "1.0.0",
    "cordova-plugin-ios-longpress-fix": "1.1.0"
};
// BOTTOM OF METADATA
});