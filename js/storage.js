const KEY = "notFightClubState";

export function saveState(state){
    const serializedState = JSON.stringify(state)
    localStorage.setItem(KEY, serializedState)
    
}

export function loadState(){
    const savedState = localStorage.getItem(KEY)
    if (savedState === null){
        return null
    }
        return JSON.parse(savedState)
    }
    
