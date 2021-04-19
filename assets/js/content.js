let counter, active, limit, step;

let parent = document.createElement("div");
let child = document.createElement("img");
parent.id = "heart-wrapper";
child.id = "heart";

// get values from storage
chrome.storage.local.get(["myCounter", "myState", "myLimit"], (result) => {
  counter = result.myState ? result.myCounter : result.myLimit;
  active = result.myState;
  limit = result.myLimit;
  step = limit / 5;
  checkStep();
  mountBar();
});
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
    checkStep();
  }
});
// decrease healthbar
function checkStep() {
  if (counter % step) return;
  let index = counter / step;
  let url = chrome.runtime.getURL(`icons/heart_${index}.png`);
  child.src = url;
}
// mount health bar
function mountBar() {
  parent.appendChild(child);
  document.body.appendChild(parent);
}
