/* ======================== PWA START ======================== */

const cacheName = 'Sample App';
const staticAssets = [
    './',
    './index.html',
    './pages/allUser.html',
    './pages/verify.html',
    './pages/chat.html',
    './pages/chatDash.html',
    './pages/friend.html',
    './pages/pending.html',
    './pages/profile.html',
    './pages/setting.html',
    './pages/signup.html',
    './src/auth.js',
    './src/app.js',
    './src/chat.js',
    './src/chatDash.js',
    './src/friend.js',
    './src/pending.js',
    './src/setting.js',
    './css/allUser.css',
    './css/chat.css',
    './css/main.css',
    './css/profile.css',
    './css/toast.css',
    './images/noUSer.png',
    './images/request.png',
    './images/load.gif',
    './images/fr.png',
    './images/hand.png',
]

self.addEventListener('install', event => {
    console.log('[ServiceWorker] Install');
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(staticAssets);
        })
    );
})

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const res = await fetch(req);
        cache.put(req, res.clone())
        return res
    } catch (error) {
        return await cache.match(req)
    }
}

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request)
        }).catch(function(error) {
            console.log(error)
        }).then(function(response) {
            return caches.open(cacheName).then(function(cache) {
                if (event.request.url.indexOf('test') < 0) {
                    cache.put(event.request.url, response.clone());
                }
                return response;
            })
        })

    );
});

/* ======================== PWA END ======================== */

/* ****************************************************************************************************************** */
/* ****************************************************************************************************************** */

/* ======================== PUSH NOTIFICATION ======================== */
/* ============================== START ============================== */


importScripts('https://www.gstatic.com/firebasejs/6.1.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-messaging.js');
// // Initialize the Firebase app in the service worker by passing in the
// importScripts('/__/firebase/init.js');
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBPtUCquiLSFvBloxY391zEpuVpejpY7l0",
  authDomain: "chatme-786.firebaseapp.com",
  databaseURL: "https://chatme-786.firebaseio.com",
  projectId: "chatme-786",
  storageBucket: "chatme-786.appspot.com",
  messagingSenderId: "344769746267",
  appId: "1:344769746267:web:e75010194d34246a"
  };
  firebase.initializeApp(config);

// messagingSenderId.
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


/* ======================== PUSH NOTIFICATION ======================== */
/* =============================== END =============================== */
