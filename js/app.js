 import { gameState } from "./state.js"
 import { saveState } from "./storage.js"
 import { loadState } from "./storage.js"

 const registrationForm = document.querySelector(".registration__form")
 const registrationInput = document.querySelector(".registration__input")
 const registrationError = document.querySelector(".registration__error")

 const screens = document.querySelectorAll(".screen")
 const navigationButtons = document.querySelectorAll("[data-screen]")
 const startButton=document.querySelector('.home__start-button')

const URL_avatar = "./assets/images/avatars/"
 navigationButtons.forEach(function (button) {
    button.addEventListener('click',function(){
        const targetScreen = button.dataset.screen
        showScreen(targetScreen)
    })
});
 const homePlayerName = document.querySelector(".home__player-name")
 const characterName = document.querySelector(".character__name")
 const battlePlayerName = document.querySelector(".battle__player-name")
 const settingsInput = document.querySelector('.settings__input')
 
 const characterAvatar = document.querySelector(".character__avatar");

 
 const savedState = loadState();

 if (savedState !== null){
    Object.assign(gameState.player, savedState.player)
    characterAvatar.src = URL_avatar + gameState.player.avatar
    updatePlayerName()
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
        updatePlayerName()
        saveState(gameState);
        showScreen("home")
})
const avatarButtons = document.querySelectorAll(
    ".character__avatar-button"
);

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
console.log(gameState)

function updatePlayerName(){
    homePlayerName.textContent = gameState.player.name;
    characterName.textContent = gameState.player.name;
    battlePlayerName.textContent = gameState.player.name;
    settingsInput.value = gameState.player.name;

    
}

startButton.addEventListener("click", function () {
    showScreen("battle");
});

