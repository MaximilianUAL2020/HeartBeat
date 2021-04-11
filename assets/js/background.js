let loop;
let timeout;
let limit = 1200;
let pause = 20000;
let myState = false;
let myCounter = limit;

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

// 1. Run interval in the background script
// 2. Option 1 -> Send message to popup when active
// 3. Option 2 -> updateCounter storage value and pull in from popup

// Functionality

// 1. Create a countdown that keeps running when the popup isn't active
// 2. Toggle (delay/Play) the extension on and off
// 3. Reset the myCounter of the extension
// 4. Create a 20 second timeout before resuming the countdown
