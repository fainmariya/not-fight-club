 import { gameState } from "./state.js"
 import { saveState } from "./storage.js"
 import { loadState } from "./storage.js"
 import { opponents } from "./opponents.js"

 const registrationForm = document.querySelector(".registration__form")
 const registrationInput = document.querySelector(".registration__input")
 const registrationError = document.querySelector(".registration__error")
 const battleForm = document.querySelector(".battle__form");


 const screens = document.querySelectorAll(".screen")
 const navigationButtons = document.querySelectorAll("[data-screen]")
 const startButton=document.querySelector('.home__start-button')

const URL_avatar = "./assets/images/avatars/";
const URL_opponents = './assets/images/opponents/'
 
const homePlayerName = document.querySelector(".home__player-name")
const characterName = document.querySelector(".character__name")
const battlePlayerName = document.querySelector(".battle__player-name")
const settingsInput = document.querySelector('.settings__input')
const settingsForm = document.querySelector('.settings__form');
const newPlayerButton = document.querySelector(".settings__new-player-button")
const settingsError = document.querySelector('.settings__error')
const avatarButtons = document.querySelectorAll(".character__avatar-button");
const characterAvatar = document.querySelector(".character__avatar");
const characterWinsValue = document.querySelector('.character__wins-value');
const characterLossesValue = document.querySelector('.character__losses-value');
const battleOpponentName = document.querySelector('.battle__opponent-name');
const battleOpponentImage = document.querySelector('.battle__opponent-image')
const battleOpponentCurHP = document.querySelector(".battle__opponent-current-hp");
const battleOpponentHM = document.querySelector('.battle__opponent-max-hp');
const battlePlayerCurrentHP = document.querySelector('.battle__player-current-hp');
const battlePlayerMaxHP = document.querySelector('.battle__player-max-hp');

//modal_window
const battleResult= document.querySelector(".battle-result")
const battleResultMessage = document.querySelector(".battle-result__message")
const battleResultButton = document.querySelector(".battle-result__button")

const battlePlayerHealthFill = document.querySelector('.battle__player-health-fill');
const battleOpponentHealthFill = document.querySelector('.battle__opponent-health-fill');
const attackZones = document.querySelectorAll('[name="attackZone"]');
const defenseZones = document.querySelectorAll('[name="defenseZone"]');
const battlePlayerImage = document.querySelector('.battle__player-image');
const battleAttackButton = document.querySelector('.battle__attack-button')
const battleTurn = document.querySelector('.battle__turn')
const battleLogList = document.querySelector(".battle__log-list");

let currentOpponent = null;
let currentPlayerHealth = 0;
let currentOpponentHealth = 0;
let currentTurn = 1;
const battleZones = ["head", "chest", "stomach", "legs"];

newPlayerButton.addEventListener("click", function(){
    window.confirm("Create a new fighter? Current progress will be deleted.")
    localStorage.removeItem("notFightClubState");
    location.reload();
    window.confirm("Create a new fighter? Current progress will be deleted.")
})

battleForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const playerAttack = document.querySelector('input[name="attackZone"]:checked');

    const selectedDefenseZones = document.querySelectorAll('input[name="defenseZone"]:checked');

    const playerDefenseZones = Array.from(selectedDefenseZones).map(
        function(input) {
            return input.value;
        }
    );
    const opponentAttackZones = getRandomUniqueZones(currentOpponent.attackCount);
    const opponentDefenseZones = getRandomUniqueZones(currentOpponent.defenseCount);
    const isPlayerAttackBlocked = 
        opponentDefenseZones.includes(playerAttack.value);
    let opponentDamage = 0;

    opponentAttackZones.forEach(function(opponentAttackZone) {
        const isOpponentAttackBlocked =
            playerDefenseZones.includes(opponentAttackZone);
    
        const randomNumberForOpponent = Math.random()

        const isOpponentCritical =
            randomNumberForOpponent < currentOpponent.criticalChance;

        let currentAttackDamage = 0;

        if (isOpponentCritical === true){
            currentAttackDamage = Math.round(
                currentOpponent.damage * 1.5);
        } else if (isOpponentAttackBlocked === false) {
            currentAttackDamage = currentOpponent.damage;
        }
        opponentDamage += currentAttackDamage;
        let attackResult;
        if (isOpponentCritical === true) {
            attackResult = "critical";
        } else if (isOpponentAttackBlocked === true) {
            attackResult = "blocked";
        } else {
            attackResult = "hit";
        };
      const opponentLogData = {
        turn: currentTurn,
        attacker: currentOpponent.name,
        target: gameState.player.name,
        zone: opponentAttackZone,
        result: attackResult,
        damage: currentAttackDamage,
    };
    const opponentLogItem =
    createBattleLogItem(opponentLogData);

    battleLogList.append(opponentLogItem);
    gameState.battle.log.push(opponentLogData);
     });
    const randomNumberForPlayer = Math.random();
    const isPlayerCritical =
        randomNumberForPlayer < gameState.player.criticalChance;
    let playerDamage = 0;
    if (isPlayerCritical === true){
        playerDamage = Math.round(
            gameState.player.damage * 1.5
        );
    } else if (isPlayerAttackBlocked === false) {
            playerDamage = gameState.player.damage;
        };
    let playerAttackResult;
    if (isPlayerCritical === true){
        playerAttackResult = "critical";
    } else if (isPlayerAttackBlocked === true) {
        playerAttackResult = "blocked";
    } else {
        playerAttackResult = "hit";
    };
    currentOpponentHealth = Math.max(
            0,
            currentOpponentHealth - playerDamage
    );
    currentPlayerHealth = Math.max(
        0,
        currentPlayerHealth - opponentDamage
    );
    battleOpponentCurHP.textContent = currentOpponentHealth;
    battlePlayerCurrentHP.textContent = currentPlayerHealth;
    battleOpponentHealthFill.style.width = (currentOpponentHealth / currentOpponent.maxHealth) * 100 + "%";
    battlePlayerHealthFill.style.width = (currentPlayerHealth/gameState.player.maxHealth) * 100 + "%";
    const playerLogData = {
        turn: currentTurn,
        attacker: gameState.player.name,
        target: currentOpponent.name,
        zone: playerAttack.value,
        result: playerAttackResult,
        damage: playerDamage,
    };
    const playerLogItem =
    createBattleLogItem(playerLogData);
    battleLogList.append(playerLogItem);
    gameState.battle.log.push(playerLogData);
    if (currentOpponentHealth === 0){
        openBattleResult(`${gameState.player.name} wins`)
        gameState.player.wins += 1;
        updatePlayerData();
        battleAttackButton.disabled = true;
        attackZones.forEach(function(input) {
                input.disabled = true});
        defenseZones.forEach(function(input) {
            input.disabled = true;});
        const resultLogItem = document.createElement("li");
        resultLogItem.textContent = `${gameState.player.name} wins the battle!`;
        battleLogList.append(resultLogItem);
        }else if (currentPlayerHealth === 0){
            openBattleResult(`${currentOpponent.name} wins`);
            gameState.player.losses += 1;
            updatePlayerData();
            battleAttackButton.disabled = true;
            attackZones.forEach(function(input){
                input.disabled = true;
            });
            defenseZones.forEach(function(input) {
                input.disabled = true;
            });
            const resultLogItem = document.createElement("li");
           resultLogItem.textContent = `${currentOpponent.name} wins the battle!`;
            battleLogList.append(resultLogItem);
        }else{
            currentTurn += 1;
            battleTurn.textContent = currentTurn;
            attackZones.forEach(function(input) {
                input.checked = false;
                input.disabled = false;
            });
            defenseZones.forEach(function(input) {
                input.checked = false;
                input.disabled = false;
            });
            updateAttackButtonState();
        }
        gameState.battle.playerHealth = currentPlayerHealth;
        gameState.battle.opponentHealth = currentOpponentHealth;
        gameState.battle.turn = currentTurn;
        saveState(gameState);
    });
 navigationButtons.forEach(function (button) {
    button.addEventListener('click',function(){
        const targetScreen = button.dataset.screen;
        showScreen(targetScreen)
    })
});
const savedState = loadState();
 if (savedState !== null){
    Object.assign(gameState.player, savedState.player)
    characterAvatar.src = URL_avatar + gameState.player.avatar
    avatarButtons.forEach(function(avatarButton){
        if (avatarButton.dataset.avatar===gameState.player.avatar){
            avatarButton.classList.add("is-selected")
        }
    })
    gameState.battle = savedState.battle ?? null;
    updatePlayerData()
    if (
        gameState.battle !== null &&
        gameState.battle.playerHealth > 0 &&
        gameState.battle.opponentHealth > 0
    ) {
        restoreBattle();
    } else {
        showScreen("home");
    }
 };
