import { appendCommand } from "./clicmd.js";
let LOCATION_TXT = "$ abhi_7 ~/abhi1god";

let cliBody = document.querySelector(".cli-body");
let lastChild = cliBody.lastElementChild;
let cliContain = document.querySelector(".cli-container");
let cliCommand = document.querySelector(".cli-commands");
let txtArea = document.querySelector("textarea");
cliContain.addEventListener("click", function () {
  console.log("clicked");
  txtArea.focus();
});
txtArea.addEventListener("input", function () {
  cliCommand.textContent = txtArea.value;
});
cliContain.addEventListener("keypress", function (e) {
  if (e.keyCode != 13) return;
  let cmd = txtArea.value;
  appendCommand(cmd);

  let locationTxt = document.createElement("span");
  let cliDiv = document.createElement("div");
  cliDiv.classList.add("cli-commands");
  locationTxt.classList.add("location-txt");
  locationTxt.textContent = LOCATION_TXT;
  cliCommand.classList.remove("blinker");
  cliBody.append(locationTxt, cliDiv);
  cliCommand = cliBody.lastElementChild;
  cliCommand.classList.add("blinker");
  txtArea.value = "";
});
export const errFuncLoc = function () {
  let locationTxt = document.createElement("span");
  let cliDiv = document.createElement("div");
  cliDiv.classList.add("cli-commands");
  locationTxt.classList.add("location-txt");
  locationTxt.textContent = LOCATION_TXT;
  cliCommand.classList.remove("blinker");
  cliBody.append(locationTxt, cliDiv);
  cliCommand = cliBody.lastElementChild;
  cliCommand.classList.add("blinker");
  txtArea.value = "";
};
export { cliBody };
