import { appendCommand } from "./clicmd.js";
let LOCATION_TXT = "$ abhi_7 ~/abhi1god";

let cliBody = document.querySelector(".cli-body");
// let lastChild = cliBody.lastElementChild;
let cliContain = document.querySelector(".cli-container");
let cliCommand = document.querySelector(".cli-commands");
let txtArea = document.querySelector("textarea");

//  hidden textarea that is focused when you click on the cli div
cliContain.addEventListener("click", function () {
  txtArea.focus();
});

// the cli value is then set to the text content of the command div
txtArea.addEventListener("input", function () {
  cliCommand.textContent = txtArea.value;
});
cliContain.addEventListener("keypress", function (e) {
  if (e.keyCode != 13) return;
  let cmd = txtArea.value;

  //appends the response or return value to the cli
  appendCommand(cmd);

  // create a new cli location
  let locationTxt = document.createElement("span");

  //new command div in which we type whose value is set by text area
  let cliDiv = document.createElement("div");
  cliDiv.classList.add("cli-commands");
  locationTxt.classList.add("location-txt");
  locationTxt.textContent = LOCATION_TXT;
  // remove the blinker from the previous cli command
  cliCommand.classList.remove("blinker");

  // append both of them to cli
  cliBody.append(locationTxt, cliDiv);
  // set's the clicommand div value to the newly created div so the text area still write in that
  cliCommand = cliBody.lastElementChild;

  // add blinker to the newly created clicommand div
  cliCommand.classList.add("blinker");
  // set the text area to empty again
  txtArea.value = "";
});
export { cliBody };
// export const errFuncLoc = function () {
//   let locationTxt = document.createElement("span");
//   let cliDiv = document.createElement("div");
//   cliDiv.classList.add("cli-commands");
//   locationTxt.classList.add("location-txt");
//   locationTxt.textContent = LOCATION_TXT;
//   cliCommand.classList.remove("blinker");
//   cliBody.append(locationTxt, cliDiv);
//   cliCommand = cliBody.lastElementChild;
//   cliCommand.classList.add("blinker");
//   txtArea.value = "";
// };
