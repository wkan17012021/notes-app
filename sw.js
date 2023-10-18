// Caching strategies: https://web.dev/articles/offline-cookbook

const staticCache = "site-static-v1";
const dynamicCache = "site-dynamic-v1"; // this cache for other pages

const requestURLs = [
  "/",
  "/index.html",
  "/css/materialize.min.css",
  "/css/styles.css",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/assets/notepad, pen and plant.jpg",
  "/404.html",
  "/assets/404-image.jpg",
  "/assets/img-placeholder.jpg",
  "/assets/notes-note-svgrepo-com.svg",
  "/assets/icons/burger-menu-right-svgrepo-com.svg",
  "/assets/icons/trash-can-svgrepo-com.svg",
];

// Limit cache size function - read the explanation of .open, .keys() which are used in the install, activate, fetch handlers. Below, we are checking if the number of cache keys for a specific cache name exceeds a size, if so delete the first item of the cache array which is assumed to be the oldest. We have to rerun the function in the .then() until the number of keys in the cache doesn not exceed its size. We then invoke this function whenever we add to the cache, which is in the fetch event handler.

const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// 1. listen for sw installation after registration.
// self keyword refers to the service worker itself.
/* 
What should we cache when SW is installed? Things like templated markup, css, media like icons. The things unlikely to change often are collectively known as the app / core shell. However, when we update the cached assets like the html, we need to save these changes so the SW knows to cache this verion instead of the old one. So, when we have made the changes to the static assets, come back to sw.js and update the name of the staticCache variable e.g. site-static-v1. See the activate event handler below for how to manage new cached assets that you want the changes rendered.
Moreover, we should only cache other pages when the user is online and can access the page normally by HTTP request. When they are offline, they would then have some basic access to the particular page. If we cache all the pages of our app in one cached version, that is resource heavy and the user may not even navigate to all the pages.
*/

self.addEventListener("install", (event) => {
  //   console.log(
  //     "service worker installed successfully. Change any line of code in this file and the service worker will be re-installed."
  //   );

  /* 
  We have to use the waitUntil() method which expects a promise returned to it. We wait until the promise is resolved- which is the console.log and cache add all method, before completing the "install" event. Access cache with 'caches' keyword which is async task, open it using 'open' method and store using the variable defined globally above. If the cache doesn't exist, then create it. Use 'cache' arg in the callback fn and add items using add(single item) or addAll(array of items). Note that the items are actually HTTP requests and if fulfilled, then return resources.
  */
  event.waitUntil(
    caches.open(staticCache).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(requestURLs);
    })
  );
});

// 2. activate event
self.addEventListener("activate", (event) => {
  //   console.log(
  //     "service worker activated upon fresh install. You will not see this message if a previous service worker is already active. Check the application tab of dev tools. You will notice a SW active and another waiting to activate. This new SW will be active when all browser tabs are closed or the app is closed."
  //   );
  /* 
  Below is the functionality for handling new versions of cached assets. in reality there could be many so we need to perform some checking against each version.
  1. Again, we use waitUntil(), async method to check the caches obj keys. We don't want waitUntil to complete until its nested async tasks are complete e.g. keys(), Promises.all() and caches.delete(). FYI, keys is the name of the cached versions. 
  2. keys() async method grabs the name of the cached versions so we can perform checking and manipulation on them.
  3. Promise.all() is async and returns an array of promises - when each of those promises are fulfilled then Promise.all() resolves.
  4. For the filter method, we are saying, for each cache name / key, if the value does not match the value of staticCache defined at the top of sw.js (or dynamicCache as we don't want to delete our dynamic cache), then return true which places it into the new filter array. Cycling through all keys, theoretically we would have a new array of cached versions that do not match the current staticCache.
  5. Use .map() on the filtered array to delete them. caches.delete() resolves a promise for each position in the mapped array. This subsequently resolves Promise.all which is expecting an array of promises. then, waitUntil gets resolved by a single promise returned from Promise.all.
  Try changing some assets, renaming staticCache and check dev tools aplication cache storage - you should only see the latest cached version.
  */
  event.waitUntil(
    caches.keys().then((keys) => {
      //   console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCache && key !== dynamicCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// 3. listen for fetch events
/* 
The service worker acts as a proxy between our app and a server. When our app requests data e.g. media, css or js files from a cdn or other source, a fetch event is fired. The SW can listen for this event and react to it. This is where SWs are really powerful: we could do nothing and let the app request the resources it needs from the server e.g. first time visitor. We could intercept the request, modify it and even stop the request and return a custom response to the app. This could be useful for assets which are unlikely to change often and serve them from the service worker cache to returning visitors or offline users.
*/
/*
Below, we are checking the fetch event. If it matches one of our predetermined cached assets, then do not attempt to request from the server. Use the cached version instead. We can do this with respondWith(), which stops the fetch event and allows us to modify the request. We check if the caches has an event request (the css or js code etc.) that maches our cached URL. Note that match() is async and checks all caches, e.g. check static and dynamic caches. cacheRes refers to the cached Response for the particular event request. If the value is truthy, i.e. the event request matches something in our cache, then return it. The code after || fetch(event.request) is to handle storing dynamic cache data when the user navigates to other pages. See below explanation.
*/

/*
Initially, the dynamic cache data like html for other pages except for index.html should not exist so the fetch method is executed. The response is returned, we open the dynamic cache with open(), we put() the response in this cache using the key: request url; and value which is a clone of the response body. Then, the next time the user is offline, the dynamic cached data will be stored and accessible.
*/
/*
What happens if a user navigates to the homepage and then the about page whilst online, subsequently loses their connection and revisits either of the pages? They should still be routed to either as the index page is saved in the static cache, and then the about page would have been saved in the dynamic cache. But, if the user then tries to access the contact page offline without previously requesting it, the app will break in the fetch event handler. So, we improve the UX by creating a 404 page and place it as a redirect in the catch method below.
*/
self.addEventListener("fetch", (event) => {
  //   console.log("fetch event fired. In console, open up the event object and search for request URL for the resource being fetched.", event);
  // event.respondWith(
  //   caches
  //     .match(event.request)
  //     .then((cacheRes) => {
  //       return (
  //         cacheRes ||
  //         fetch(event.request).then((fetchRes) => {
  //           return caches.open(dynamicCache).then((cache) => {
  //             cache.put(event.request.url, fetchRes.clone());
  //             limitCacheSize(dynamicCache, 20);
  //             return fetchRes;
  //           });
  //         })
  //       );
  //     })
  //     .catch(() => {
  //       const eru = event.request.url;
  //       if (eru.includes(".html")) {
  //         return caches.match("/404.html");
  //       } else if (
  //         eru.includes(".jpg") ||
  //         eru.includes(".jpeg") ||
  //         eru.includes(".png")
  //       ) {
  //         return caches.match("/assets/img-placeholder.jpg");
  //       }
  //     })
  // );
});
