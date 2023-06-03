let RANDOM_MAGIC_NUM= Number(Math.random().toFixed(2))
let staySilent=false;
let SpeechRecognition= window.SpeechRecognition || webkitSpeechRecognition;
let recognition= new SpeechRecognition();
let latitude,longitude;

let shouldListen= true;
let synth= speechSynthesis;
let utter= new SpeechSynthesisUtterance();


let tempNow= document.querySelector(".temp_now");
let tempFut= document.querySelector(".weather-future");
let commandTxt= document.querySelector(".query_content");
let modeTxt= document.querySelector(".speaking_ span");


recognition.lang = "en-US";
console.log(synth.pending)

recognition.addEventListener("result",function(res){
    console.log(res.results[0][0].transcript);

    commands(res.results[0][0].transcript)
})
recognition.addEventListener("end",()=> { 
    if(shouldListen) recognition.start();

});

synth.onvoiceschanged= function(e){
    let voices = this.getVoices();
    console.log(voices)
    utter.voice= voices[1];
    console.log(utter.voice)
    recognition.start()
}
function speakThis(msg= "Please enter something"){
    // setTimeout(function(){
        
    utter.text= msg;
    commandTxt.textContent= msg;

    synth.speak(utter);
    // },RANDOM_MAGIC_NUM)
}

window.addEventListener("load",speakThis.bind(null,"Welcome Human"));
utter.onstart = () => {
    if(shouldListen) shouldListen=!shouldListen;
    recognition.abort();
};
utter.onend = () => {
    recognition.start();    
    if(!shouldListen) shouldListen= !shouldListen

};
function commands(cmd){
    let date= new Date();
    console.log("commanded")
    
if(/silent|stay silent/i.test(cmd)){ 
    speakThis("Silent Mode")
    modeTxt.textContent= "Silent Mode";
    staySilent = true;
}
if(/speak|speak up/.test(cmd)){
    staySilent=false;
    speakThis("Work Mode")
    modeTxt.textContent= "Work Mode";
    return;
}
if(staySilent) return;
 
    if(/\bHi\b|hello|greeting/i.test(cmd)){
        if(/greeting/i.test(cmd)) speakThis("Greetings Human");
        else speakThis("Hello, Howdy");
     }
     else if(/today.*date|what is the date|what's the date/.test(cmd)){ speakThis(date.toString().slice(0,15))}
     else if(/howdy|\bhow are you\b|\bwhat's up\b/i.test(cmd)) speakThis("I am fine and you");
    else if(/I am fine|I am doing great/i.test(cmd)) speakThis("That's great to hear");
    else if(/your name|your identity/i.test(cmd)) speakThis("Everyone calls me jarvis but you can call me anytime");
    else if(/what's the temperature|temperature today|today temperature/i.test(cmd)){ 
        speakThis(tempNow.textContent);
    }
    else if(/what will be the temperature tommorow|temperature tommorow/i.test(cmd)){
        console.log("working")
        speakThis(tempFut.querySelectorAll("span")[1].textContent)
    }
    else if(/open.*facebook/i.test(cmd)){
        speakThis("Opening Facebook")
       open("https://www.facebook.com");
    }
    else if(/open.*youtube|search youtube/i.test(cmd)){
        speakThis("Opening youtube")
            if(/\bopen youtube( and)? search\b/i.test(cmd)){
                let searchItem = cmd.includes("for")? cmd.split("for")[1] : cmd.split("search")[1];
                console.log("this is search command", searchItem)
              open(`https://www.youtube.com/results?search_query=${searchItem}`)
            } 
            else open("https://www.youtube.com");
    }
        else if( /open.*google/i.test(cmd)){
            speakThis("Opening google")
            if(/\bopen google( and)? search\b/i.test(cmd)){
                let searchItem = cmd.includes("for")? cmd.split("for")[1] : cmd.split("search")[1];
                console.log("this is search command", searchItem)
                open(`https://www.google.com/search?q=${searchItem}`)
            } 
            else  open("https://www.google.com");
    }
    else if( /open.*setting/i.test(cmd)) open("ms-settings:");
    else if( /open.*bluetooth/i.test(cmd)) open("ms-settings-bluetooth:");
   else if((/mr jarvis|Mister jarvis|jarvis|search/i.test(cmd))) {
  let searchItem =  cmd.split("search for")?.[1] || cmd.split("search")?.[1];
  speakThis(`searching for ${searchItem} on perplexity`);
    open(`https://www.perplexity.ai/search?q=${searchItem}`,"_blank", "incognito=yes")
    
}
else {
    speakThis("I am not sure i understand");
}
}
    

function weatherData(){

    // fetch("https://api.open-meteo.com/v1/forecast?latitude=27.6791296&longitude=85.3409792&daily=temperature_2m_max&timezone=auto")
    // .then(res=> res.json())
    // .then(res=> console.log(res))

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`)
    .then(res=> res.json())
    .then(data => parseDateWeather(data))
    .catch(e=> {
        console.log(e);
        speakThis("Unable to get weather data")
    })
}
function dailyWeather(){
    let fetchArr= [
        fetch("https://api.open-meteo.com/v1/forecast?latitude=27.6791296&longitude=85.3409792&daily=temperature_2m_max&timezone=auto"),
        fetch("https://api.open-meteo.com/v1/forecast?latitude=27.6791296&longitude=85.3409792&daily=temperature_2m_min&timezone=auto")
    ]
    Promise.all(fetchArr)
    .then(arr=>Promise.all(arr.map(arr=> arr.json())))
    .then(res=> manageDailyData(res))
}
dailyWeather()
function geoData(){
    navigator.geolocation.getCurrentPosition(showPosition)
}

function showPosition(position) {
    // console.log(position.coords.latitude , "this is")
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    weatherData();
    // showPosition(latitude,longitude)
  }
function getDate(){

}
 function parseDateWeather(data){
    let date= new Date();
    let month= (date.getMonth()+1).toString().padStart(2,0);
    let hour=date.getHours().toString().padStart(2,0);
    let MonthDate= date.getDate().toString().padStart(2,0);
    let tempTime= data.hourly.time;
    let temperature= data.hourly.temperature_2m;
    
  let index= tempTime.findIndex(function(time){
    let tempMonth= time.split("-")[1];
    let tempDate= time.split("-")[2].slice(0,2);
    let tempHour= time.split("-")[2].slice(-5).slice(0,2);
 if(tempMonth==month && tempDate==MonthDate && tempHour==hour){
    return true;
 }})
tempNow.textContent= temperature[index]+ "°C";
    return temperature[index];
}
function manageDailyData(obj){
    let maxArr=obj[0].daily.temperature_2m_max;
    let minArr= obj[1].daily.temperature_2m_min;

    tempFut.innerHTML= maxArr.map(function(el,i){
        if(i>3) return;
        return `
        <span>${Math.floor(minArr[i])}-${Math.floor(el)}°C</span>
        `
    }).join("");

    console.log("max:", obj[0].daily.temperature_2m_max);

    console.log("min:", obj[1].daily.temperature_2m_min);
}


  geoData()