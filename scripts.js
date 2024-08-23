// Constants
const MAX_HINTS = 2;
const MAX_TRIES = 8;
const TOTAL_TIME = 59;

// HTML Elements
const elements = 
{
    settingsDetailsEl : document.getElementById("settings-details-el"),
    bgMusicCheckbox : document.getElementById("bg-music-checkbox"),
    startBtn : document.getElementById("start-btn"),
    startMenu : document.getElementById("start-menu"),
    output : document.getElementById("output"),
    topWrapper : document.getElementById("top-wrapper"),
    categoryDisplay : document.getElementById("category-display"),
    hintBtn : document.getElementById("hint-btn"),
    triesDisplay : document.getElementById("tries-display"),
    wordDisplay : document.getElementById("word-display"),
    keyboard : document.getElementById("keyboard"),
    keyboardBtns : keyboard.querySelectorAll("button"),
    timerDisplay : document.getElementById("timer-display"),
    characters : null,
};

// Game State
let gameState = 
{
    gameStart : false,
    gameWord : "",
    gameLost : false,
    gameWon : false,
    hintsLeft : MAX_HINTS,
    triesLeft : MAX_TRIES,
    timeLeft : TOTAL_TIME,
    hangmanWordIndex : null,
    countdown : null,
    userGuess : null,
}

// Hangman Words
let hangmanWords = [
    // Fruit
    { word: "apple", category: "fruit" },
    { word: "banana", category: "fruit" },
    { word: "cherry", category: "fruit" },
    { word: "grape", category: "fruit" },

    // Vegetable
    { word: "carrot", category: "vegetable" },
    { word: "broccoli", category: "vegetable" },
    { word: "spinach", category: "vegetable" },
    { word: "tomato", category: "vegetable" },

    // Animal
    { word: "tiger", category: "animal" },
    { word: "elephant", category: "animal" },
    { word: "giraffe", category: "animal" },
    { word: "penguin", category: "animal" },

    // City
    { word: "paris", category: "city" },
    { word: "newyork", category: "city" },
    { word: "tokyo", category: "city" },
    { word: "london", category: "city" },

    // Instrument
    { word: "guitar", category: "instrument" },
    { word: "piano", category: "instrument" },
    { word: "drum", category: "instrument" },
    { word: "violin", category: "instrument" },

    // Structure
    { word: "pyramid", category: "structure" },
    { word: "bridge", category: "structure" },
    { word: "skyscraper", category: "structure" },
    { word: "castle", category: "structure" },

    // Music
    { word: "jazz", category: "music" },
    { word: "rock", category: "music" },
    { word: "classical", category: "music" },
    { word: "blues", category: "music" },

    // Beverage
    { word: "coffee", category: "beverage" },
    { word: "tea", category: "beverage" },
    { word: "juice", category: "beverage" },
    { word: "soda", category: "beverage" },
   
    // Vehicle
    { word: "rocket", category: "vehicle" },
    { word: "car", category: "vehicle" },
    { word: "bicycle", category: "vehicle" },
    { word: "train", category: "vehicle" },
   
    // Sport
    { word: "soccer", category: "sport" },
    { word: "basketball", category: "sport" },
    { word: "tennis", category: "sport" },
    { word: "hockey", category: "sport" },  
];

hangmanWords.forEach((dictionary) => {
    dictionary.word = dictionary.word.toUpperCase();
})

// Audio
const gameAudio = {
    backgroundMusic : new Audio("src/audio/game-music-loop-6-144641.mp3"),
    wrong : new Audio("src/audio/wrong-47985.mp3"),
    correct : new Audio("src/audio/90s-game-ui-6-185099.mp3"),
    gameOver : new Audio("src/audio/game-over-2-sound-effect-230463.mp3"),
    gameWon : new Audio("src/audio/level-complete-retro-video-game-music-soundroll-variation-2-2-00-04.mp3")
}

// Event Listeners
function initialiseEventListeners() {
    elements.startBtn.addEventListener("click", startGame);
    elements.hintBtn.addEventListener("click", provideHint);
    // add event listener to keyboard 
    elements.keyboardBtns.forEach((keyboardBtn) => {
        keyboardBtn.addEventListener("click", () => handleKeyInput(keyboardBtn.innerHTML));
    });
    elements.bgMusicCheckbox.addEventListener("change", toggleBgMusic);
}

