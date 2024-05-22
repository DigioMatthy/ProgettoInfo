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
    if(( localStorage.getItem("user") != null && localStorage.getItem("apiToken") != null ) && location.href.endsWith("index.html")) {
        GetAllBooks();
    } else if(( localStorage.getItem("user") != null && localStorage.getItem("apiToken") != null ) && location.href.endsWith("preferiti.html")) {
        GetAllFavourites();
    } else if(( localStorage.getItem("user") != null && localStorage.getItem("apiToken") != null ) && location.href.endsWith("lamialibreria.html")) {
        GetAllBorrowedBooks();
    }
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

/* Home Books */

function GetAllBooks() {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    //Get books container
    var booksContainer = body.querySelector("#libri");

    //pulisco il container
    booksContainer.innerHTML = "";

    //Invio richiesta
    $.ajax({
        url: '../api/books/getAllBooks.php',
        type: 'POST',
        dataType: 'json',
        data: {token: token},
        success: (data) => {

            if(data.books != null) {
                data.books.forEach(book => {
                    booksContainer.innerHTML += `

                    <div class="libro">
                            <div class="content" onclick='GetBookById(${book.id})'>
                                <h4 class="ellipse">${book.title}</h4>
                                <p class="ellipse">${book.author}</p>
                                <p class="ellipse">${book.category}</p>
                            </div>
                            <div class="actions">
                                <i class='bx bxs-heart' style="font-size: 27px; cursor: pointer;"' onclick=AddToFavourite(${book.id})></i>
                                <i class='bx bxs-book-add' style="font-size: 27px; cursor: pointer;" onclick=BorrowBook(${book.id})></i>
                            </div>
                    </div>
                    `;
                });
            } else {
                booksContainer.innerHTML = `

                <div class="libro">
                    <p>Nessun libro disponibile. <br/> Torna piu' tardi</p>
                </div>
                    `;
            }
        }
    });
}

function GetBookById(bookID) {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    //Get view modal content
    var container = body.querySelector("#modal-view");

    //pulisco il container
    container.innerHTML = "";

    //Invio richiesta
    $.ajax({
        url: '../api/books/getBookById.php',
        type: 'POST',
        dataType: 'json',
        data: {token: token, id: bookID},
        success: (data) => {
            //Creo dinamicamente l'html del Modal per la visualizzazione completa del libro
            container.innerHTML = `
            <i class='bx bx-x-circle' id="close-btn" onclick="CloseViewModal()"></i>
            
            <span>Titolo: ${data.book.title}</span>
            <span>Autore: ${data.book.author}</span>
            <span>ISBN: ${data.book.ISBN}</span>
            <span>Categoria: ${data.book.category}</span>
            <span>Anno di Pubblicazione: ${data.book.publishYear}</span>
            `;

            //apro il modal per la visualizzazione
            OpenViewModal();
        }
    });
}

function AddToFavourite(bookID) {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    //Get user id
    var user = JSON.parse(localStorage.getItem('user'));

    $.ajax({
        url: '../api/books/addBookToFavourites.php',
        type: "POST",
        dataType: 'json',
        data: {idBook: bookID, idUser: user.id, token: token},
        success: (data) => {
            if(data.status && data.code === 200) { //If status == true, possiamo aggiungere il libro ai preferiti
                ShowSnackBar(data.message);
            } else if (data.status && data.code !== 200) { //If status == true, ma code != 200, il libro e' gia tra i nostri preferiti
                ShowSnackBar(data.message);
            } else {
                ShowSnackBar(data.message);
            }
        }
    })
}

function DeleteFromFavourite(bookID) {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    //Get user id
    var user = JSON.parse(localStorage.getItem('user'));

    $.ajax({
        url: '../api/books/getBookById.php',
        type: 'POST',
        dataType: 'json',
        data: {token: token, id: bookID},
        success: (data) => {
            var text = `Vuoi davvero rimuovere dai preferiti ${data.book.title}? \n ISBN: ${data.book.ISBN} .`;

            if(confirm(text) == true) {
                $.ajax({
                    url: '../api/books/removeBookFromFavourite.php',
                    type: "POST",
                    dataType: 'json',
                    data: {idBook: bookID, idUser: user.id, token: token},
                    success: (data) => {
                        if(data.status && data.code === 200) {
                            ShowSnackBar(data.message);
                            setTimeout(() => {
                                location.reload();
                            }, 4000);
                        } else {
                            ShowSnackBar(data.message);
                        }
                    }
                })
            } else {
                return;
            }
        }
    });
}

