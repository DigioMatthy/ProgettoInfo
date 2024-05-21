const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");


//State variables
var isViewModalOpen = false,
    isAddModalOpen = false,
    isEditModalOpen = false;


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

/* Books API */
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
            data.books.forEach(book => {
                booksContainer.innerHTML += `
                <div class="containercards">
                    <div class="libro" >
                        <div class="content" onclick='GetBookById(${book.id})'>
                            <h4 class="ellipse">${book.title}</h4>
                            <p class="ellipse">${book.author}</p>
                            <p class="ellipse">${book.category}</p>
                        </div>
                        <div class="actions">
                            <i class='bx bxs-edit' style="font-size: 35px; cursor: pointer;" onclick=OpenEditModal(${book.id})></i>
                            <i class='bx bx-trash' style="font-size: 35px; cursor: pointer;" onclick='DeleteBook(${book.id}, "${book.title}", "${book.ISBN}")'></i>
                        </div>
                    </div>
                </div> 
                `;
            });

            booksContainer.innerHTML += `
            <div class="containercards">
                <div class="addLibro">
                    <div class="content">
                        <h4>Aggiungi libro</h4>
                    </div>
                    <div class="add" onclick='OpenAddModal()'>
                        <i class='bx bx-plus-circle' style="font-size: 100px; cursor: pointer;"></i>
                    </div>
                </div>
            </div>
        `;
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

function AddBook() {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    //Get form values
    var title = body.querySelector("#title").value;
    var author = body.querySelector("#author").value;
    var ISBN = body.querySelector("#isbn").value;
    var category = body.querySelector("#category").value;
    var year = body.querySelector("#year").value;

    var newBook = {
        "title": title,
        "author": author,
        "ISBN": ISBN,
        "category": category,
        "year": year,
        "token": token
    };

    $.ajax({
        url: '../api/books/addBook.php',
        type: "POST",
        dataType: 'json',
        data: newBook,
        success: (data) => {
            if(data.status || data.code === 200) {
                console.log(data.message);
                ShowSnackBar(data.message);

                setTimeout(() => {
                    location.reload();
                }, 4000);
            } else {
                ShowSnackBar(data.message);
            }
        }
    })
}

function EditBook() {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    var bookID = document.getElementById('modal-edit').dataset.bookId;
    var title = body.querySelector("#titleEdit").value;
    var author = body.querySelector("#authorEdit").value;
    var ISBN = body.querySelector("#isbnEdit").value;
    var category = body.querySelector("#categoryEdit").value;
    var year = body.querySelector("#yearEdit").value;

    
    var editBook = {
        "id": bookID,
        "title": title,
        "author": author,
        "ISBN": ISBN,
        "category": category,
        "year": year,
        "token": token
    };

    $.ajax({
        url: '../api/books/editBook.php',
        type: "POST",
        dataType: 'json',
        data: editBook,
        success: (data) => {
            if(data.status || data.code === 200) {
                console.log(data.message);
                ShowSnackBar(data.message);

                setTimeout(() => {
                    location.reload();
                }, 4000);
            } else {
                ShowSnackBar(data.message);
            }
        }
    })
}

function DeleteBook(id, title, isbn) {
    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    var text = `Vuoi davvero eliminare ${title}? \n ISBN: ${isbn} .`;

    if(confirm(text) == true) {
        $.ajax({
            url: '../api/books/deleteBook.php',
            type: "POST",
            dataType: 'json',
            data: {id: id, token: token},
            success: (data) => {
                if(data.status || data.code === 200) {
                    console.log(data.message);
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

/* Books API */

/* Modal */

function OpenAddModal() {
    checkOpenModals()

    document.getElementById('overlay-add').classList.add('is-visible');
    document.getElementById('modal-add').classList.add('is-visible');
    isAddModalOpen = true;
}

function CloseAddModal() {
    document.getElementById('overlay-add').classList.remove('is-visible');
    document.getElementById('modal-add').classList.remove('is-visible');
    isAddModalOpen = false;
}

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

function OpenEditModal(bookID) {
    checkOpenModals()

    //Get API token from localStorage
    var token = localStorage.getItem('apiToken');

    $.ajax({
        url: '../api/books/getBookById.php',
        type: 'POST',
        dataType: 'json',
        data: {token: token, id: bookID},
        success: (data) => {
            
            var book = data.book;

            //Inserire i valori del libro corrente nel form
            var title = body.querySelector("#titleEdit").value = book.title;
            var author = body.querySelector("#authorEdit").value = book.author;
            var ISBN = body.querySelector("#isbnEdit").value = book.ISBN;
            var category = body.querySelector("#categoryEdit").value = book.category;
            var year = body.querySelector("#yearEdit").value = book.publishYear;

            //Passare id
            var modal = document.getElementById('modal-edit');
            modal.dataset.bookId = book.id;


            document.getElementById('overlay-edit').classList.add('is-visible');
            modal.classList.add('is-visible');
            isEditModalOpen = true;
        }
    });

    
}


function CloseEditModal() {
    document.getElementById('overlay-edit').classList.remove('is-visible');
    document.getElementById('modal-edit').classList.remove('is-visible');
    isEditModalOpen = false;
}

function checkOpenModals() {
    if(isViewModalOpen) {
        CloseViewModal();
    } else if(isAddModalOpen) {
        CloseAddModal();
    } else if (isEditModalOpen) {
        CloseEditModal()
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