// Start Game
function startGame() {
    hideStartMenu();
    initialiseGame();
    playBackgroundMusic();
}

function hideStartMenu() {
    elements.startMenu.classList.add("hide");
    gameState.gameStart = true;
}

function initialiseGame() {
    initialiseTimer();
    initialiseGameWord();
    displayGameInfo();
    renderWordBlanks();
}

function playBackgroundMusic() {
    gameAudio.backgroundMusic.loop = true;
    gameAudio.backgroundMusic.play();
    elements.settingsDetailsEl.removeAttribute("disabled");
}

// Timer functions
function initialiseTimer() {
    gameState.countdown = setInterval(updateTimer, 1000);
    updateTimer(); 
}

function updateTimer() {
    const { timeLeft } = gameState;
    elements.timerDisplay.innerHTML = `0:${timeLeft}`;
    if (timeLeft === 0) {
        gameState.gameLost = true;
        endGame();
        timerDisplay.innerHTML = `0:00`;
    } else {
        gameState.timeLeft--;
    }
}

function initialiseGameWord() {
    gameState.hangmanWordIndex = Math.floor(Math.random() * hangmanWords.length);
    gameState.gameWord = hangmanWords[gameState.hangmanWordIndex].word;
    console.log(`gameword is ${gameState.gameWord}`);
}

function displayGameInfo() {
    const { triesLeft, hangmanWordIndex } = gameStage;
    elements.triesDisplay.innerHTML = `Tries left: ${gameState.triesLeft}`;
    elements.categoryDisplay.innerHTML = hangmanWords[gameState.hangmanWordIndex].category.toLowerCase();
}

function renderWordBlanks() {
    for(i = 0; i < gameState.gameWord.length ; i++) {
        const newCharacter = document.createElement("div");
        newCharacter.dataset.character = gameState.gameWord.charAt(i).toUpperCase();
        newCharacter.classList.add("character", `char-${i}`);
        elements.wordDisplay.appendChild(newCharacter);
    }
}

function provideHint() {
    if(gameState.hintsLeft > 0) {
        gameState.hintsLeft--;
        let userGuess = "";
        let characters = document.querySelectorAll(".character");
        for(i = 0; i < characters.length; i ++) {
            const char = document.querySelector(`.char-${i}`);
            userGuess += char.innerHTML;
        }
        let hintChar;
        do {
            hintChar = gameState.gameWord[Math.floor(Math.random() * gameState.gameWord.length)];
        }
        while(userGuess.includes(hintChar));
        revealCharacter(hintChar);
        updateHint();
    }
    else {
        hintBtn.disabled = true;
    }
}

function updateHint() {
    elements.hintBtn.innerHTML = `Hint (${gameState.hintsLeft}/2)`;
}

function handleKeyInput(key) {
    if(gameState.gameLost) return; 
    if(gameState.gameWord.includes(key)) {
        revealCharacter(key);
        playAudio(gameAudio.correct);
    }
    else {
        handleWrongGuess();
        playAudio(gameAudio.wrong);
    }
    disableKeyButton(key);
    checkGameStatus();
}

function toggleBgMusic() {
    gameAudio.backgroundMusic.paused ? gameAudio.backgroundMusic.play() : gameAudio.backgroundMusic.pause();
}

function revealCharacter(key) {
    const characters = elements.wordDisplay.querySelectorAll(".character");
    characters.forEach((charElement) => {
        if(charElement.dataset.character === key) {
            charElement.innerHTML = key;
        }
    })
}

function handleWrongGuess() {
    gameState.triesLeft--;
    displayGameInfo();
    renderHangman();
}

function playAudio(audio) {
    if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
    audio.play();
}

function disableKeyButton(key) {
    elements.keyboardBtns.forEach((keyboardBtn) => {
        if(keyboardBtn.innerHTML === key) {
            keyboardBtn.disabled = true;
            keyboardBtn.classList.add(gameState.gameWord.includes(key) ? "right" : "wrong");
        }
    })
}

function checkGameStatus() {
    const userGuess = Array.from(elements.wordDisplay.querySelectorAll(".character"))
                           .map(charElement => charElement.innerHTML)
                           .join('');
    if(userGuess.toUpperCase() === gameState.gameWord.toUpperCase()) {
        gameState.gameWon = true;
        endGame();
    }
    else if(gameState.triesLeft === 0) {
        gameState.gameLost = true;
        endGame();
    }
}

