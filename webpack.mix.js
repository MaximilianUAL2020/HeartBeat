const mix = require("laravel-mix");

mix
  .setPublicPath("./")
  .postCss("assets/css/popup.css", "dist/css")
  .postCss("assets/css/style.css", "dist/css")
  .postCss("assets/css/prompt.css", "dist/css")
  .copy("assets/icons/", "dist/icons")
  .js("assets/js/background.js", "dist/js")
  .js("assets/js/content.js", "dist/js")
  .js("assets/js/popup.js", "dist/js")
  .js("assets/js/prompt.js", "dist/js")
  .vue()
  .options({ processCssUrls: false });
