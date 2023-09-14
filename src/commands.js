import { localStorageGet, localStorageSet } from "./web.js";
import { cliBody } from "./cli.js";
import { speakThis, modeChange } from "./recognition.js";
import { pipModeInitiate } from "./pip.js";
import { setterTimer, stopWatch, clearTimer } from "./timer.js";
import { About } from "./about.js";
// import staySilent from "./recognition.js";

function getCommand(val) {
  if (localStorageGet(val) !== null) return localStorageGet(val);
  else {
    throw new Error(this.err);
  }
}

function setCommand(key, val = null) {
  localStorageSet(key, val.join(" "));
}

function setTimer(key, val) {
  if (!val) throw new Error("Enter a timer mode ");
  let obj = [...val];
  if (key === "set") {
    //checks if there are enough arguments
    if (obj.length % 2 === 1) throw new Error(`Not enough arguments`);
    let getTimes = obj.reduce((acc, cur, i) => {
      // set's the first element in array as key and second as value in object
      if (i % 2 == 0) {
        let val = obj[i + 1];
        if (val.trim() === "") throw new Error(`Time can't be empty`);
        // checks if the given flags are h , m or s (hour ,min, and sec)
        let objKey = cur.split("")[1];
        if (!["m", "s", "h"].includes(objKey))
          throw new Error(`Enter valid argument`);

        //checks if the given number is a valid number
        if (isNaN(Number(val))) throw new Error(`Time must be in Numbers`);
        acc[objKey] = Number(val);
      }

      return acc;
    }, {});
    setterTimer(getTimes.s, getTimes.m, getTimes.h);
  } else if (key === "start") {
    stopWatch();
  } else if (key === "clear") {
    clearTimer();
  } else {
    throw new Error(`"${key}" is not a valid timer mode`);
  }
}

function webOpen(site) {
  if (/https:\//.test(site)) open(`${site}`);
  else open(`https://${site}`);
}
function helper() {
  let val = commandInfo
    .map(function (el) {
      if (el.name === "") return;
      return `${el.name}: ${el.desc} `;
    })
    .join("\r\n");
  console.log(typeof val);
  return val;
}
function echo(val, mult_val = null) {
  if (!val) throw new Error("Enter text to print");
  return `${val} ${mult_val.join(" ")}`;
}
function modeTog(val) {
  if (!val) {
    console.log(modeChange());
    return `${modeChange() ? "Silent Mode" : "Active Mode"}`;
  }
  val = val.trim();
  if (!["silent", "active"].includes(val))
    throw new Error("No such mode exists");
  if (val === "silent") {
    modeChange(true);
  } else if (val === "active") {
    modeChange(false);
  }
  return `mode change to ${val}`;
}
function cleared() {
  return "cleared";
}

export const commandInfo = [
  {
    name: "get",
    func: getCommand,
    desc: "Get the item stored in local storage ~ get name",
    err: `No such item exists !!!!`,
  },
  {
    name: "set",
    func: setCommand,
    desc: "Set new item to local storage ~ set address NYC",
  },
  {
    name: "open",
    func: webOpen,
    desc: "Open new website ~ open youtube.com",
  },
  {
    name: "speak",
    func: speakThis,
    desc: "Reads out the text passed ~ speak 'text'",
  },
  {
    name: "echo",
    func: echo,
    desc: "Prints the text passed ~ echo 'text'",
    err: "Enter a argument",
  },
  {
    name: "mode",
    func: modeTog,
    desc: "Set's the speech mode to active or silent ~ mode silent",
  },
  {
    name: "clear",
    func: cleared,
    desc: "Clear's the terminal",
  },
  {
    name: "pip",
    func: pipModeInitiate,
    desc: "Opens PIP(picture in picture) mode",
  },

  {
    name: "timer",
    func: setTimer,
    desc: "Takes two timer mode 'set|start'. 'start' mode start a stopwatch. 'set' takes 3 options '-s'(Seconds), '-m'(Minutes),  and '-h'(Hour). ~ timer set -m 3",
  },
  {
    name: "about",
    func: About,
    desc: "About the app",
  },
  {
    name: "help",
    func: helper,
    desc: "Prints out the list of commmand with their desc",
  },

  {
    name: "",
    func: function () {
      return "";
    },
  },
];

export const cliError = function (err, resTxt) {
  // the resTxt is actually the span that is resposne where we set err class to make it error
  // in any case if there is no resTxt then set it to the last child of clibody
  if (!resTxt) {
    console.log(err);
    resTxt = cliBody.lastElementChild;
  }
  // adding the error class
  resTxt.classList.add("err");

  resTxt.textContent = `Error: ${err.message || err}`;
  cliBody.append(resTxt);
};
