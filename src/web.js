import { speakThis } from "./recognition.js";

export const command = function (cmd) {
  let [, site] = cmd.split(" ");
  speakThis(`Opening ${site}`);
  open(`https://${site}`);
};

export const localStorageSet = function (key, value) {
  localStorage.setItem(key, value);
};
export const localStorageGet = function (key) {
  return localStorage.getItem(key);
};
