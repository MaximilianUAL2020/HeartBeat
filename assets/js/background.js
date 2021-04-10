chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    {
      toggleTimerActive: false,
    },
    () => {
      console.log("Installed!");
    }
  );
});

let timeout, time;
let limit = 1200;
let pause = 5000;

setTimer();

chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
  if (msg.req === "update") {
    countDown();
  }
  sendRes({ remaining: time });
});

function setTimer() {
  time = limit;
  clearTimeout(pause);
}
function reset() {
  timeout = setTimeout(setTimer, 5000);
}
function countDown() {
  time > 0 ? time-- : reset();
}
