const circle = document.getElementById("circle");

const homescreenGlowContainer = document.getElementById("homescreenGlowContainer");
const homescreenContainer = document.getElementById("homescreenContainer");
const homescreenTitle = document.getElementById("homescreenTitle");
const homescreenInput = document.getElementById("homescreenInput");

const homescreenColorsWhiteButton = document.getElementById("homescreenColorsWhiteButton");
const homescreenBlackWhiteButton = document.getElementById("homescreenBlackWhiteButton");
const homescreenColorsBlackButton = document.getElementById("homescreenColorsBlackButton");
const homescreenWhiteBlackButton = document.getElementById("homescreenWhiteBlackButton");

const homescreenColorButtons = document.querySelectorAll(".homescreen-button-container button");

const homescreenSoundContainer = document.getElementById("homescreenSoundContainer");
const homescreenDragContainer = document.getElementById("homescreenDragContainer");
const homescreenFullscreenContainer = document.getElementById("homescreenFullscreenContainer");

const homescreenSoundCheckbox = document.getElementById("homescreenSoundCheckbox");
const homescreenDragCheckbox = document.getElementById("homescreenDragCheckbox");
const homescreenFullscreenCheckbox = document.getElementById("homescreenFullscreenCheckbox");
const homescreenSoundLabel = document.getElementById("homescreenSoundLabel");
const homescreenDragLabel = document.getElementById("homescreenDragLabel");
const homescreenFullscreenLabel = document.getElementById("homescreenFullscreenLabel");

const homescreenPointerImageContainer = document.getElementById("homescreenPointerImageContainer");

const popupContainer = document.getElementById("popupContainer");
const popupGlowContainer = document.getElementById("popupGlowContainer");
const popupAgainButton = document.getElementById("popupAgainButton");

const popupHitsText = document.getElementById("popupHitsText");
const popupMissesText = document.getElementById("popupMissesText");
const popupTotalText = document.getElementById("popupTotalText");
const popupAccuracyText = document.getElementById("popupAccuracyText");
const popupCpsText = document.getElementById("popupCpsText");

let popupAnimation;
let popupHeight = -230;

let seconds;
let circleColors = ["red", "orange", "yellow", "green", "blue", "purple", "brown", "aqua", "pink", "maroon", "navy", "teal", "olive", "beige", "darkgreen", "lightgreen", "indigo", "gold", "lightcoral", "lightsalmon", "cyan", "midnightblue", "lightblue"];
const preservedColors = circleColors;
const circleSizes = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250];
let circleLength;
const w = window.innerWidth/10;
const h = window.innerHeight/5;
const XPositions = [w/2, w, w*2, w*3, w*4, w*5, w*6, w*7, w*8, w*9];
const YPositions = [h/2, h, h*1.5, h*2, h*2.5, h*3, h*3.5, h*4, h*4.5];

let flag = true;

let sound = false;
let dragClicking = false;
let fullscreen = false;

let hits = 0;
let totalClicks = 0;

const beep = new Audio("assets/beep.mp3");

function selectInput(event) {
     event.target.select();
}

function handleButtonClick(buttonElement, titleColor, backgroundColor) {
     homescreenColorButtons.forEach(button => {
          button.classList.remove("selected-button", "deselected-button");
          if (button === buttonElement) {
               button.classList.add("selected-button");
          } else {
               button.classList.add("deselected-button");
          }
     });

     document.body.style.backgroundColor = backgroundColor;

     if(titleColor === "color") {
          circleColors = preservedColors;
          homescreenTitle.style.color = getRandom("color");
     } else if(titleColor === "black") {
          homescreenTitle.style.color = "black";
          circleColors = ["black"];
     } else if(titleColor === "white") {
          homescreenTitle.style.color = "darkgray";
          circleColors = ["white"];
     }
}

function handleCheckboxDown(checkboxContainerElement) {
     checkboxContainerElement.style.transform = "scale(0.95)";
}

function handleCheckboxUp(checkboxContainerElement) {
     checkboxContainerElement.style.transform = "scale(1)";
}

function begin(event) {
     if(event.key === "Enter") {
          seconds = homescreenInput.value;
          if(verifySeconds(seconds)) {
               configureOptions();
               main(seconds);
          }
     }
}

function setHomescreenVisibility(appearance) {
     homescreenContainer.style.display = appearance;
     homescreenGlowContainer.style.display = appearance;

     switch(appearance) {
          case "block":
               document.documentElement.style.cursor = "default";
               circle.style.display = "none";
               focusInput();
               window.addEventListener("keypress", begin);
               break;
          case "none":
               document.documentElement.style.cursor = "crosshair";
               circle.style.display = "block";
               window.removeEventListener("keypress", begin);
               break;
     }
}

