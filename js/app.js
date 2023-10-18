// check to see if serviceWorker property exists in the browser's navigator object i.e see if SWs are supported in the user's browser. Do this with async JS using promises and callbacks.

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('service worker registered', reg))
.catch(err => console.log('service worker not registered', err))
}