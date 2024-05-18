<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LoginPage</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="resources/style.css">
</head>

<body>
    <div class="bibliotech">
        <img src="resources/logo.png" alt="logo" width=100px>
        <h1>Bibliotech</h1>
    </div>
    <div class="container">
        <div class="row justify-content-between">
            <div class="col-md-5">
                <div class="card cont">
                    <div class="card-header">Accedi:</div>
                    <div class="card-body">
                        <form action="login.php" method="POST">
                            <div class="form-group">
                                <label for="username">Email</label>
                                <input type="text" name="username" id="username" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" name="password" id="password" class="form-control">
                            </div>
                            <button type="submit" class="btn btn-primary">Login</button>
                            <button type="reset" class="btn btn-primary">Reset</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="card cont">
                    <div class="card-header">Registrati:</div>
                    <div class="card-body">
                        <form action="login.php" method="POST">
                            <div class="form-group">
                                <label for="nome">Nome</label>
                                <input type="text" name="nome" id="nome" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="cognome">Cognome</label>
                                <input type="text" name="cognome" id="cognome" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" name="email" id="email" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" name="password" id="password" class="form-control">
                            </div>
                            <button type="submit" class="btn btn-primary">Registrati</button>
                            <button type="reset" class="btn btn-primary">Reset</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
                
    <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if (isset($_POST["username"]) && isset($_POST["password"])) {
                $servername = "localhost";
                $username = "root";
                $password = "";
                $dbname = "bibliotech";


                $conn = new mysqli($servername, $username, $password, $dbname);
                if ($conn->connect_error) {
                    die("Connessione fallita: " . $conn->connect_error);
                }
                $email = $_POST["email"];
                $password = $_POST["password"];

                $sql = "INSERT INTO utente (email, pw) VALUES (?,?)";
                $stmt = $conn->prepare($sql);
        
                    $stmt->bind_param($email, $password);
                    $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "Login avvenuto con successo!";
                } else {
                    echo "Errore durante il Login, Riprovare!: " . $conn->error;
                }

                $conn->close();
            } else {
                echo "Si prega di compilare tutti i campi.";
            }
        }
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if (isset($_POST["username"]) && isset($_POST["password"])) {
                $servername = "localhost";
                $username = "root";
                $password = "";
                $dbname = "bibliotech";


                $conn = new mysqli($servername, $username, $password, $dbname);
                if ($conn->connect_error) {
                    die("Connessione fallita: " . $conn->connect_error);
                }
                $nome = $_POST["nome"];
                $cognome = $_POST["cognome"];
                $email = $_POST["email"];
                $password = $_POST["password"];

                $sql = "INSERT INTO utente (nome, cognome, email, pw) VALUES (?,?,?,?)";
                $stmt = $conn->prepare($sql);
        
                    $stmt->bind_param($nome, $cognome, $email, $password);
                    $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "Registrazione avvenuta con successo!";
                } else {
                    echo "Errore durante la registrazione: " . $conn->error;
                }

                $conn->close();
            } else {
                echo "Si prega di compilare tutti i campi.";
            }
        }
    ?>
</body> 
</html>