let SpeechRecognition= window.SpeechRecognition || webkitSpeechRecognition;
let recognition= new SpeechRecognition();


let synth= speechSynthesis;
let utter= new SpeechSynthesisUtterance();

recognition.lang = "en-US";
function speaker(res){
    let {transcript}=res.results[0][0];
    document.body.textContent= transcript;
    speakThis("Hey handsome");
    // speakThis(transcript)
    // return transcript
}
function starter(){
    recognition.addEventListener("result",speaker);
    recognition.start();
}

function speakThis(txt= "Please enter something"){
    utter.text= txt
    synth.speak(utter);
}






starter()
