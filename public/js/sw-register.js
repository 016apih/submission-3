// REGISTRASI SERVICE WORKER
console.log("INI SW REGISTER")
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(() =>  console.log("SW berhasil didaftarkan"))
            .catch(/*() => console.log("SW gagal didaftarkan")*/);
    });
} else {
    console.log("browser tidak mendukung ServiceWorker")
}

// REQUEST API UNTUK PERTAMA KALI
document.addEventListener("DOMContentLoaded", () => getTeamsFootball());

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Periksa fitur Notification API
if ("Notification" in window) {
    requestPermission();
} else {
    console.error("Browser tidak mendukung notifikasi.");
}

// request Permission
function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then((result) => {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }

            navigator.serviceWorker.ready.then(() => {
                if (('PushManager' in window)) {
                    navigator.serviceWorker.getRegistration().then((registration) => {
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array("BNxk4GR8H0FTCtCPnhGYWVzlNjeBFR0W-8mJd9h_NPxw6kufhikTdWUXaZ3wHWSoFd8ThMyZXvndQTbKC3cHDBI")
                        })
                        .then((subscribe) => {
                            console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                            console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('p256dh')))));
                            console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('auth')))));
                        })
                        .catch(/* (e) => console.error('Tidak dapat melakukan subscribe ', e.message) */);
                    });
                }
            })
        });
    }
}


