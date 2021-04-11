let loop;
let timeout;
let limit = 1200;
let pause = 20000;
let myState = false;
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
  timeout = setTimeout(play, pause);
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
function setIcon(bool) {
  chrome.browserAction.setIcon({
    path: icons[bool ? "active" : "inactive"],
  });
}
