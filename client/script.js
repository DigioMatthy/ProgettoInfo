const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");


addEventListener("load", function(event) {
    //Controllo che esista la chiave "mode"
    if(localStorage.getItem("mode") === null){
        //Se entro qua dentro, la chiave non esiste, quindi devo crearla
        localStorage.setItem("mode","");
    } else {
        if(localStorage.getItem("mode") === "dark"){
            body.classList.add("dark");
            modeText.innerText = "Light Mode";
        } else {
            body.classList.remove("dark");
            modeText.innerText = "Dark Mode";
        }
    }
});

function ToggleDarkMode() {
    if(localStorage.getItem("mode") === "dark"){
        body.classList.remove("dark");
        localStorage.setItem("mode","");
        modeText.innerText = "Light Mode";
    } else {
        body.classList.add("dark");
        localStorage.setItem("mode","dark");
        modeText.innerText = "Dark Mode";
    }
}