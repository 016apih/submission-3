var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BNxk4GR8H0FTCtCPnhGYWVzlNjeBFR0W-8mJd9h_NPxw6kufhikTdWUXaZ3wHWSoFd8ThMyZXvndQTbKC3cHDBI",
    "privateKey": "3cpTexSg-SoVBusxAgDtcakzm1NDloywp-fV7gVDYj0"
};

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/f96XndVwc0E:APA91bGOdEbgv-DV_mBFHbHycRMY6jRuC0weSsoRcwUI7dKkvTeRsQ3SDjMIbA3Bv_3wnLJeg_T-QAOzgK4zFf5kfjUFYbG2ktUh-qW7E8WW7juEcskTSzuwQ3AlPgjfHP7o9bGASgsK",
    "keys": {
        "p256dh": "BB1CxoBU16fyvTLIbjc+j2ukbNVUD/A7H4dWbycZvTc7LZWRqftW2VXNM0XbMeDB+hsMXRZ5lGklta3axr55Z5c=",
        "auth": "3Q8L43OZ1yHF4QCt2RhgRg=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '299210653533',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);