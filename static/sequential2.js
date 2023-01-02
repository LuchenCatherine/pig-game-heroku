/*
MIT License

Copyright (c) 2020 Gourishankar panda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

GAME RULES:

- The game has 2 to 4 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/


class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.numDice = 1;
    }

    getName() {
        return this.name;
    }

    getScore() {
        return this.score;
    }

    setScore(score) {
        this.score = score;
    }

    addScore(addedScore) {
        this.score += addedScore;
        return this.score;
    }

    getNumDice() {
        return this.numDice;
    }

    setNumDice(dice) {
        this.numDice = dice;
    }
    toString() {
        return "Player (score: " + this.score + ")";
    }
}

function createPlayerPanel(i) {
    let playerPanel = document.createElement("div");
    playerPanel.setAttribute("class", `player-panel player-${i}-panel`);

    let playerNameElement = document.createElement("div");
    playerNameElement.setAttribute("class", "player-name");
    playerNameElement.innerHTML = `Player ${i + 1}`;

    if (i === 0) playerNameElement.innerHTML = `Player`;
    if (i === 1) playerNameElement.innerHTML = `Computer`;

    let playerScoreElement = document.createElement("div");
    playerScoreElement.setAttribute("class", `player-score player-${i}-score`);
    playerScoreElement.innerHTML = `0`;

    let playerBoxElement = document.createElement("div");
    playerBoxElement.setAttribute("class", `player-current-box player-${i}-current-box`);


    let playerCurrentLabelElement = document.createElement("div");
    playerCurrentLabelElement.setAttribute("class", `player-current-label`);
    playerCurrentLabelElement.innerText = "Round Score";

    let playerCurrentScoreElement = document.createElement("div");
    playerCurrentScoreElement.setAttribute("class", `player-current-score`);
    playerCurrentScoreElement.innerText = "0";


    let paramsDiceElement = document.createElement("div");
    paramsDiceElement.setAttribute("class", `params-dice`);

    // let paramsDiceLabel = document.createElement("span");
    // paramsDiceLabel.setAttribute("id", `player-${i}-dice-num`);
    // paramsDiceLabel.innerText = 'Rolling 1 dice';


    // let toggleContainer = document.createElement("div");

    let toggleInput = document.createElement("input");
    toggleInput.setAttribute("id", `dice-toggle-${i}`);
    toggleInput.setAttribute("type", "checkbox");
    toggleInput.setAttribute("class", "checkbox");
    toggleInput.onclick = (function() {toggleNumDice(i, this.checked);}).bind(toggleInput);

    let toggleLabel = document.createElement("label");
    toggleLabel.setAttribute("for", `dice-toggle-${i}`);
    toggleLabel.setAttribute("class", "switch");

    // toggleContainer.appendChild(toggleInput);
    // toggleContainer.appendChild(toggleLabel);

    // paramsDiceElement.appendChild(paramsDiceLabel);
    // paramsDiceElement.appendChild(toggleContainer);


    playerBoxElement.appendChild(playerCurrentLabelElement);
    playerBoxElement.appendChild(playerCurrentScoreElement);
    playerBoxElement.appendChild(paramsDiceElement);

    playerPanel.appendChild(playerNameElement);
    playerPanel.appendChild(playerScoreElement);
    playerPanel.appendChild(playerBoxElement);


    return {
        panel: playerPanel,
        current: playerCurrentScoreElement,
        score: playerScoreElement
    }
}


console.log("start");

let urlParams = new URLSearchParams(window.location.search);
let playersParam = parseInt(urlParams.get('players'));
// let numPlayers = playersParam >= 2 && playersParam <= 4 ? playersParam : 2;
let numPlayers = 2;
let players = [];
let uiElements = [];

createPlayerPanel();

let playerParentContainer = document.getElementById("player-panel-container");
for (let i = 0; i < numPlayers; i++) {
    players.push(new Player(`Player ${i + 1}`));
    let elements = createPlayerPanel(i);
    uiElements.push({
        "current": elements.current,
        "total": elements.score,
        "winnerPanel": elements.panel
    });
    playerParentContainer.appendChild(elements.panel);

}

let activeScores = 0;
let activePlayer = 0;
let doubleSix = false;
let goal = 100;
let action = action_sequential_hard;
let currentEventListenerRoll = roll_simultaneous;
let currentEventListenerHold = hold_simultaneous;

//Get all dice elements and hide them
const dice = document.querySelectorAll('.dice');
dice.forEach(die => die.style.display = 'none');
let bottomRoll = document.querySelector('.btn-roll');
console.log(bottomRoll);

checkTheme();

document.querySelector('.btn-roll').addEventListener('click', roll_simultaneous);

document.querySelector('.btn-hold').addEventListener('click', hold_simultaneous);

document.querySelector('.btn-new').addEventListener('click', newGame);

// Key pressing handler
document.querySelector('body').addEventListener('keydown', function (e) {
    switch (e.code) {
        case "Space":
            roll();
            break;
        case "Enter":
            hold();
            break;
        case "KeyN":
            newGame();
            break;
    }
});

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function newGame() {
    activeScores = 0;
    activePlayer = 0;
    doubleSix = false;

    players.forEach((player, index) => {player.setScore(0);});
    uiElements.forEach((playerUIElements, index) => {
        playerUIElements.current.textContent = '0';
        playerUIElements.total.textContent = '0';
    });

    document.querySelectorAll('.player-panel').forEach(e => e.classList.remove('active', 'winner'));
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.dice').style.display = 'none';
    document.getElementById('score-goal-box').readOnly = false;

    selectModeDifficulty();
    // document.querySelector('.btn-roll').addEventListener('click', roll_simultaneous);
    // document.querySelector('.btn-hold').addEventListener('click', hold_simultaneous);
    let merryDom = document.getElementById(`merry`);
    merryDom.style.display = 'block';
    merryDom.src = `static/images/pig-game-image-merry.png`;

    bar_human.animate(0.0);
    bar_machine.animate(0.0);

    names = document.getElementsByClassName('player-name');
    names[0].innerHTML = `Player`;
    names[1].innerHTML = `Computer`;


}

function hold() {
    let newScore = players[activePlayer].addScore(activeScores);
    let hasWinner = checkWinner();
    activeScores = 0;

    uiElements[activePlayer].total.textContent = newScore.toString();
    uiElements[activePlayer].current.textContent = '0';
    if (!hasWinner) nextPlayer();
}

async function roll_machine() {
    // wait at the start
    await delay(1000);

    if (!document.getElementById('score-goal-box').readOnly) {
        document.getElementById('score-goal-box').readOnly = true;
        goal = parseInt(document.getElementById('score-goal-box').value);
    }

    //Resets all the dice images before rolling again
    dice.forEach(die => die.style.display = 'none');

    //Sets the appropriate number of dice depending on player toggle
    let numDice = players[0].getNumDice();

    let opponentTotalScores = players[0].getScore();
    let machineTotalScores = players[1].getScore();

    console.log(opponentTotalScores, machineTotalScores);
    let diceValueList = computerMove(goal,opponentTotalScores,machineTotalScores,action);

    console.log(diceValueList);
    for (value of diceValueList) {

        let diceDom = document.getElementById(`dice-machine`);
        diceDom.style.display = 'block';
        diceDom.src = `static/images/dice-${value}.png`;
        diceDom.alt = `Machine rolled: ${value}`;
        activeScores += value;
        if (value === 1) activeScores = 0;
        uiElements[activePlayer].current.textContent = activeScores;

        // stay for a while
        await delay(1000);

    }
    hold();
}


function roll_human() {
    if (!document.getElementById('score-goal-box').readOnly) {
        document.getElementById('score-goal-box').readOnly = true;
        goal = parseInt(document.getElementById('score-goal-box').value);
    }

    //Resets all the dice images before rolling again
    dice.forEach(die => die.style.display = 'none');

    //Sets the appropriate number of dice depending on player toggle
    let numDice = players[activePlayer].getNumDice();

    let rolls = [];
    for (let i = 0; i < numDice; i++) {
        let dice = Math.floor(Math.random() * 6 + 1);
        rolls.push(dice);
        //let diceDom = document.querySelector('.dice');
        let diceDom = document.getElementById(`dice-${i}`);
        diceDom.style.display = 'block';
        diceDom.src = `static/images/dice-${dice}.png`;
        diceDom.alt = `You rolled : ${dice}` ;
    }

    for(let idx in rolls) {
        let dice = rolls[idx];
        if (dice == 1) {
            console.log("1 rolled");
            doubleSix = false;
            nextPlayer();
            break; //do not proceed if the current die roll is 1
        } else {
            if (dice == 6){
                if (doubleSix){
                    looseScore()
                    // break; //should we stop here and pass the round for the next player?
                }
                doubleSix = true
            }
            doubleSix = false;
            activeScores += dice;

            uiElements[activePlayer].current.textContent = activeScores;
        }
    }
}


function roll() {
    if (activePlayer === 1) roll_machine();
    else roll_human();
}


function nextPlayer() {

    let score = players[activePlayer].getScore();
    uiElements[activePlayer].total.textContent = score.toString();
    if (activePlayer === 0) {
        bar_human.animate(score/100.0);
    }
    else {
        bar_machine.animate(score/100.0);
    }
    activeScores = 0;
    doubleSix = false;
    uiElements[activePlayer].current.textContent = '0';
    //switch player
    activePlayer = (activePlayer + 1) % numPlayers;
    //switch active state
    changeActiveState();
    if (activePlayer === 1) roll_machine();
}


function checkWinner() {
    for (let i = 0; i < numPlayers; i++) {
        let player = players[i];
        let score = player.getScore();
        if (score >= goal) {
            console.log("we have a winner: " + player.getName());
            let names = document.getElementsByClassName('player-name');
            names[i].innerHTML = names[i].innerHTML + " Win!";
            uiElements[i].winnerPanel.classList.add('winner', 'active');
            // alert(`${player.getName()} is winner`);
            gameOver();

            return true;
        }
    }

    return false;
}

function gameOver() {
    document.querySelector('.btn-roll').removeEventListener('click', roll);
    document.querySelector('.btn-hold').removeEventListener('click', hold);
}

function changeActiveState() {
    document.querySelectorAll('.player-panel').forEach(e => e.classList.remove('active'));
    document.querySelector(`.player-${activePlayer}-panel`).classList.add('active');
}

function looseScore() {
    console.log('loosing score');
    activeScores = 0;
    players[activePlayer].setScore(0);
    uiElements[activePlayer].total.textContent = players[activePlayer].getScore().toString();
    uiElements[activePlayer].current.textContent = '0';
}

function checkTheme() {
    if (window.localStorage) {
        let body = document.querySelector('body');
        let toggle = document.querySelector('#toggle');
        let darkTheme = localStorage.getItem('dark-theme');

        if (darkTheme) {
            if (darkTheme === "on") {
                body.classList.add("dark-theme");
                toggle.checked = true;
            } else {
                body.classList.remove("dark-theme");
                toggle.checked = false;
            }
        }
    }
}

function changeTheme() {
    let body = document.querySelector('body');
    body.classList.toggle('dark-theme');

    if (body.classList.contains("dark-theme")) {
        localStorage.setItem("dark-theme", "on");
    } else {
        localStorage.setItem("dark-theme", "off");
    }
}

function toggleNumDice(playerId, checked) {
    console.log("toggle", playerId, checked);
    let numDice = checked ? 2 : 1;
    players[playerId].setNumDice(numDice);
    document.getElementById(`player-${playerId}-dice-num`).textContent = numDice == 1 ? 'Rolling 1 die' : `Rolling ${numDice} dice`;
}


function toggleRulesModal() {
    document.querySelector('.wrapper').classList.toggle('blur');
    document.querySelector('.modal.rules').classList.toggle('hidden');
}

function computerMove(goal,p1score,p2score,action) {
    let roundScore = 0;
    let again = true;
    let values = [];

    console.log(goal, p1score, p2score);
    while (again)
    {
        let diceValue = Math.floor(Math.random() * 6 + 1);
        values.push(diceValue);

        if (diceValue === 1) {
            roundScore = 0; //One 1, turn score = 0
            again = false;
        }
        else {
            roundScore += diceValue;
            console.log(roundScore);
            if (roundScore + p2score >= goal || !action[p2score][p1score][roundScore]) {
                again = false;
            }
        }
    }

    return values;
}

function computerMoveSimul(goal,p1score,p2score,action) {
    let roundScore = 0;
    let again = true;
    let values = [];

    console.log(goal, p1score, p2score);
    while (again)
    {
        let diceValue = Math.floor(Math.random() * 6 + 1);
        values.push(diceValue);

        if (diceValue === 1) {
            roundScore = 0; //One 1, turn score = 0
            again = false;
        }
        else {
            roundScore += diceValue;
            console.log(roundScore);
            if (roundScore >= action[p2score][p1score]) {
                again = false;
            }
        }
    }

    return values;
}

function selectDifficulty() {

    let difficulty = document.getElementById("difficulty").value;
    if (difficulty === "hard") {
        action = action_sequential_hard;
    } else if (difficulty === "normal") {
        action = action_simul_normal;
    } else if (difficulty === "easy") {
        action = action_simul_hard;
    }

}

function selectMode() {

    let mode = document.getElementById("mode").value;
    if (mode === "sequential") {
        document.querySelector('.btn-roll').addEventListener('click', roll);
        document.querySelector('.btn-hold').addEventListener('click', hold);

    } else if (mode === "simultaneous") {
        document.querySelector('.btn-roll').addEventListener('click', roll_simultaneous);
        document.querySelector('.btn-hold').addEventListener('click', hold_simultaneous);
    }

}

function removeCurrentEventListener() {
    document.querySelector('.btn-roll').removeEventListener('click', currentEventListenerRoll);
    document.querySelector('.btn-hold').removeEventListener('click', currentEventListenerHold);
}

function selectModeDifficulty() {
    let difficulty = document.getElementById("difficulty").value;
    let mode = document.getElementById("mode").value;

    if (mode === "sequential") {

        removeCurrentEventListener();
        document.querySelector('.btn-roll').addEventListener('click', roll);
        document.querySelector('.btn-hold').addEventListener('click', hold);
        currentEventListenerRoll = roll;
        currentEventListenerHold = hold;

        if (difficulty === "hard") {
            action = action_sequential_hard;
        } else if (difficulty === "normal") {
            action = action_sequential_normal;
        } else {
            action = action_sequential_easy;
        }
    } else {
        removeCurrentEventListener();
        document.querySelector('.btn-roll').addEventListener('click', roll_simultaneous);
        document.querySelector('.btn-hold').addEventListener('click', hold_simultaneous);
        currentEventListenerRoll = roll_simultaneous;
        currentEventListenerHold = hold_simultaneous;

        if (difficulty === "hard") action = action_simul_hard;
        else if (difficulty === "normal") action = action_simul_normal;
        else action = action_simul_easy;
    }
}


function hold_simultaneous() {
    if (activePlayer === 0) {activeScores = 0; nextPlayer_simultaneous(); }
    else {
        let currentScoreHuman = parseInt(uiElements[0].current.textContent);
        let newScoreHuman = players[0].addScore(currentScoreHuman);
        let currentScoreMachine = parseInt(uiElements[1].current.textContent);
        let newScoreMachine = players[1].addScore(currentScoreMachine);
        let hasWinner = checkWinner();
        activeScores = 0;

        uiElements[0].total.textContent = newScoreHuman.toString();
        uiElements[0].current.textContent = '0';
        uiElements[1].total.textContent = newScoreMachine.toString();
        uiElements[1].current.textContent = '0';

        bar_human.animate(newScoreHuman/100.0);
        bar_machine.animate(newScoreMachine/100.0);

        if (!hasWinner) nextPlayer_simultaneous();

    }
}

async function roll_machine_simultaneous() {
    // wait at the start
    await delay(1000);

    if (!document.getElementById('score-goal-box').readOnly) {
        document.getElementById('score-goal-box').readOnly = true;
        goal = parseInt(document.getElementById('score-goal-box').value);
    }

    //Resets all the dice images before rolling again
    dice.forEach(die => die.style.display = 'none');

    //Sets the appropriate number of dice depending on player toggle
    let numDice = players[0].getNumDice();

    // let opponentCurrentScores = parseInt(uiElements[0].current.textContent);

    let opponentTotalScores = players[0].getScore();
    let machineTotalScores = players[1].getScore();

    console.log(opponentTotalScores, machineTotalScores);
    let diceValueList = computerMoveSimul(goal,opponentTotalScores,machineTotalScores,action);

    console.log(diceValueList);
    for (value of diceValueList) {

        let diceDom = document.getElementById(`dice-machine`);
        diceDom.style.display = 'block';
        diceDom.src = `static/images/dice-${value}.png`;
        diceDom.alt = `Machine rolled: ${value}`;
        activeScores += value;
        if (value === 1) activeScores = 0;
        // stay for a while
        //await delay(1000);

    }
    uiElements[activePlayer].current.textContent = activeScores;
    await delay(1000);
    hold_simultaneous();
}


function roll_human_simultaneous() {

    //human's turn
    if (!document.getElementById('score-goal-box').readOnly) {
        document.getElementById('score-goal-box').readOnly = true;
        goal = parseInt(document.getElementById('score-goal-box').value);
    }

    //Resets all the dice images before rolling again
    dice.forEach(die => die.style.display = 'none');

    //Sets the appropriate number of dice depending on player toggle
    let numDice = players[activePlayer].getNumDice();

    let rolls = [];
    for (let i = 0; i < numDice; i++) {
        let dice = Math.floor(Math.random() * 6 + 1);
        rolls.push(dice);
        //let diceDom = document.querySelector('.dice');
        let diceDom = document.getElementById(`dice-${i}`);
        diceDom.style.display = 'block';
        diceDom.src = `static/images/dice-${dice}.png`;
        diceDom.alt = `You rolled : ${dice}` ;
    }

    for(let idx in rolls) {
        let dice = rolls[idx];
        if (dice == 1) {
            console.log("1 rolled");
            doubleSix = false;
            activeScores = 0;
            uiElements[activePlayer].current.textContent = '0';
            nextPlayer_simultaneous();
            break; //do not proceed if the current die roll is 1
        } else {
            if (dice == 6){
                if (doubleSix){
                    looseScore()
                    // break; //should we stop here and pass the round for the next player?
                }
                doubleSix = true
            }
            doubleSix = false;
            activeScores += dice;

            uiElements[activePlayer].current.textContent = activeScores;
        }
    }

    //machine's turn

}


function roll_simultaneous() {
    if (activePlayer === 1) roll_machine_simultaneous();
    else roll_human_simultaneous();
}

function nextPlayer_simultaneous() {

    let score = players[activePlayer].getScore();
    //uiElements[activePlayer].total.textContent = score.toString();
    activeScores = 0;
    doubleSix = false;
    //uiElements[activePlayer].current.textContent = '0';
    //switch player
    activePlayer = (activePlayer + 1) % numPlayers;
    //switch active state
    changeActiveState();
    if (activePlayer === 1) roll_machine_simultaneous();
}

newGame();

