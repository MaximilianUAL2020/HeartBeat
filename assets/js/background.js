let timer, time;
let limit = 1200;

reset();

chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
  if (msg.req === "time") {
    sendRes({ time: time });
  }
});

function reset() {
  clearInterval(timer);
  time = limit;
  timer = setInterval(countDown, 1000);
}
function countDown() {
  time > 0 ? time-- : reset();
}

// 1. send request from popup and respond from background
// 2. set storage item from background and listen to changes in popup

// respond().then(sendResponse);
// return true;

// async
// function respond() {
//   return new Promise((res) => {
//     res({ time: 1200 });
//   });
// }
