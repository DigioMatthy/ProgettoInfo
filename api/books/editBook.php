<?php 
// include database and object files
include_once '../config.php';
include_once '../objects/book.php';

//Start session 
session_start();

//get db connection
$database = new Database();
$db = $database->getConnection();

//prepare book object
$book = new Book($db);


//Get api token
$token = isset($_POST['token']) ? $_POST['token'] : die();

//Set properties for new book
$book->id = isset($_POST['id']) ? $_POST['id'] : die();
$book->title = isset($_POST['title']) ? $_POST['title'] : die();
$book->author = isset($_POST['author']) ? $_POST['author'] : die();
$book->ISBN = isset($_POST['ISBN']) ? $_POST['ISBN'] : die();
$book->category = isset($_POST['category']) ? $_POST['category'] : die();
$book->publishYear = isset($_POST['year']) ? $_POST['year'] : die();

if($token == $_SESSION['apiToken']) {
    if($book->editBook()) {
        $res = array(
            "status" => true,
            "code" => 200,
            "message"=>"Libro modificato con successo!"
        );
    } else {
        $res = array(
            "status" => false,
            "code" => 403,
            "message"=>"Libro inesistente"
        );
    }
} else {
    $res = array(
        "status"=> false,
        "code"=> 300,
        "message"=> "Non Autorizzato"
    );
}
print_r(json_encode($res));

?>