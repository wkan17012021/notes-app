const path = require("path");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};

// entry is the source to our app, currently it's set to the root of the proj
// output is where the bundled script will be produced. We have set it to a dist folder and named in bundle.js
// the devtool option is where we can set source maps. We defaulted to eval-source-map as it is readable but know that there are alternatives.
// we can run the bundler with this command: node_modules/.bin/webpack
// or setup a shortcut in package.json - npm run bundler
// remember to update the script in the app now to bundle.js. use dev tools to inspect the code and now you can step through it, set breakpoints and debug.
