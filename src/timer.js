import { speakThis } from "./recognition.js";

let modeTxt = document.querySelector(".speaking_ span");
let intervalId;
function stopWatch() {
  //if interval id exist clear it
  intervalId && clearInterval(intervalId);
  let hour = 0;
  let min = 0;
  let sec = 0;
  intervalId = setInterval(() => {
    sec++;
    if (sec >= 60) {
      min++;
      sec = 0;
    }
    if (min >= 60) {
      hour++;
      min = 0;
    }
    modeTxt.textContent = `${pad(hour)}:${pad(min)}:${pad(sec)}`;
  }, 1000);
}

//* */ implement the timer with date.now method ## toto
function pad(time) {
  return time.toString().padStart(2, 0);
}

function setterTimer(sec = 0, min = 0, hour = 0) {
  //if interval id exist clear it

  intervalId && clearInterval(intervalId);
  // added +2 because the browser paints the timer after about 2 sec
  const timerSec = (sec + 2) * 1000;
  const timerMin = min * 60 * 1000;
  const timerHour = hour * 60 * 60 * 1000;

  let countDownDate = Date.now() + timerSec + timerMin + timerHour;
  intervalId = setInterval(() => {
    let now = new Date().getTime();
    let timeleft = countDownDate - now;

    let hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
    modeTxt.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    if (Math.floor(timeleft / 1000) < 1) {
      clearInterval(intervalId);
      speakThis("Beep Beep Timer is over");
    }
  }, 1000);
}
function clearTimer() {
  if (intervalId) {
    clearInterval(intervalId);
  } else {
    throw new Error("Must start a timer before");
  }
}
export { stopWatch, setterTimer, clearTimer };
