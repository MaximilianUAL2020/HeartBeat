/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./assets/js/prompt.js ***!
  \*****************************/
var limit = 5;
var pause = 60000;
var step = pause / limit;
var counter = 0;
var image = document.getElementById("heart");
setInterval(function () {
  counter < limit ? counter++ : window.close();
  var url = chrome.runtime.getURL("icons/heart_".concat(counter, ".png"));
  image.src = url;
}, step);
/******/ })()
;