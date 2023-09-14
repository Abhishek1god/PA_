const wrapperDiv = document.querySelector(".wrapper");
const speakingDiv = document.querySelector(".speaking_");
const talkingSection = document.querySelector(".section_2");
const pipIsOnDiv = document.querySelector(".pip-on-div");

speakingDiv.addEventListener("click", pipModeInitiate);

async function pipModeInitiate() {
  if (documentPictureInPicture.window) return;
  pipIsOnDiv.classList.add("pip-active");
  const pipWindow = await documentPictureInPicture.requestWindow();

  const link = document.createElement("link");
  let [styleSheet] = document.styleSheets;
  link.rel = "stylesheet";
  link.href = styleSheet.href;
  pipWindow.document.head.append(link);

  pipWindow.document.body.append(wrapperDiv);
  pipWindow.addEventListener("pagehide", function (e) {
    talkingSection.append(e.target.querySelector(".wrapper"));
    pipIsOnDiv.classList.remove("pip-active");
  });
}

export { pipModeInitiate };
