console.log("messageEncoder.js");
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function (e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    },
    get_device_data: function () {
        var appversion = localStorage.getItem('appversion');
    				var UDID = localStorage.getItem("deviceuuId");
        var deviceData = "Device Information: \n\nUDID: " + UDID + "\nDevice Model: " + device.model
            + "\nDevice Platform: " + device.platform + "\nDevice Version: " + device.version + "\nApp Version: " + appversion + "\n";
        return deviceData;
    },
    get_encoded_device_data: function () {
        var encodedDeviceData = Base64.encode(Base64.get_device_data());
        return encodedDeviceData;
    },
    fileCreationInAndroidAndSendMail: function (screen) {
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dir) {
            dir.getFile("device_info.txt", { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                    };
                    fileWriter.onerror = function (e) {
                    };
                    fileWriter.write(Base64.get_device_data());
                    setTimeout(function () {
                        Base64.sendAMail(fileEntry.nativeURL, screen);
                    }, 200);
                }, errorCallback);
            });
        });
       
    },
	 fileCreationInIOSAndSendMail: function (screen) {
        window.resolveLocalFileSystemURL(cordova.file.documentsDirectory, function (dir) {
            dir.getFile("device_info.txt", { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                    };
                    fileWriter.onerror = function (e) {
                    };
                    fileWriter.write(Base64.get_device_data());
                    setTimeout(function () {
                        Base64.sendAMail(fileEntry.nativeURL, screen);
                    }, 200);
                }, errorCallback);
            });
        });
       
    },
    sendAMail: function (filePath, screen) {
        var bodyText = "";
        if (screen == "Zone_LMP") {
            bodyText = 'This feedback is for ZoneLMP Page. <br/><br />';
        } else if (screen == "Demand") {
            bodyText = 'This feedback is for demand Page. <br/><br/>';
        } else if (screen == "Alerts") {
            bodyText = 'This feedback is for Alerts Page <br/><br/>';
        }
        if (!checkSimulator()) {
            window.plugin.email.isServiceAvailable(
                function (isAvailable) {
                    if (!isAvailable) {
                        if (screen == "Zone_LMP") {
                            localStorage.setItem("LMPMapClicks", 0);
                        } else if (screen == "Demand") {
                            localStorage.setItem("DemandClicks", 0);
                        } else if (screen == "Alerts") {
                            localStorage.setItem('alertsEnabledClicks', 0);
                        }
                        navigator.notification.alert('Check your mail app for configured mails', null, "PJM Now", "OK");
                    } else {
                        if (screen == "Alerts") {
                            localStorage.setItem('alertsEnabledClicks', 1);
                        }
                    }
                }
            );
            window.plugin.email.open({
                to: [mailToSendAFeedback],
                subject: 'PJM Now Feedback',
                body: bodyText,
                attachments: filePath, //externalRootDirectory
                isHtml: true
            }, Base64.androidEmailCallBack)
        }
    },
    androidEmailCallBack: function () {
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dir) {
            dir.getFile("device_info.txt", { create: true }, function (fileEntry) {

                setTimeout(function () {
                    fileEntry.remove(function () {
                    }, Base64.errorCallback);
                }, 500);
            }, Base64.errorCallback);
        });
    },


}