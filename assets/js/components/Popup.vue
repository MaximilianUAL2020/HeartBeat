<template>
  <div class="main-wrapper">
    <!-- timer -->
    <div
      id="timer-wrapper"
      class="center border"
      :class="{ disabled: !counter || !this.state }"
    >
      <span id="timer">{{ min + " : " + sec }}</span>
    </div>
    <!-- buttons -->
    <div class="row">
      <button :disabled="!counter" @click="reset">Reset</button>
      <button :disabled="!counter">Settings</button>
    </div>
    <!-- toggle -->
    <div class="switch">
      <input
        id="my-switch"
        type="checkbox"
        class="switch-checkbox"
        @click="toggle"
        v-model="state"
      />
      <label class="switch-label" for="my-switch"></label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counter: 0,
      state: false,
    };
  },
  methods: {
    toggle() {
      this.state = !this.state;
      chrome.storage.local.set({
        myState: this.state,
      });
    },
    reset() {
      chrome.runtime.sendMessage({ msg: "reset" }, (res) => {
        return;
      });
    },
  },
  computed: {
    min() {
      let min = Math.floor(this.counter / 60);
      return min < 10 ? "0" + min : min;
    },
    sec() {
      let sec = this.counter % 60;
      return sec < 10 ? "0" + sec : sec;
    },
  },
  created() {
    // set values from storage
    chrome.storage.local.get(["myCounter", "myState"], (result) => {
      this.counter = result.myCounter;
      this.state = result.myState;
    });
    // listen to counter changes
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "local") {
        if (changes.myCounter) {
          this.counter = changes.myCounter.newValue;
        }
      }
    });
  },
};
</script>

<style scoped>
.main-wrapper {
  gap: 1em;
  width: 100%;
  height: 100%;
  padding: 1em;
  display: grid;
  background-color: var(--dark-grey);
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto auto var(--master-height) var(
      --master-height
    );
  grid-template-areas:
    "timer timer timer timer"
    "timer timer timer timer"
    "timer timer timer timer"
    "timer timer timer timer"
    "buttons buttons buttons buttons"
    "toggle toggle toggle toggle";
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.row {
  gap: 1em;
  display: flex;
  flex-direction: row;
}
.border {
  background: transparent;
  color: var(--light-grey);
  border: 1px solid var(--light-grey);
}
.filled {
  border: none;
  color: var(--dark-grey);
  background: var(--light-grey);
}
.main-wrapper div {
  width: 100%;
  height: 100%;
  transition: all 0.2s;
}
.main-wrapper div:nth-of-type(1) {
  grid-area: timer;
  border-radius: 20px;
}
.main-wrapper div:nth-of-type(2) {
  grid-area: buttons;
  border-radius: 100px;
}
.main-wrapper div:nth-of-type(3) {
  grid-area: toggle;
  position: relative;
  border: none;
}
.no-border {
  border: none !important;
}
.disabled {
  color: var(--medium-grey);
  border: 1px solid var(--medium-grey);
  transition: all 0.2s;
}
#timer {
  height: auto;
  min-width: 3em;
  font-size: 3em;
  border: none !important;
  transition: all 0.2s;
}
button,
button:focus,
button:active {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: inherit;
  background-color: transparent;
  color: var(--dark-greygrey);
  background: var(--light-grey);
  border: 1px solid var(--dark-grey);
  transition: all 0.2s;
}
button:hover {
  cursor: pointer;
  background: transparent;
  color: var(--light-grey);
  border: 1px solid var(--light-grey);
  transition: all 0.2s;
}
button:disabled {
  cursor: not-allowed;
  background: transparent;
  color: var(--medium-grey);
  border: 1px solid var(--medium-grey);
}
.switch-checkbox {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}
.switch-label {
  padding: 0;
  display: block;
  cursor: pointer;
  overflow: hidden;
  height: var(--master-height);
  line-height: var(--master-height);
  border-radius: var(--master-height);
  border: 1px solid var(--light-grey);
  transition: all 0.2s;
}
.switch-label:before {
  bottom: 0;
  margin: 0px;
  content: "";
  display: block;
  position: absolute;
  border-radius: 100px;
  top: var(--myPadding);
  right: var(--button-end);
  width: var(--button-height);
  height: var(--button-height);
  background: var(--light-grey);
  transition: all 0.2s;
}
.switch-checkbox:checked + .switch-label {
  background: var(--light-grey);
}
.switch-checkbox:checked + .switch-label:before {
  right: var(--myPadding);
  background: var(--dark-grey);
}
</style>
