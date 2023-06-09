import { localStorageGet, localStorageSet } from "./web.js";
import { cliBody } from "./cli.js";
import { speakThis, modeChange } from "./recognition.js";
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

function webOpen(site) {
  if (/https:\//.test(site)) open(`${site}`);
  else open(`https://${site}`);
}
function helper() {
  return commandInfo
    .map(function (el) {
      if (el.name === "help") return;
      return `${el.name}: ${el.desc} `;
    })
    .join("\r\n");
}
function echo(val, mult_val = null) {
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
    console.log("silent triggered");
    modeChange(true);
  } else if (val === "active") {
    console.log("actiive triggered");
    modeChange(false);
  }
  return `mode change to ${val}`;
}
function cleared() {
  console.log(cliBody);
  console.log("cleared");
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
    name: "help",
    func: helper,
    desc: "Prints out the list of commmand with their desc",
  },
];

export const cliError = function (err, resTxt) {
  console.log(commandInfo);
  resTxt.classList.add("err");
  resTxt.textContent = `Error: ${err}`;
  cliBody.append(resTxt);
  console.error("Error hapen");
};