function GetAllFavourites() {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    //Get user id
    var user = JSON.parse(localStorage.getItem('user'));

    //Get books container
    var booksContainer = body.querySelector("#libri");

    //pulisco il container
    booksContainer.innerHTML = "";

    //Invio richiesta
    $.ajax({
        url: '../api/books/getUserFavourites.php',
        type: "POST",
        dataType: 'json',
        data: {idUser: user.id, token: token},
        success: (data) => {
            if(data.books != null) {
                data.books.forEach(book => {
                    booksContainer.innerHTML += `

                    <div class="libro">
                            <div class="content" onclick='GetBookById(${book.id})'>
                                <h4 class="ellipse">${book.title}</h4>
                                <p class="ellipse">${book.author}</p>
                                <p class="ellipse">${book.category}</p>
                            </div>
                            <div class="actions">
                                <i class='bx bx-heart'  style='font-size: 27px; cursor: pointer;' onclick=DeleteFromFavourite(${book.id})></i>
                            </div>
                    </div>
                    `;
                });
            }
        }
    });
}

function GetAllBorrowedBooks() {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    //Get user id
    var user = JSON.parse(localStorage.getItem('user'));

    //Get books container
    var booksContainer = body.querySelector("#libri");

    //pulisco il container
    booksContainer.innerHTML = "";

    //Invio richiesta
    $.ajax({
        url: '../api/books/getUserBorrowedBooks.php',
        type: "POST",
        dataType: 'json',
        data: {idUser: user.id, token: token},
        success: (data) => {
            if(data.books != null) {
                data.books.forEach(book => {
                    booksContainer.innerHTML += `

                    <div class="libro">
                            <div class="content" onclick='GetBookById(${book.id})'>
                                <h4 class="ellipse">${book.title}</h4>
                                <p class="ellipse">${book.author}</p>
                                <p class="ellipse">${book.category}</p>
                            </div>
                            <div class="actions">
                            <i class='bx bx-archive-out' style='font-size: 27px; cursor: pointer;' onclick=ReturnBook(${book.id})></i>
                            </div>
                    </div>
                    `;
                });
            }
        }
    });
}

function BorrowBook(bookID) {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    //Get user id
    var user = JSON.parse(localStorage.getItem('user'));

    $.ajax({
        url: '../api/books/borrowBook.php',
        type: "POST",
        dataType: 'json',
        data: {idBook: bookID, idUser: user.id, token: token},
        success: (data) => {
            if(data.status && data.code === 200) { //If status == true, possiamo aggiungere il libro alla nostra libreria
                ShowSnackBar(data.message);
            } else if (data.status && data.code !== 200) { //If status == true, ma code != 200, il libro e' gia tra la nostra libreria
                ShowSnackBar(data.message);
            } else {
                ShowSnackBar(data.message);
            }
        }
    })
}

function ReturnBook(bookID) {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    //Get user id
    var user = JSON.parse(localStorage.getItem('user'));

    $.ajax({
        url: '../api/books/getBookById.php',
        type: 'POST',
        dataType: 'json',
        data: {token: token, id: bookID},
        success: (data) => {
            var text = `Vuoi davvero restituire ${data.book.title}? \n ISBN: ${data.book.ISBN} .`;

            if(confirm(text) == true) {
                $.ajax({
                    url: '../api/books/returnBorrowedBook.php',
                    type: "POST",
                    dataType: 'json',
                    data: {idBook: bookID, idUser: user.id, token: token},
                    success: (data) => {
                        if(data.status && data.code === 200) {
                            ShowSnackBar(data.message);
                            setTimeout(() => {
                                location.reload();
                            }, 4000);
                        } else {
                            ShowSnackBar(data.message);
                        }
                    }
                })
            } else {
                return;
            }
        }
    });
}

/* Home Books */

/* Modal */


function OpenViewModal() {
    checkOpenModals()

    document.getElementById('overlay-view').classList.add('is-visible');
    document.getElementById('modal-view').classList.add('is-visible');
    isViewModalOpen = true;
}


function CloseViewModal() {
    document.getElementById('overlay-view').classList.remove('is-visible');
    document.getElementById('modal-view').classList.remove('is-visible');
    isViewModalOpen = false;
}


function checkOpenModals() {
    if(isViewModalOpen) {
        CloseViewModal();
    } 
}

/* Modal */

/* SnackBar */

function ShowSnackBar(message) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerText = message;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

/* SnackBar */