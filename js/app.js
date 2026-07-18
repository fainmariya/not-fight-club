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
const settingsError = document.querySelector('.settings__error')
const avatarButtons = document.querySelectorAll(".character__avatar-button");
const characterAvatar = document.querySelector(".character__avatar");
const savedState = loadState();
const calmharacterWinsValue = document.querySelector('.character__wins-value');
const characterLossesValue = document.querySelector('.character__losses-value');
const battleOpponentName = document.querySelector('.battle__opponent-name');
const battleOpponentImage = document.querySelector('.battle__opponent-image')
const battleOpponentCurHP = document.querySelector(".battle__opponent-current-hp");
const battleOpponentHM = document.querySelector('.battle__opponent-max-hp');
const battlePlayerCurrentHP = document.querySelector('.battle__player-current-hp');
const battlePlayerMaxHP = document.querySelector('.battle__player-max-hp');

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
battleLogList.innerHTML = "";

battleForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const playerAttack = document.querySelector('input[name="attackZone"]:checked')
    const selectedDefenseZones = document.querySelectorAll('input[name="defenseZone"]:checked')
    
    let randomIndexForOpponent = Math.floor(Math.random() * (attackZones.length))
    let randomIndexForOpponentDefenseOne = Math.floor(Math.random() * (defenseZones.length))
    let randomIndexForOpponentDefenseTwo = Math.floor(Math.random() * (defenseZones.length))
    while(randomIndexForOpponentDefenseOne === randomIndexForOpponentDefenseTwo){
        randomIndexForOpponentDefenseTwo = Math.floor(Math.random() * (defenseZones.length)) 
    } 
    const opponentDefenseZoneOne = defenseZones[randomIndexForOpponentDefenseOne]
    const opponentDefenseZoneTwo = defenseZones[randomIndexForOpponentDefenseTwo]
    const isPlayerAttackBlocked = 
        playerAttack.value === opponentDefenseZoneOne.value || 
        playerAttack.value === opponentDefenseZoneTwo.value;
        

    
    const opponentAttack = attackZones[randomIndexForOpponent]
    
    const isOpponentAttackBlocked =
        opponentAttack.value === selectedDefenseZones[0].value ||
        opponentAttack.value === selectedDefenseZones[1].value;
        let isPlayerCritical;
        let isOpponentCritical;
        const randomNumberForOpponent = Math.random()
        const randomNumberForPlayer = Math.random() 
        let playerDamage = 0;
        if (randomNumberForPlayer < gameState.player.criticalChance){
            isPlayerCritical = true
        } else{
            isPlayerCritical = false
        }
        if (randomNumberForOpponent < currentOpponent.criticalChance){
            isOpponentCritical = true
        } else{
            isOpponentCritical = false
        }   

        if (isPlayerAttackBlocked === false) {
             
                if (isPlayerCritical === true) {
                    playerDamage = gameState.player.damage * 2;
                } else {
                    playerDamage = gameState.player.damage;
                }
            
        }
        
        let opponentDamage = 0;
        if (isOpponentAttackBlocked === false){
            if (isOpponentCritical === true){
                opponentDamage = currentOpponent.damage * 2
            }
            else{
                opponentDamage = currentOpponent.damage;
            }
            
        }
        currentOpponentHealth = Math.max(
            0,
            currentOpponentHealth - playerDamage
        );
        
        battleOpponentCurHP.textContent = currentOpponentHealth;
        currentPlayerHealth = Math.max(
            0,
            currentPlayerHealth - opponentDamage
        );
        battlePlayerCurrentHP.textContent = currentPlayerHealth
        battleOpponentHealthFill.style.width = (currentOpponentHealth / currentOpponent.maxHealth) * 100 + "%";
        battlePlayerHealthFill.style.width = (currentPlayerHealth/gameState.player.maxHealth) * 100 + "%"
        
        if (currentOpponentHealth === 0){
            console.log("Player wins")
            gameState.player.wins += 1;
            saveState(gameState);
            updatePlayerData();
            battleAttackButton.disabled = true;
            attackZones.forEach(function(input) {
                input.disabled = true});
            defenseZones.forEach(function(input) {
                input.disabled = true;})
        }else if (currentPlayerHealth === 0){
            console.log("Opponent wins")
            gameState.player.losses += 1;
            saveState(gameState);
            updatePlayerData();
            battleAttackButton.disabled = true
            attackZones.forEach(function(input) {
                input.disabled = true;
            });
        
            defenseZones.forEach(function(input) {
                input.disabled = true;
            });
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
        
    });
    

 navigationButtons.forEach(function (button) {
    button.addEventListener('click',function(){
        const targetScreen = button.dataset.screen
        showScreen(targetScreen)
    })
});
 if (savedState !== null){
    Object.assign(gameState.player, savedState.player)
    characterAvatar.src = URL_avatar + gameState.player.avatar
    avatarButtons.forEach(function(avatarButton){
        if (avatarButton.dataset.avatar===gameState.player.avatar){
            avatarButton.classList.add("is-selected")
        }
    })
    updatePlayerData()
    showScreen("home")
 }
 
registrationForm.addEventListener('submit', function(event){
    event.preventDefault();
    const playerName  = registrationInput.value.trim();
    if (playerName === ''){
        registrationError.textContent = "Please enter a valid name."
        return
    }
        registrationError.textContent = ''
        gameState.player.name=playerName
        updatePlayerData()
        saveState(gameState);
        showScreen("home")
})

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
})

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
    }
    settingsError.textContent = "";
    gameState.player.name = newSettings
    updatePlayerData();
    saveState(gameState);

 })
 
function updatePlayerData(){
    homePlayerName.textContent = gameState.player.name;
    characterName.textContent = gameState.player.name;
    battlePlayerName.textContent = gameState.player.name;
    settingsInput.value = gameState.player.name;
    calmharacterWinsValue.textContent = gameState.player.wins;
    characterLossesValue.textContent = gameState.player.losses 
}

startButton.addEventListener("click", function () {
    battleTurn.textContent = 1;
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