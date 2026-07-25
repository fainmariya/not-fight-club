# Not Fight Club

A turn-based browser fighting game built with Vanilla JavaScript, HTML, and CSS.  
The player can create a fighter, choose an avatar, battle different opponents, track wins and losses, and resume an unfinished fight after reloading the page.
## Features

- Player registration with persistent name
- Character page with avatar selection and win/loss statistics
- Name editing in Settings
- Random opponents with different attack and defense profiles
- Turn-based battle mechanics with attack and defense zones
- Critical hits that break through blocks
- Detailed battle log for every action
- Persistent game state, including HP, turn, opponent, and battle log
- Responsive layout for desktop and mobile

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- ES Modules
- Local Storage

## How to Run

1. Clone the repository.
2. Open the project folder in VS Code.
3. Run `index.html` using Live Server.

## How to Play

1. Enter a fighter name.
2. Choose an avatar on the Character page.
3. Start a new battle from the Home page.
4. Select one attack zone and two defense zones.
5. Continue fighting until one fighter reaches 0 HP.
6. Check the battle result and updated win/loss statistics.

## Project Structure

```text
not-fight-club/
├── assets/
│   └── images/
├── css/
│   ├── battle.css
│   ├── reset.css
│   └── style.css
├── js/
│   ├── app.js
│   ├── opponents.js
│   ├── state.js
│   └── storage.js
├── index.html
└── README.md
```


## Author

Created by Mariya Fain.