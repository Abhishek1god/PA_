import { command } from "./web.js";
import { localStorageGet, localStorageSet } from "./web.js";
import { stopWatch, setterTimer, clearTimer } from "./timer.js";

let staySilent = false;
let SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
let recognition = new SpeechRecognition();
// let latitude, longitude;

let shouldListen = true;
let synth = speechSynthesis;
let utter = new SpeechSynthesisUtterance();
let name = localStorage.getItem("name") || null;
let tempNow = document.querySelector(".temp_now");
let tempFut = document.querySelector(".weather-future");
let commandTxt = document.querySelector(".query_content");
let speaking = document.querySelector(".speaking_");
let modeTxt = document.querySelector(".speaking_ span");

recognition.lang = "en-US";
// console.log(synth.pending);

recognition.addEventListener("result", function (res) {
  console.log(
    `%c${res.results[0][0].transcript}`,
    "color:purple; font-family: fantasy; font-size: 20px;"
  );

  commands(res.results[0][0].transcript);
});
recognition.addEventListener("end", () => {
  if (shouldListen) recognition.start();
});

synth.onvoiceschanged = function (e) {
  let voices = this.getVoices();
  utter.voice = voices[1];

  if (shouldListen) recognition.start();
};
function speakThis(msg = "Please enter something", multi_msg = null) {
  let txt = `${msg} ${Array.isArray(multi_msg) ? multi_msg.join(" ") : ""}`; //if there are multiple argument that comes from cli then join them
  utter.text = txt;
  commandTxt.textContent = txt;

  synth.speak(utter);
}

window.addEventListener(
  "load",
  speakThis.bind(null, `Welcome ${name ? name : "Human"}`)
);
utter.onstart = () => {
  speaking.classList.add("speak");
  if (shouldListen) shouldListen = !shouldListen;
  recognition.abort();
};
utter.onend = () => {
  speaking.classList.remove("speak");
  recognition.start();
  if (!shouldListen) shouldListen = !shouldListen;
};
function commands(cmd) {
  let date = new Date();
  // console.log("commanded");

  if (/^silent mode$|\bstay silent\b/i.test(cmd)) {
    speakThis("Silent Mode");
    modeTxt.textContent = "Silent Mode";
    staySilent = true;
  }
  if (/speak|speak up|active mode|work mode/.test(cmd)) {
    staySilent = false;
    speakThis("Work Mode");
    modeTxt.textContent = "Active Mode";
    return;
  }
  if (staySilent) return;

  if (/\bHi\b|hello|greeting/i.test(cmd)) {
    if (/greeting/i.test(cmd)) speakThis("Greetings Human");
    else speakThis("Hello, Howdy");
  } else if (/today.*date|what is the date|what's the date/.test(cmd)) {
    speakThis(date.toString().slice(0, 15));
  } else if (/howdy|\bhow are you\b|\bwhat's up\b/i.test(cmd))
    speakThis("I am fine and you");
  else if (/I am fine|I am doing (great|fine)/i.test(cmd))
    speakThis("That's great to hear");
  else if (
    /what is my name|What's my name|tell my name|do you know me|do you know my name/i.test(
      cmd
    )
  ) {
    if (!localStorage.getItem("name"))
      speakThis("I don't know your name but I would love to know");
    else {
      name = localStorageGet("name");
      speakThis(`your name is ${name}`);
    }
  } else if (/my name is|the name is|call me/i.test(cmd)) {
    let searchItem = cmd.split(/\bis\b/i)[1] || cmd.split("me")[1];

    searchItem = searchItem.trim();
    name = searchItem;
    localStorageSet("name", name);
    speakThis(`Ok i will call you ${name}`);
  } else if (/your name|your identity/i.test(cmd))
    speakThis("Everyone calls me friday but you can call me anytime");
  else if (
    /what's the temperature|what is the temperature( today)?|today temperature|todya's temperature/i.test(
      cmd
    )
  ) {
    speakThis(tempNow.textContent);
  } else if (/temperature tomorrow/i.test(cmd)) {
    speakThis(tempFut.querySelectorAll("span")[1].textContent);
  } else if (/start\s?a? timer/i.test(cmd)) {
    stopWatch();
  } else if (/set\s?a? timer for/i.test(cmd)) {
    let [time, type] = cmd.split("for ")[1].split(" ");
    let s, h, m;

    if (type.includes("second")) {
      s = Number(time);
    }
    if (type.includes("minute")) {
      m = Number(time);
    }
    if (type.includes("hour")) {
      h = Number(time);
    }

    setterTimer(s, m, h);
  } else if (/stop the timer/i.test(cmd)) {
    clearTimer();
  } else if (/What is the (time|current time)/i.test(cmd)) {
    speakThis("It's " + new Date().getHours());
  } else if (/open.*facebook/i.test(cmd)) {
    speakThis("Opening Facebook");
    open("https://www.facebook.com");
  } else if (/open.*youtube|search youtube/i.test(cmd)) {
    speakThis("Opening youtube");
    if (/\bopen youtube( and)? search\b/i.test(cmd)) {
      let searchItem = cmd.includes("for")
        ? cmd.split("for")[1]
        : cmd.split("search")[1];

      open(`https://www.youtube.com/results?search_query=${searchItem}`);
      return;
    }
    if (/open youtube( and)? play/i.test(cmd)) {
      let searchItem = cmd.split("play")[1];

      open(`https://www.youtube.com/results?search_query=${searchItem} |`);
      return;
    } else open("https://www.youtube.com");
  } else if (/open.*google/i.test(cmd)) {
    speakThis("Opening google");
    if (/\bopen google( and)? search\b/i.test(cmd)) {
      let searchItem = cmd.includes("for")
        ? cmd.split("for")[1]
        : cmd.split("search")[1];
      // console.log("this is search command", searchItem);
      open(`https://www.google.com/search?q=${searchItem}`);
    } else open("https://www.google.com");
  } else if (/open.*setting/i.test(cmd)) open("ms-settings:");
  else if (/open.*bluetooth/i.test(cmd)) open("ms-settings-bluetooth:");
  else if (/shutdown|close yourself/i.test(cmd)) {
    speakThis("Shutting down");
    setTimeout(function () {
      close(location.href);
    }, 2000);
  } else if (/search/i.test(cmd)) {
    let searchItem = cmd.split("search for")?.[1] || cmd.split("search")?.[1];
    speakThis(`searching for ${searchItem} on perplexity`);
    open(
      `https://www.perplexity.ai/search?q=${searchItem}`,
      "_blank",
      "incognito=yes"
    );
  } else if (/mr friday|Mister friday|friday/i.test(cmd)) {
    cmd = cmd.toLowerCase();
    if (cmd === "friday" || cmd === "Mister friday" || cmd === "mr friday") {
      speakThis("Yes sir");
      return;
    }
    let searchItem = cmd.split("friday")[1];
    speakThis(`searching for ${searchItem} on perplexity`);
    open(
      `https://www.perplexity.ai/search?q=${searchItem}`,
      "_blank",
      "incognito=yes"
    );
  } else if (/open .*.{2,}.com$/.test(cmd)) {
    command(cmd);
  } else {
    speakThis("I am not sure i understand");
  }
}

function modeChange(arg) {
  if (arg == undefined || arg == null) return staySilent;
  staySilent = arg;
  modeTxt.textContent = `${staySilent ? "Silent Mode" : "Active Mode"}`;
}

export { speakThis, modeChange };
