/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/background.js":
/*!*********************************!*\
  !*** ./assets/js/background.js ***!
  \*********************************/
/***/ (() => {

var loop;
var timeout;
var window = 400;
var step = 300;
var pause = 20000;
var init = step * 4;
var icons = {
  active: "../icons/48-on.png",
  inactive: "../icons/48-off.png"
};
var counter, active, limit;
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({
    myState: false,
    myLimit: init,
    myCounter: init
  }, function () {
    state = false;
    limit = init;
    counter = init;
  });
}); // get values from storage

chrome.storage.local.get(["myCounter", "myState", "myLimit"], function (result) {
  counter = result.myState ? result.myCounter : result.myLimit;
  active = result.myState;
  limit = result.myLimit;
  setIcon(active);
  if (active) setCounter();
}); // listen to state changes

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace == "local") {
    if (changes.myState) {
      active = changes.myState.newValue;
      handleState(active);
    }
  }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg == "reset") {
    clearInterval(loop);
    setCounter();
  } else if (request.msg == "plus") {
    incLimit();
  } else if (request.msg == "minus") {
    decLimit();
  }

  sendResponse(null);
}); // start the counter

function setCounter() {
  clearTimeout(timeout);
  counter = limit;
  updateCounter();
  if (active) loop = setInterval(runCounter, 1000);
} // run the counter


function runCounter() {
  counter > 0 ? counter-- : prompt();
  updateCounter();
} // open new prompt


function prompt() {
  clearInterval(loop);
  var pos = randomPos();
  chrome.windows.create({
    top: pos.h,
    left: pos.w,
    width: window,
    height: window,
    type: "popup",
    state: "normal",
    url: chrome.runtime.getURL("prompt.html")
  }, function () {
    timeout = setTimeout(setCounter, pause);
  });
} // update storage values


function updateCounter() {
  chrome.storage.local.set({
    myCounter: counter
  });
}

function updateLimit() {
  chrome.storage.local.set({
    myLimit: limit,
    myCounter: limit
  }, function () {
    counter = limit;
  });
}

function incLimit() {
  limit += step;
  updateLimit();
}

function decLimit() {
  if (limit > step) {
    limit -= step;
    updateLimit();
  } else {
    return;
  }
} // toggle the counter


function handleState(active) {
  if (!active) {
    clearInterval(loop);

    if (!counter) {
      clearTimeout(timeout);
      counter = limit;
      updateCounter();
    }
  } else {
    updateCounter();
    loop = setInterval(runCounter, 1000);
  }
} // toggle icon


function setIcon(bool) {
  chrome.browserAction.setIcon({
    path: icons[bool ? "active" : "inactive"]
  });
} //generate random position


function randomPos() {
  var w = screen.width;
  var h = screen.height;
  var rw = Math.floor(Math.random() * w - window) + window;
  var rh = Math.floor(Math.random() * h - window) + window;
  return {
    w: rw,
    h: rh
  };
}

/***/ }),

/***/ "./assets/css/popup.css":
/*!******************************!*\
  !*** ./assets/css/popup.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/css/prompt.css":
/*!*******************************!*\
  !*** ./assets/css/prompt.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/css/style.css":
/*!******************************!*\
  !*** ./assets/css/style.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/dist/js/background": 0,
/******/ 			"dist/css/style": 0,
/******/ 			"dist/css/prompt": 0,
/******/ 			"dist/css/popup": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			__webpack_require__.O();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["dist/css/style","dist/css/prompt","dist/css/popup"], () => (__webpack_require__("./assets/js/background.js")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/style","dist/css/prompt","dist/css/popup"], () => (__webpack_require__("./assets/css/popup.css")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/style","dist/css/prompt","dist/css/popup"], () => (__webpack_require__("./assets/css/prompt.css")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["dist/css/style","dist/css/prompt","dist/css/popup"], () => (__webpack_require__("./assets/css/style.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;