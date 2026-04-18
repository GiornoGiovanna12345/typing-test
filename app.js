let startTime = null;
let timerStarted = false;
let selectedTime = 30;
let timeLeft = 30;
let countdownInterval = null;
let totalCharsTyped = 0;
let totalCorrectChars = 0;
let testActive = false;

const sentences = [
    "The quick brown fox jumps over the lazy dog",
    "Don't make a mountain out of a molehill, just take it one step at a time.",
    "Pack my box with five dozen liquor jugs.",
    "Practice makes perfect so keep on typing every day",
    "A journey of a thousand miles begins with a single step",
    "The best way to predict the future is to create it",
    "Success is not final failure is not fatal it is the courage to continue that counts",
    "In the middle of every difficulty lies opportunity",
    "Please take your dog, Cali, out for a walk, he really needs some exercise!",
    "What a beautiful day it is on the beach, here in beautiful and sunny Hawaii.",
    "Rex Quinfrey, a renowned scientist, created plans for an invisibility machine.",
    "Do you know why all those chemicals are so hazardous to the environment?",
    "You never did tell me how many copper pennies were in that jar; how come?",
    "Max Joykner sneakily drove his car around every corner looking for his dog.",
    "The two boys collected twigs outside, for over an hour, in the freezing cold!",
    "When do you think they will get back from their adventure in Cairo, Egypt?",
    "Trixie and Veronica, our two cats, just love to play with their pink ball of yarn.",
    "We climbed to the top of the mountain in just under two hours; isn't that great?",
    "Hector quizzed Mr. Vexife for two hours, but he was unable to get any information.",
    "I have three things to do today: wash my car, call my mother, and feed my dog.",
    "Xavier Puvre counted eighty large boxes and sixteen small boxes stacked outside.",
    "The Reckson family decided to go to an amusement park on Wednesday.",
    "That herd of bison seems to be moving quickly; does that seem normal to you?",
    "All the grandfather clocks in that store were set at exactly 3 O'Clock.",
    "There are so many places to go in Europe for a vacation--Paris, Rome, Prague, etc.",
    "Those diamonds and rubies will make a beautiful piece of jewelry.",
    "In order to keep up at that pace, Zack Squeve would have to work all night.",
    "The old library on the corner of Fifth Street had thousands of books inside.",
    "Every morning she would wake up early and go for a long run through the park.",
    "Benjamin quickly realized that fixing the broken bicycle would take all afternoon.",
    "The chef carefully arranged the vegetables on the plate before serving the guests.",
    "After years of practice, she finally mastered the art of playing the violin.",
    "The thunderstorm last night knocked down several large trees in the neighborhood.",
    "His collection of vintage stamps was worth far more than anyone had expected.",
    "The astronaut floated weightlessly through the space station, checking every panel.",
    "She packed her suitcase the night before so she wouldn't miss her early flight.",
    "The puppy chased its tail around the living room for nearly twenty minutes.",
    "Every single student in the class passed the final exam with flying colors.",
    "The waterfall cascaded down the rocky cliff into a crystal clear pool below.",
    "He spent three weeks building a treehouse for his children in the backyard.",
    "The market was full of fresh fruits, vegetables, and handmade crafts that morning.",
    "Nobody expected the quiet librarian to win the town's annual singing competition.",
    "The detective carefully examined every clue before drawing any conclusions.",
    "She learned to bake sourdough bread during the long winter months at home.",
    "The entire village gathered around the bonfire to celebrate the harvest season.",
    "His handwriting was so neat that people often mistook it for printed text.",
    "The scientist spent decades researching the migration patterns of Arctic birds.",
    "A gentle breeze rustled through the tall grass as the sun began to set.",
    "The mechanic diagnosed the problem within minutes and had the car running again.",
    "They planted a small garden in the spring and harvested vegetables all summer.",
    "The old wooden bridge creaked loudly every time someone walked across it.",
    "Nobody could explain why the lights in the old mansion flickered every midnight."
];

function getRandomSentence() {
    const index = Math.floor(Math.random() * sentences.length);
    return sentences[index];
}

const textDisplay = document.getElementById("text-display");
const inputBox = document.getElementById("input-box");
const results = document.getElementById("results");
const retryBtn = document.getElementById("retry-btn");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const blindBtn = document.getElementById("blind-toggle");
const countdown = document.getElementById("countdown");
const timeBtns = document.querySelectorAll(".time-btn");
const highScoreDisplay=document.getElementById("high-score");

let textToType = getRandomSentence();
textDisplay.textContent = textToType;

timeBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
        timeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedTime = parseInt(btn.dataset.time);
        timeLeft = selectedTime;
        resetTest();
    });
});