function getRandom(type) {
     switch(type) {
          case "x":
               return XPositions[Math.floor(Math.random() * XPositions.length)];
          case "y":
               return YPositions[Math.floor(Math.random() * YPositions.length)];
          case "color":
               return circleColors[Math.floor(Math.random() * circleColors.length)];
          case "length":
               return circleSizes[Math.floor(Math.random() * circleSizes.length)];
     }
}

function verifySeconds(duration) {
     if(duration === "") {
          alert("Enter seconds.");
          return false;
     } else if(duration <= 0) {
          alert("Seconds must be at least 1.");
          return false;
     } else if(duration > 60) {
          alert("Seconds must be 60 or under.");
          return false;
     } else if(duration.toString().includes(".")) {
          alert("Seconds must be a whole number.");
          return false;
     } else {
          return true;
     }
}

function circleClicked() {
     if(flag) {
          if(sound) {
               beep.play();
          }

          hits++;
          scramble();
     }
}

function scramble() {
     if(flag) {
          circleLength = getRandom("length");
          circle.style.width = circleLength + "px";
          circle.style.height = circleLength + "px";
          circle.style.backgroundColor = getRandom("color");
          circle.style.top = getRandom("y") + "px";
          circle.style.left = getRandom("x") + "px";
     }
}

function endGame(seconds) {
     circle.removeEventListener("click", circleClicked);
     circle.removeEventListener("mousedown", circleClicked);

     flag = false;
     accuracy = ((hits/totalClicks).toFixed(2)).toString().replace(".", "").replace(/^0*/, "");
     if(accuracy === "NaN" || accuracy === "") {
          accuracy = 0;
     }

     popupHitsText.textContent = `Hits: ${hits}`;
     popupMissesText.textContent = `Misses: ${totalClicks - hits}`;
     popupTotalText.textContent = `Total: ${totalClicks}`;
     popupAccuracyText.textContent = `Accuracy: ${accuracy}%`;
     popupCpsText.textContent = `CPS: ${(hits/seconds).toFixed(2)}`;

     hits = 0;
     totalClicks = 0;

     circle.style.backgroundColor = "grey"
     document.documentElement.style.cursor = "default";

     popupAnimation = setInterval(function() {
          popupHeight += 1;
          popupContainer.style.top = popupHeight + "px";
          popupGlowContainer.style.top = popupHeight + "px";

          if(popupHeight === 250) {
               clearInterval(popupAnimation);
               popupHeight = -230;
          }
     }, 1);
}

function main(time) {
     if(fullscreen) {
          document.documentElement.requestFullscreen();
     }

     setHomescreenVisibility("none");
     scramble();

     if(dragClicking) {
          circle.addEventListener("click", circleClicked);
     } else {
          circle.addEventListener("mousedown", circleClicked);
     }

     document.onclick = function() {
          if(flag) {
               totalClicks++;
          }
     }

     setTimeout(function() {
          endGame(time)
     }, time * 1000);

     for (let i = time; i >= 0; i--) {
          setTimeout(() => {
               if (i === 0) {
                    document.title = "Click Trainer";
               } else {
                    document.title = "Click Trainer - " + i;
               }
          }, (time - i) * 1000);
     }
}

function focusInput() {
     homescreenInput.addEventListener("focus", selectInput);
     homescreenInput.focus();
     homescreenInput.removeEventListener("focus", selectInput);
}

function configureOptions() {
     sound = homescreenSoundCheckbox.checked;
     dragClicking = homescreenDragCheckbox.checked;
     fullscreen = homescreenFullscreenCheckbox.checked;
}

focusInput();

homescreenColorsWhiteButton.onclick = () => handleButtonClick(homescreenColorsWhiteButton, "color", "white");
homescreenBlackWhiteButton.onclick = () => handleButtonClick(homescreenBlackWhiteButton, "black", "white");
homescreenColorsBlackButton.onclick = () => handleButtonClick(homescreenColorsBlackButton, "color", "black");
homescreenWhiteBlackButton.onclick = () => handleButtonClick(homescreenWhiteBlackButton, "white", "black");

homescreenSoundLabel.onmousedown = () => handleCheckboxDown(homescreenSoundContainer);
homescreenDragLabel.onmousedown = () => handleCheckboxDown(homescreenDragContainer);
homescreenFullscreenLabel.onmousedown = () => handleCheckboxDown(homescreenFullscreenContainer);

homescreenSoundLabel.onmouseup = () => handleCheckboxUp(homescreenSoundContainer);
homescreenDragLabel.onmouseup = () => handleCheckboxUp(homescreenDragContainer);
homescreenFullscreenLabel.onmouseup = () => handleCheckboxUp(homescreenFullscreenContainer);

popupAgainButton.onclick = function() {
     setHomescreenVisibility("block");
     flag = true;
     clearInterval(popupAnimation);
     popupContainer.style.top = -230 + "px";
     popupGlowContainer.style.top = -230 + "px";
     popupHeight = -230;
     document.exitFullscreen();
}

window.addEventListener("keypress", begin);