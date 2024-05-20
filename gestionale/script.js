const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");


addEventListener("load", function(event) {
    //check if user is authenticated
    CheckAuthenticatedUser();



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

function CheckAuthenticatedUser() {
    if(location.href.endsWith("loginpage.html") && ( localStorage.getItem("user") != null && localStorage.getItem("apiToken") != null )) {
       location.href = "index.html";
    } else if(!location.href.endsWith("loginpage.html") && (localStorage.getItem("user") === null && localStorage.getItem("apiToken") === null)) {
        //redirect to login
        location.href = "loginpage.html";
    }
    
    
    

}

function LogInUser(role = 2) {
    //Get form values
    var email = body.querySelector("#email").value;
    var password = body.querySelector("#password").value;

    var user = {
        "email": email,
        "password": password,
        "role": role
    };

    if(role == 1) {
        $.ajax({
            url: '../api/auth/loginGestionale.php',
            type: "POST",
            dataType: 'json',
            data: user,
            success: (data) => {
                if(data.status || data.code == 200){
                    //Set user in localStorage
                    var authUser = { 
                        id: data.id,
                        name: data.name,
                        surname: data.surname,
                        email: data.email, 
                        role: data.role
                    }

                    localStorage.setItem("user", JSON.stringify(authUser));

                    //Set token
                    localStorage.setItem("apiToken", data.token);

                    location.href = "index.html";
                } else {
                    alert("Wrong email or password, please retry.");
                }
            },
            error: (data) => {
                alert("User does not exist")
            }
        })
    } else if (role == 2) {
        $.ajax({
            url: '../api/auth/login.php',
            type: "POST",
            dataType: 'json',
            data: user,
            success: (data) => {
                console.log(data);

                if(data.status || data.code == 200){
                    //Set user in localStorage
                    var authUser = { 
                        id: data.id,
                        name: data.name,
                        surname: data.surname,
                        email: data.email, 
                        role: data.role
                    }

                    localStorage.setItem("user", JSON.stringify(authUser));

                    //Set token
                    localStorage.setItem("apiToken", data.token);

                    location.href = "index.html";
                } else {
                    alert("Wrong email or password, please retry.");
                }
                
            },
            error: (data) => {
                alert("User does not exist")
            }
            
        })
    }

}

function LogOutUser(){
    //Get API token from localStorage
    var token = localStorage.getItem("apiToken");

    $.ajax({
        url: '../api/auth/logout.php',
        type: "POST",
        dataType: 'json',
        data: {token:token},
        success: (data) => {

            localStorage.removeItem("user")
            localStorage.removeItem("apiToken");

            location.reload();
        }
    })
}

function RegisterUser(role = 2) {
    //Get form values
    var nome = body.querySelector("#nomeR").value;
    var cognome = body.querySelector("#cognomeR").value;
    var email = body.querySelector("#emailR").value;
    var password = body.querySelector("#passwordR").value;

    var newUser = {
        "name": nome,
        "surname": cognome,
        "email": email,
        "password": password,
        "role": role
    };

    $.ajax({
        url: '../api/auth/register.php',
        type: "POST",
        dataType: 'json',
        data: newUser,
        success: (data) => {
            console.log(data);
        }
    })
}