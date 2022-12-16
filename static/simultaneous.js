function hold_simultaneous() {
    if (activePlayer === 0) {activeScores = 0; nextPlayer_simultaneous(); }
    else {
        let currentScoreHuman = parseInt(uiElements[0].current.textContent);
        let newScoreHuman = players[0].addScore(currentScoreHuman);
        let currentScoreMachine = parseInt(uiElements[1].current.textContent);
        let newScoreMachine = players[1].addScore(currentScoreMachine);

        updateHighestScore(newScoreHuman);
        updateHighestScore(newScoreMachine);

        let hasWinner = checkWinner();
        activeScores = 0;

        uiElements[0].total.textContent = newScoreHuman.toString();
        uiElements[0].current.textContent = '0';
        uiElements[1].total.textContent = newScoreMachine.toString();
        uiElements[1].current.textContent = '0';

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

    let opponentCurrentScores = parseInt(uiElements[0].current.textContent);
    let diceValueList = computerMove(goal,opponentCurrentScores,activeScores,action);

    console.log(diceValueList);
    for (value of diceValueList) {

        let diceDom = document.getElementById(`dice-0`);
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

    //let score = players[activePlayer].getScore();
    //uiElements[activePlayer].total.textContent = score.toString();
    activeScores = 0;
    doubleSix = false;
    //uiElements[activePlayer].current.textContent = '0';
    //switch player
    activePlayer = (activePlayer + 1) % numPlayers;
    //switch active state
    changeActiveState()
    if (activePlayer === 1) roll_machine_simultaneous();
}