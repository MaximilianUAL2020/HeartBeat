/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./assets/js/content.js ***!
  \******************************/
// 1. Add image to DOM
// 2. Get counter on load
// 3. Get counter on stage change
// 4. Set icon according to elapsed time
var counter, active, limit, step; // get values from storage

chrome.storage.local.get(["myCounter", "myState", "myLimit"], function (result) {
  counter = result.myState ? result.myCounter : result.myLimit;
  active = result.myState;
  limit = result.myLimit;
  step = limit / 5;
  checkStep();
}); // listen to counter changes

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace == "local") {
    if (changes.myCounter) {
      counter = changes.myCounter.newValue;
    }

    if (changes.myLimit) {
      limit = changes.myLimit.newValue;
      step = limit / 5;
    }

    checkStep();
  }
}); // decrease healthbar

function checkStep() {
  if (counter % step) return;
  var index = counter / step;
  console.log(index);
}
/******/ })()
;