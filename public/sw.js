importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
    console.log('workbox is working');
    /* Cache Font Files */
    workbox.routing.registerRoute(
        new RegExp(/(woff|woff2|ttf|otf)((\?.*)$|$)/),
        new workbox.strategies.CacheFirst({
            cacheName: "static-fonts"
        })
    );
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}