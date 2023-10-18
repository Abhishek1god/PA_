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

  //appends the response or return value to the cli (command line)
  appendCommand(cmd);
});

function cliNewArea() {
  // create a new cli location
  let locationTxt = document.createElement("span");
  //new command div in which we type,  whose value is set by text area
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
}
function cliResponse(res) {
  let resTxt = document.createElement("span");
  resTxt.classList.add("cli-res");

  resTxt.innerHTML = res;
  cliBody.append(resTxt);
}
function cliError(err, resTxt) {
  // the resTxt is actually the span that is resposne where we set err class to make it error
  // in any case if there is no resTxt then set it to the last child of clibody
  if (!resTxt) {
    // create the response span and then set it to resTxt
    cliResponse();
    resTxt = cliBody.lastElementChild;
  }
  // adding the error class
  resTxt.classList.add("err");

  resTxt.textContent = `Error: ${err.message || err}`;
  cliBody.append(resTxt);
  cliNewArea();
}
function clearCli() {
  cliBody.innerHTML = "";
}

export { cliBody, cliNewArea, cliError, cliResponse, clearCli };