registrationForm.addEventListener('submit', function(event){
    event.preventDefault();
    const playerName  = registrationInput.value.trim();
    if (playerName === ''){
        registrationError.textContent = "Please enter a valid name."
        return
    }
        registrationError.textContent = '';
        gameState.player.name=playerName;
        gameState.player.wins = 0;
        gameState.player.losses = 0;
        gameState.battle = null;
        updatePlayerData()
        saveState(gameState);
        showScreen('home')
});
avatarButtons.forEach(function(button){
    button.addEventListener('click', function(){
        avatarButtons.forEach(function(btn) {
            btn.classList.remove("is-selected");
          });
        button.classList.add("is-selected");
        const pic = button.dataset.avatar
        const pathToAvatar = URL_avatar + pic
        characterAvatar.src = pathToAvatar
        gameState.player.avatar = pic;
        saveState(gameState);
    })
});
function showScreen(screenName){
    screens.forEach(function(screen){
        if (screen.classList.contains(screenName) ){
            screen.hidden = false;
        }else {screen.hidden = true}
    })
}
settingsForm.addEventListener('submit',function(event){
    event.preventDefault();
    const newSettings = settingsInput.value.trim()
    if (newSettings === ''){
        settingsError.textContent = 'Please enter a valid name.'
        return 
    };
    settingsError.textContent = "";
    gameState.player.name = newSettings
    updatePlayerData();
    saveState(gameState);
 });
