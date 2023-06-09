import { cliBody } from "./cli.js";
// import { commands } from "./commands.js";
import { commandInfo, cliError } from "./commands.js";

export const appendCommand = function (cmd) {
  let arg, multi;
  let resTxt = document.createElement("span");
  resTxt.classList.add("cli-res");
  if (cmd.split(" ").length !== 1) {
    [cmd, arg, ...multi] = cmd.split(" ");
    console.log(multi, "multi");
  }
  let el = commandInfo.find(function (el) {
    console.log(cmd);
    return cmd.trim() === el.name;
  });

  console.log(el);
  try {
    if (cmd.trim() === "clear") {
      cliBody.innerHTML = "";
      return;
    }
    resTxt.innerHTML =
      typeof el.func === "function" ? el.func(arg, multi) : el.func[cmd];
    console.log(cliBody, "this is cli body");
    console.log(resTxt, "this is cli res");

    cliBody.append(resTxt);
  } catch (err) {
    if (!el) {
      let errTxt = "No such command exists ~ type help to list out commands";
      cliError(errTxt, resTxt);
      return;
    }
    let errTxt = "Inavlid Command ~  type help to list out commands";
    cliError(err ? err : errTxt, resTxt);
  }
};
