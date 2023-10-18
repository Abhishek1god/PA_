import { cliNewArea, cliError, cliResponse, clearCli } from "./cli.js";
// import { commands } from "./commands.js";
import { commandInfo } from "./commands.js";

// the response is set here
export const appendCommand = function (cmd) {
  let arg, multi;
  // let resTxt = document.createElement("span");
  // resTxt.classList.add("cli-res");
  if (cmd.split(" ").length !== 1) {
    [cmd, arg, ...multi] = cmd.split(" ");
  }

  //finds the command from object
  let el = commandInfo.find(function (el) {
    return cmd.trim() === el.name;
  });

  try {
    // if the command is clear, then empty the clibody
    if (cmd.trim() === "clear") {
      clearCli();
      cliNewArea();
      return;
    }
    // set the response to that of return value of the command function
    cliResponse(el.func(arg, multi));
  } catch (err) {
    // if there is no command registered in the object the throw this error
    if (!el) {
      let errTxt = "No such command exists ~ type help to list out commands";

      cliError(errTxt);
      return;
    }
    // just in case if the error is not caused by something we anticipated
    let errTxt = "Inavlid Command ~  type help to list out commands";
    cliError(err ? err : errTxt);
    return;
  }
  cliNewArea();
};