function updatePlayerData(){
    homePlayerName.textContent = gameState.player.name;
    characterName.textContent = gameState.player.name;
    battlePlayerName.textContent = gameState.player.name;
    settingsInput.value = gameState.player.name;
    characterWinsValue.textContent = gameState.player.wins;
    characterLossesValue.textContent = gameState.player.losses 
}
startButton.addEventListener("click", function () {
    battleLogList.innerHTML = "";
    currentTurn = 1;
    battleTurn.textContent = currentTurn;
    attackZones.forEach(function(input){
        input.checked = false;
        input.disabled = false;
    });
    defenseZones.forEach(function(input){
        input.checked = false;
        input.disabled = false;
    });
    updateAttackButtonState();
    let randomIndex = Math.floor(Math.random() * opponents.length);
    currentOpponent = opponents[randomIndex];
    currentOpponentHealth = currentOpponent.maxHealth;
    battleOpponentCurHP.textContent= currentOpponentHealth;
    battleOpponentHM.textContent = currentOpponent.maxHealth;
    currentPlayerHealth = gameState.player.maxHealth;
    battlePlayerCurrentHP.textContent = currentPlayerHealth;
    battlePlayerMaxHP.textContent = gameState.player.maxHealth;
    battlePlayerHealthFill.style.width = "100%";
    battleOpponentHealthFill.style.width = "100%"
    battleOpponentName.textContent = currentOpponent.name;
    const opponentImagePath = URL_opponents + currentOpponent.image;
    const playerImagePath = URL_avatar + gameState.player.avatar;
    battleOpponentImage.src = opponentImagePath;
    battlePlayerImage.src = playerImagePath;
    gameState.battle = {
        opponentIndex: randomIndex,
        playerHealth: currentPlayerHealth,
        opponentHealth: currentOpponentHealth,
        turn: currentTurn,
        log: []
    };
    saveState(gameState);
    showScreen("battle");
});
attackZones.forEach(function(input){
    input.addEventListener('click', function(){
        updateAttackButtonState()
    })
})
defenseZones.forEach(function(input){
    input.addEventListener('change',function(){
        const checkedDefenseZones = document.querySelectorAll(
            'input[name="defenseZone"]:checked'
        );
        if (checkedDefenseZones.length > 2){
            input.checked = false;   
        }
        updateAttackButtonState()
    })
})
function updateAttackButtonState(){
    const attackSelected = document.querySelector(
        'input[name="attackZone"]:checked'
    )
    const defenseZonesSelected = document.querySelectorAll(
        'input[name="defenseZone"]:checked'
    );
    const isSelectionValid =
    attackSelected !== null &&
    defenseZonesSelected.length === 2;
    if (isSelectionValid === true){
        battleAttackButton.disabled = false
    }else {
        battleAttackButton.disabled = true
    }
}
function restoreBattle() {
    currentOpponent = opponents[gameState.battle.opponentIndex];
    currentPlayerHealth = gameState.battle.playerHealth;
    currentOpponentHealth = gameState.battle.opponentHealth;
    currentTurn = gameState.battle.turn;
    battleOpponentName.textContent = currentOpponent.name;
    battleOpponentImage.src = URL_opponents + currentOpponent.image;
    battlePlayerImage.src = URL_avatar + gameState.player.avatar;
    battlePlayerCurrentHP.textContent = currentPlayerHealth;
    battlePlayerMaxHP.textContent = gameState.player.maxHealth;
    battleOpponentCurHP.textContent = currentOpponentHealth;
    battleOpponentHM.textContent = currentOpponent.maxHealth;
    battleTurn.textContent = currentTurn;
    battlePlayerHealthFill.style.width =
        (currentPlayerHealth / gameState.player.maxHealth) * 100 + "%";
    battleOpponentHealthFill.style.width =
        (currentOpponentHealth / currentOpponent.maxHealth) * 100 + "%";
        battleLogList.innerHTML = "";
        gameState.battle.log.forEach(function(logData) {
            const logItem = createBattleLogItem(logData);
            battleLogList.append(logItem);
        });
    showScreen("battle");
}
function getRandomUniqueZones(count){
    const availableZones = [...battleZones];
    const selectZones = [];
    for(let i= 0; i < count; i += 1){
        const randomIndex = Math.floor(Math.random() * availableZones.length);
        const randomZone = availableZones.splice(randomIndex,1)[0];
        selectZones.push(randomZone)
    }
    return selectZones
}
function createBattleLogItem(logData) {
    const logItem = document.createElement("li");
    const attackerSpan = document.createElement("span");
    attackerSpan.textContent = logData.attacker;
    attackerSpan.classList.add("log-attacker");
    const targetSpan = document.createElement('span')
    targetSpan.textContent = logData.target
    targetSpan.classList.add("log-opponent");
    const zoneSpan = document.createElement("span");
    zoneSpan.textContent = logData.zone;
    zoneSpan.classList.add("log-zone");
    const resultSpan = document.createElement("span");
    resultSpan.textContent = logData.result;
    resultSpan.classList.add(
        "log-result",
        `log-result--${logData.result}`
    );
    const damageSpan = document.createElement("span");
    damageSpan.textContent = `${logData.damage} damage`;
    damageSpan.classList.add("log-damage")
    logItem.append(
        `Turn ${logData.turn}: `,
        attackerSpan,
        " attacked ",
        targetSpan,
        " in the ",
        zoneSpan,
        ": ",
        resultSpan,
        ", ",
        damageSpan
    );
    
    return logItem;
}
function openBattleResult(message){
    battleResultMessage.textContent = message;
    battleResult.hidden = false;
}
battleResultButton.addEventListener("click", function () {
    battleResult.hidden = true;
    showScreen("home");
});