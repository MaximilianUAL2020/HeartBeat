chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    {
      myCounter: 10,
      myState: false,
    },
    () => {
      console.log("Installed!");
    }
  );
});

var myCounter = 0;
var myState = false;

// set values from storage
chrome.storage.sync.get(["myCounter", "myState"], (result) => {
  myCounter = result.myCounter;
  myState = result.myState;
  if (myState) play();
});

let loop;
let timeout;
let limit = 10;

// listen to state changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    if (changes.myState) {
      myState = changes.myState.newValue;
      handleState(myState);
    }
  }
});

function decrement() {
  myCounter > 0 ? myCounter-- : pause();
  updateCounter();
}
function updateCounter() {
  chrome.storage.sync.set({
    myCounter: myCounter,
  });
}
function play() {
  clearTimeout(timeout);
  myCounter = limit;
  updateCounter();
  loop = setInterval(decrement, 1000);
}
function pause() {
  clearInterval(loop);
  timeout = setTimeout(play, 3000);
}

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
// 2. Toggle (Pause/Play) the extension on and off
// 3. Reset the myCounter of the extension
// 4. Create a 20 second timeout before resuming the countdown
