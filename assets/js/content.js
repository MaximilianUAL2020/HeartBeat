let counter, active, limit, step, index;

let parent = document.createElement("div");
let child = document.createElement("img");
parent.id = "heart-wrapper";
child.id = "heart";

// get values from storage
chrome.storage.local.get(
  ["myCounter", "myState", "myLimit", "myIndex"],
  (result) => {
    counter = result.myCounter;
    active = result.myState;
    limit = result.myLimit;
    index = result.myIndex;
    step = limit / 5;
    setImage();
    mountBar();
  }
);
// listen to counter changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace == "local") {
    if (changes.myCounter) {
      counter = changes.myCounter.newValue;
    }
    if (changes.myLimit) {
      limit = changes.myLimit.newValue;
      step = limit / 5;
    }
    if (changes.myState) {
      active = changes.myState.newValue;
      document.getElementById("heart-wrapper").classList.toggle("hide");
    }
    checkStep();
  }
});
// set health
function checkStep() {
  if (counter % step) return;
  index = counter / step;
  chrome.storage.local.set({ myIndex: index }, () => {
    setImage();
  });
}
// set image url
function setImage() {
  let url = chrome.runtime.getURL(`icons/heart_${index}.png`);
  child.src = url;
}
// mount health bar
function mountBar() {
  parent.appendChild(child);
  if (!active) parent.classList.add("hide");
  document.body.appendChild(parent);
}
