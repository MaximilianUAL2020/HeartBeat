/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./assets/js/content.js ***!
  \******************************/
var counter, active, limit, step;
var parent = document.createElement("div");
var child = document.createElement("img");
parent.id = "heart-wrapper";
child.id = "heart"; // get values from storage

chrome.storage.local.get(["myCounter", "myState", "myLimit"], function (result) {
  counter = result.myState ? result.myCounter : result.myLimit;
  active = result.myState;
  limit = result.myLimit;
  step = limit / 5;
  checkStep();
  mountBar();
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
  var url = chrome.runtime.getURL("icons/heart_".concat(index, ".png"));
  child.src = url;
} // mount health bar


function mountBar() {
  parent.appendChild(child);
  document.body.appendChild(parent);
}
/******/ })()
;