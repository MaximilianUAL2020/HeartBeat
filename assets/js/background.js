let loop;
let timeout;
let limit = 5;
let pause = 1000;
let myState = false;
let promptWidth = 400;
let myCounter = limit;

const icons = {
  active: "../icons/48-on.png",
  inactive: "../icons/48-off.png",
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set(
    {
      myCounter: limit,
      myState: false,
    },
    () => {
      console.log("Installed!");
    }
  );
});

updateCounter(); // reset counter to limit (local storage)

// set values from storage
chrome.storage.local.get(["myState"], (result) => {
  myState = result.myState;
  setIcon(myState);
  if (myState) play();
});
// listen to state changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local") {
    if (changes.myState) {
      myState = changes.myState.newValue;
      handleState(myState);
    }
  }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === "reset") reset();
  sendResponse(null);
});

// handle counter
function decrement() {
  myCounter > 0 ? myCounter-- : delay();
  updateCounter();
}
// update counter in storage
function updateCounter() {
  chrome.storage.local.set({
    myCounter: myCounter,
  });
}
// restart the counter
function play() {
  clearTimeout(timeout);
  myCounter = limit;
  updateCounter();
  if (myState) loop = setInterval(decrement, 1000);
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
    if (!myCounter) {
      clearTimeout(timeout);
      myCounter = limit;
      updateCounter();
    }
  } else {
    updateCounter();
    loop = setInterval(decrement, 1000);
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
