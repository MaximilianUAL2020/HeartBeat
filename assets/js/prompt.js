const limit = 5;
const pause = 60000;
const step = pause / limit;

let counter = 0;
let image = document.getElementById("heart");

setInterval(() => {
  counter < limit ? counter++ : window.close();
  let url = chrome.runtime.getURL(`icons/heart_${counter}.png`);
  image.src = url;
}, step);
