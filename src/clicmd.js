import { cliBody } from "./cli.js";
// import { commands } from "./commands.js";
import { commandInfo, cliError } from "./commands.js";

// the response is set here
export const appendCommand = function (cmd) {
  let arg, multi;
  let resTxt = document.createElement("span");
  resTxt.classList.add("cli-res");
  if (cmd.split(" ").length !== 1) {
    [cmd, arg, ...multi] = cmd.split(" ");
  }

  //finds the command from object
  let el = commandInfo.find(function (el) {
    // console.log(cmd);
    return cmd.trim() === el.name;
  });

  try {
    // if the command is clear, then empty the clibody
    if (cmd.trim() === "clear") {
      cliBody.innerHTML = "";
      return;
    }
    // set the response to that of return value of the command function
    resTxt.innerHTML = el.func(arg, multi);
    // typeof el.func === "function" ? el.func(arg, multi) : el.func[cmd];
    //append it to th body and go back to cli.js file where the locaition is set again
    cliBody.append(resTxt);
  } catch (err) {
    // if there is no command registered in the object the throw this error
    if (!el) {
      let errTxt = "No such command exists ~ type help to list out commands";
      cliError(errTxt, resTxt);
      return;
    }
    // just in case if the error is not caused by something we anticipated
    let errTxt = "Inavlid Command ~  type help to list out commands";
    cliError(err ? err : errTxt, resTxt);
  }
};
