let loop;
let timeout;
const step = 300;
const pause = 20000;
let limit = 1200;
let promptWidth = 400;
let active = false;
let counter = limit;

const icons = {
  active: "../icons/48-on.png",
  inactive: "../icons/48-off.png",
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set(
    {
      myState: false,
      myLimit: limit,
      myCounter: limit,
    },
    () => {
      console.log("Installed!");
    }
  );
});

// get values from storage
chrome.storage.local.get(["myCounter", "myState", "myLimit"], (result) => {
  counter = result.myCounter;
  active = result.myState;
  limit = result.myLimit;
  setIcon(active);
  if (active) play();
});
// listen to state changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    if (changes.myState) {
      active = changes.myState.newValue;
      handleState(active);
    }
  }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === "reset") reset();
  if (request.msg === "plus") incrementLimit();
  if (request.msg === "minus") decrementLimit();
  sendResponse(null);
});

// handle counter
function decrementCounter() {
  counter > 0 ? counter-- : delay();
  updateCounter();
}
// update storage values
function updateCounter() {
  chrome.storage.local.set({
    myCounter: counter,
  });
}
function updateLimit() {
  chrome.storage.local.set(
    {
      myLimit: limit,
    },
    () => {
      counter = limit;
      updateCounter();
    }
  );
}
// restart the counter
function play() {
  clearTimeout(timeout);
  counter = limit;
  updateCounter();
  if (active) loop = setInterval(decrementCounter, 1000);
}
// delay the counter
function delay() {
  clearInterval(loop);
  newWindow();
}
// reset the counter
function reset() {
  clearInterval(loop);
  play();
}
// toggle the counter
function handleState(state) {
  if (!state) {
    clearInterval(loop);
    if (!counter) {
      clearTimeout(timeout);
      counter = limit;
      updateCounter();
    }
  } else {
    updateCounter();
    loop = setInterval(decrementCounter, 1000);
  }
}
// toggle icon
function setIcon(bool) {
  chrome.browserAction.setIcon({
    path: icons[bool ? "active" : "inactive"],
  });
}
// create popup window
function newWindow() {
  let pos = randomPos();
  chrome.windows.create(
    {
      top: pos.h,
      left: pos.w,
      width: promptWidth,
      height: promptWidth,
      type: "popup",
      state: "normal",
      url: chrome.runtime.getURL("prompt.html"),
    },
    () => {
      timeout = setTimeout(play, pause);
    }
  );
}
//generate random position
function randomPos() {
  let w = screen.width;
  let h = screen.height;
  let rw = Math.floor(Math.random() * w - promptWidth) + promptWidth;
  let rh = Math.floor(Math.random() * h - promptWidth) + promptWidth;
  return { w: rw, h: rh };
}
function incrementLimit() {
  limit += step;
  updateLimit();
}
function decrementLimit() {
  limit > step ? (limit -= step) : (limit = step);
  updateLimit();
}
