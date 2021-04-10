<template>
  <div class="main-wrapper">
    <!-- timer -->
    <div
      :class="{ disabled: !remaining || !active }"
      class="center border"
      id="timer-wrapper"
    >
      <span id="timer">
        {{ min + " : " + sec }}
      </span>
    </div>
    <!-- buttons -->
    <div class="row">
      <button :disabled="!remaining">Reset</button>
      <button :disabled="!remaining">Settings</button>
    </div>
    <!-- toggle -->
    <div class="switch">
      <input
        id="my-switch"
        type="checkbox"
        class="switch-checkbox"
        @click="togglePlaying"
        v-model="active"
      />
      <label class="switch-label" for="my-switch"></label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loop: 0,
      active: false,
      remaining: 1200,
    };
  },
  methods: {
    getTime(bool) {
      chrome.runtime.sendMessage({ req: bool ? "update" : "get" }, (res) => {
        this.remaining = res.remaining;
      });
    },
    setLoop() {
      this.getTime(false);
      this.loop = setInterval(() => {
        this.getTime(true);
      }, 1000);
    },
    togglePlaying() {
      this.active ? clearInterval(this.loop) : this.setLoop();
      this.active = !this.active;
      this.setState(this.active);
    },
    setState(bool) {
      chrome.storage.sync.set(
        {
          toggleTimerActive: bool,
        },
        () => {
          console.log("Toggle State Updated!");
        }
      );
    },
    getState() {
      chrome.storage.sync.get(["toggleTimerActive"], (result) => {
        this.active = result.toggleTimerActive;
        this.getTime(false);
      });
    },
  },
  computed: {
    min() {
      let min = Math.floor(this.remaining / 60);
      return min < 10 ? "0" + min : min;
    },
    sec() {
      let sec = this.remaining % 60;
      return sec < 10 ? "0" + sec : sec;
    },
  },
  created() {
    this.getState();
    if (this.active) this.setLoop();
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
