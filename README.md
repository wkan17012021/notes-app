# Progressive Web App CRUD to-do-list

This is a repo for learning about progressive web applications. The app is for basic note-taking and includes create-read-update-delete functionality implemented with plain JavaScript. The data persists using Firestore Firebase noSQL backend, a low-code database solution using a document and collection key-value pair schema.

## Development Architecture

- Vanilla HTML, no templating etc. used. This enabled markup to be quickly added for iterative development and fine-tuned when the app grew.
- MaterializeCSS framework inline-class names to reduce time spent on custom styling. Helped to build static and dynamic components with appropriate aesthetic appearance. Some custom styling had to be used as the framework is not utility based.
- Vanilla JavaScript to keep improving on base JS knowledge: DOM traversing, DOM manipulation, custom functions etc. Could have used a library or framework which may have improved state management and maintenance of the code but elected not to on this project.
- Toastify.js npm package as a notification for successful and failed note submissions. But this is purely for UX.
- Webpack config bundler which was recommended with Firebase integration. This is useful as the bundler can remove unused JS code from the production environment which results in a performance boost by not loading unnecessary code, known as **tree shaking**.

## Deployment

To deploy this project, clone the repo to a new folder in your local machine, cd into the root directory of the app and run

```bash
  npm install
```

If you want to make changes the the JS code, upate using the webpack bundler run

```bash
  npm run bundle
```

Then use a local host server to run in development env.

Note this proj uses a "eval-source-map" development tool to improve readability to make debugging easier. Ideally shouldn't be implmented and JS should be hashed back to a compressed and unreadable format, for commercial production apps.

## PWA components

### Manifest.json

This is a single json file which provides metadata about our application to the browser. The manifest file for this app includes:

- the name of the app,
- the url that should load when the user clicks or taps the icon to open the app,
- the display type which can be set to browser, if you want the app to open in a users preferred browser. Otherwise, set to standalone which will load natively like a mobile app,
- background color which will be shown when the app loads (splash screen),
- An Icons array to load appropriately for different devices.

This is not an exhaustive list and more options can be found in the on sites like web.dev or MDN Docs.

### Service Worker File(SW)

Perhaps the most crucial component to a PWA. These javascript files allow for loading content when offline. When the user interacts when offline, the result is computed once they get online again is executed, known as **background sync**. SWs allow for **push notifications** - notifications on new content, messages, updated content etc.

#### How do SWs operate?

Traditionally, JS files are tightly coupled with the DOM along a single thread when requested by a web browser. SWs however, run on an isolated thread in the background and do not have access to the DOM. SWs can remain active on a mobile device even when the browser tab or app has been closed. **Their job is to listen to events and fire fetch requests and push messages or notifications when the event is triggered**.

It's important to consider for deployment, that **SWs only work on pages that have been served on HTTPS connection**. This is because SWs can intercept requests sent by the browser so they need to be secure. Localhost however is an exception for development ease.

#### SW Lifecyle

SW files are typically placed in the project root so they can have global scope of the project i.e. it has access to any files which it may need through its lifecycle. The first step is to **register the file**, you can do this through a separate javascript file e.g. app.js. When this happens, the **install event** gets fired when the browser parses this line of code. This is a useful first step, as we can then perform some functionality like cache media assets.

Once registered and installed, the SW becomes **active** and an active event is triggered where the SW 'listens' for global events in the app.

#### Altering the SW Code

If the code changes, the next time the page is refreshed, the new SW file will be registered and installed but remains in **waiting** i.e. not active. This is because the old SW code is still active and performing functionality. We need to wait until the old SW completes its lifecycle, then it will be swapped out for the in waiting new SW. Typically, the transition from old to new SW code happens when the app is refreshed or closed to reduce disturbance.

#### Retreiving data from the database with a PWA

The approach will differ depending on what database solution you implement. Most likely, the IndexedDB API found in dev tools application tab, is commonly used as a temporary store before it is uploaded to the server or as a client-side cache.
The main reason for using Firebase as the backend, apart from good documentation and far less code to write, is that it has offline mode capability.
