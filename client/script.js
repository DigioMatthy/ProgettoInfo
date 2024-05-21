const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");


//State variables
var isViewModalOpen = false,
    isAddModalOpen = false;


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

/* UI */
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

    //Set label
    var label = body.querySelector("#signedUser");
    if(!location.href.endsWith("loginpage.html") && label != null) {
        //Set singed in label
       var user = JSON.parse(localStorage.getItem("user"));

       label.innerHTML = `
       <span>Signed In as: ${user.name} ${user.surname}</span>
        <span>${user.email}</span>
       `;
    }

    //Retreive books
   /*  if(( localStorage.getItem("user") != null && localStorage.getItem("apiToken") != null ) && location.href.endsWith("index.html")) {
        GetAllBooks();
    } */
}

/* UI */

/* Authentication */

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

                    ShowSnackBar(data.message);
    
                    setTimeout(() => {
                        location.href = 'index.html';
                    }, 4000);
                } else {
                    ShowSnackBar(data.message);
                }
            },
            error: (data) => {
                ShowSnackBar(data.message);
            }
        })
    } else if (role == 2) {
        $.ajax({
            url: '../api/auth/login.php',
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

                    ShowSnackBar(data.message);
    
                    setTimeout(() => {
                        location.href = 'index.html';
                    }, 4000);
                } else {
                    ShowSnackBar(data.message);
                }
            },
            error: (data) => {
                ShowSnackBar(data.message);
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

            if(data.status || data.code === 200) {
                ShowSnackBar(data.message);
    
                localStorage.removeItem("user")
                localStorage.removeItem("apiToken");

                setTimeout(() => {
                    location.reload();
                }, 4000);
            } else {
                ShowSnackBar(data.message);
            }
        },
        error: (data) => {
            ShowSnackBar(data.message);
        }
    })
}

function RegisterUser(role = 2) {
    //Get form values
    var nome = body.querySelector("#nomeR").value;
    var cognome = body.querySelector("#cognomeR").value;
    var email = body.querySelector("#emailR").value;
    var password = body.querySelector("#passwordR").value;

    if(nome == "" || cognome == "" || email == "" || password == ""){
        ShowSnackBar("Inserire tutti i campi!");
        return;
    }

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
            if(data.status || data.code === 200) {
                ShowSnackBar(data.message);

            } else {
                ShowSnackBar(data.message);
            }
        },
        error: (data) => {
            ShowSnackBar(data.message);
        }
    })
}

/* Authentication */

/* SnackBar */

function ShowSnackBar(message) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerText = message;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

/* SnackBar */