function resetTest() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    testActive = false;
    timerStarted = false;
    totalCharsTyped = 0;
    totalCorrectChars = 0;
    timeLeft = selectedTime;
    countdown.textContent = "";
    inputBox.value = "";
    inputBox.disabled = false;
    results.textContent = "";
    retryBtn.style.display = "none";
    textToType = getRandomSentence();
    textDisplay.textContent = textToType;
    inputBox.focus();
}

function endTest() {
    testActive = false;
    inputBox.disabled = true;

    // count partial sentence progress
    const partialText = inputBox.value;
    for (let i = 0; i < partialText.length; i++) {
        totalCharsTyped++;
        if (partialText[i] === textToType[i]) totalCorrectChars++;
    }

    const minutes = selectedTime / 60;
    const rawWPM = Math.round((totalCharsTyped / 5) / minutes);
    const accuracy = totalCharsTyped > 0 ? Math.round((totalCorrectChars / totalCharsTyped) * 100) : 0;
    const adjustedWPM = Math.round(rawWPM * (accuracy / 100));
    results.textContent = `WPM: ${rawWPM} | Accuracy: ${accuracy}% | Adjusted WPM: ${adjustedWPM}`;
    retryBtn.style.display = "inline-block";
    const best = localStorage.getItem("highScore");
    if (!best || adjustedWPM > parseInt(best)) {
        localStorage.setItem("highScore", adjustedWPM);
        highScoreDisplay.textContent = `Best: ${adjustedWPM} WPM 🏆`;
    } else {
        highScoreDisplay.textContent = `Best: ${best} WPM`;
    }
}

inputBox.addEventListener("input", function() {
    playTypeSound();
    if (!timerStarted) {
        timerStarted = true;
        testActive = true;
        countdownInterval = setInterval(function() {
            timeLeft--;
            countdown.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                endTest();
            }
        }, 1000);
    }

    const typedText = inputBox.value;
    const isLight = document.body.classList.contains("light");
    let display = "";

    const words = textToType.split(" ");
    let charIndex = 0;
    let displayWords = [];

    for (let w = 0; w < words.length; w++) {
        let wordDisplay = "";
        for (let c = 0; c < words[w].length; c++) {
            const i = charIndex;
            if (i < typedText.length) {
                if (typedText[i] === textToType[i]) {
                    wordDisplay += `<span style="color: green">${textToType[i]}</span>`;
                } else {
                    wordDisplay += `<span style="color: red">${textToType[i]}</span>`;
                }
            } else if (i === typedText.length) {
                wordDisplay += `<span style="border-bottom: 2px solid ${isLight ? "black" : "white"}">${textToType[i]}</span>`;
            } else {
                wordDisplay += textToType[i];
            }
            charIndex++;
        }
        displayWords.push(`<span style="white-space: nowrap">${wordDisplay}</span>`);

        if (w < words.length - 1) {
            const i = charIndex;
            if (i < typedText.length) {
                displayWords.push(typedText[i] === " "
                    ? `<span style="color: green">·</span>`
                    : `<span style="color: red">·</span>`);
            } else if (i === typedText.length) {
                displayWords.push(`<span style="border-bottom: 2px solid ${isLight ? "black" : "white"}"> </span>`);
            } else {
                displayWords.push(" ");
            }
            charIndex++;
        }
    }

    display = displayWords.join("");
    textDisplay.innerHTML = display;

    if (typedText.length === textToType.length) {
        for (let i = 0; i < textToType.length; i++) {
            totalCharsTyped++;
            if (typedText[i] === textToType[i]) totalCorrectChars++;
        }
        textToType = getRandomSentence();
        inputBox.value = "";
        textDisplay.textContent = textToType;
    }
});

retryBtn.addEventListener("click", function() {
    resetTest();
});

inputBox.addEventListener("paste", function(e) {
    e.preventDefault();
});

themeToggle.addEventListener("change", function() {
    document.body.classList.toggle("light");
    themeLabel.textContent = document.body.classList.contains("light") ? "Light Mode" : "Dark Mode";
});

let isBlind = false;

blindBtn.addEventListener("change", function() {
    isBlind = !isBlind;
    inputBox.style.color = isBlind ? "transparent" : "";
});

function formatTime(seconds){
    if(seconds<60)return seconds + "s";
    const m=Math.floor(seconds/60);
    const s= seconds%60;
    return `${m}: ${s.toString().padStart(2,"0")}`;
}

function loadHighScore(){
    const best=localStorage.getItem("highScore");
    if(best){
        highScoreDisplay.textContent=`Best: ${best} WPM`;
    }
}
loadHighScore();

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTypeSound() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.05);
}