function endGame() {
    clearInterval(gameState.countdown);
    elements.keyboardBtns.forEach(keyboardBtn => {
        keyboardBtn.disabled = true;
    })
    if(gameState.gameLost === true) {
        elements.output.innerHTML += "YOU LOSE!";
        revealAns();
        renderHangman();
        playAudio(gameAudio.gameOver);
    }
    else if(gameState.gameWon === true) {
        elements.output.innerHTML += "YOU WIN!";
        playAudio(gameAudio.gameWon);
    }
    
}

function revealAns() {
    const characters = elements.wordDisplay.querySelectorAll(".character");
    characters.forEach((charEl) => {
        charEl.innerHTML = charEl.dataset.character;
    });
}

// hangman canvas
const canvas = document.getElementById("hangman-graphic");
const ctx = canvas.getContext("2d");
const leftWrapper = document.getElementById("top-wrapper");

// resize the canvas
canvas.width = 3300;
canvas.height = 1000;

canvas.style.width = "330px";
canvas.style.height = "100px";
canvas.getContext("2d").scale(10, 10);

// stage object
const gameStage = {
    fillCanvasBackground: function() {
        ctx.fillStyle = "rgb(156, 230, 170)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    drawPost : function(){
        ctx.lineWidth = 2;
        // top bar
        ctx.beginPath();
        ctx.moveTo(130, 20);
        ctx.lineTo(180, 20);
        // vertical pole
        ctx.moveTo(130, 20);
        ctx.lineTo(130, 75);
        ctx.stroke();

        // left and right pole legs with line width of 1.5
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(130, 75);
        ctx.lineTo(118, 80);
        ctx.moveTo(130, 75);
        ctx.lineTo(142, 80);
        ctx.stroke();

        // reset line width
        ctx.lineWidth = 2;
    },
    drawHead : function() {
        ctx.beginPath();
        ctx.arc(180, 35, 5, 0, Math.PI * 2);
        ctx.stroke();
    },
    drawBody : function() {
        ctx.beginPath();
        ctx.moveTo(180, 40);
        ctx.lineTo(180, 60);
        ctx.stroke();
    },
    drawRightHand : function() {
        ctx.beginPath();
        ctx.moveTo(180, 45);
        ctx.lineTo(173, 55);
        ctx.stroke();
    },
    drawLeftHand : function() {
        ctx.beginPath();
        ctx.moveTo(180, 45);
        ctx.lineTo(187, 55);
        ctx.stroke();
    },
    drawRightLeg : function() {
        ctx.beginPath();
        ctx.moveTo(180, 60);
        ctx.lineTo(175, 73);
        ctx.stroke();
    },
    drawLeftLeg : function() {
        ctx.beginPath();
        ctx.moveTo(180, 60);
        ctx.lineTo(185, 73);
        ctx.stroke();
    },
    drawRope : function() {
        ctx.beginPath();
        ctx.moveTo(180, 20);
        ctx.lineTo(180, 30);
        ctx.stroke();
    },
    fillCanvasRed : function() {
        elements.topWrapper.style.backgroundColor = "#ff7f7f"
    }
}

function renderHangman() {
    if (gameState.gameLost) {
        // Draw everything at once if the game is lost
        gameStage.drawPost();
        gameStage.drawHead();
        gameStage.drawBody();
        gameStage.drawRightHand();
        gameStage.drawLeftHand();
        gameStage.drawLeftLeg();
        gameStage.drawRightLeg();
        gameStage.drawRope();
    } else {
        // Draw hangman parts based on the number of tries left
        if (gameState.triesLeft === 7) {
            gameStage.drawPost();
        } else if (gameState.triesLeft === 6) {
            gameStage.drawHead();
        } else if (gameState.triesLeft === 5) {
            gameStage.drawBody();
        } else if (gameState.triesLeft === 4) {
            gameStage.drawRightHand();
        } else if (gameState.triesLeft === 3) {
            gameStage.drawLeftHand();
        } else if (gameState.triesLeft === 2) {
            gameStage.drawLeftLeg();
        } else if (gameState.triesLeft === 1) {
            gameStage.drawRightLeg();
        } else if (gameState.triesLeft === 0) {
            gameStage.drawRope();
        }
    }
}

function initialise() {
    initialiseEventListeners();
}

window.addEventListener("load", initialise);