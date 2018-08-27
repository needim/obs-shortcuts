const gkm = require("gkm");

const keysToMatch = [
  "Left Control",
  "Left Shift",
  "Left Alt",
  "Left Meta",
  "Right Control",
  "Right Shift",
  "Right Alt"
];

function mousetrapTranslations(text) {
  return text
    .toLowerCase()
    .replace(" ", "")
    .replace("left", "")
    .replace("right", "")
    .replace("control", "ctrl");
}

function hasMatchingKeySequence(key) {
  return -1 !== keysToMatch.indexOf(key);
}

class KeyEvents {
  constructor() {
    this.sequence = [];
    this.callback = () => {};
  }

  startListening() {
    gkm.events.on("key.pressed", data => {
      if (-1 === this.sequence.indexOf(data[0])) {
        if (!hasMatchingKeySequence(data[0])) {
          this.sequence.push(data[0]);
          const message = this.sequence.join("+");
          this.addNewMessage("keydown^^^^" + mousetrapTranslations(message));
        } else {
          this.sequence.push(data[0]);
        }
      }
    });

    gkm.events.on("key.released", data => {
      const message = this.sequence.join("+");
      this.addNewMessage("keyup^^^^" + mousetrapTranslations(message));
      this.sequence = [];
    });
  }

  addNewMessage(message) {
    this.updateView(message);
  }

  updateView(message) {
    if (this.callback) {
      this.callback(message);
    }
  }

  setCallback(cb) {
    this.callback = cb;
  }

  stopListening() {
    gkm.events.removeAllListeners();
  }
}
const keyEvents = new KeyEvents();
module.exports = keyEvents;
