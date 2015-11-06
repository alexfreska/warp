var fs = require("fs");
var browserify = require("browserify");
var babelify = require("babelify");
var watchify = require("watchify");
var path = require('path');

browserify({ 
  debug: true,
  entries: path.resolve(__dirname, "./src/index.js"),
})
.transform(babelify.configure({
  "presets": ["es2015"]
}))
  .bundle()
  .on("error", function (err) { console.log("Error: " + err.message); })
  .pipe(fs.createWriteStream(path.resolve(__dirname, "./build/warpvm.js")));
