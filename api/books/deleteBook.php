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

//Set id to delete
$book->id = isset($_POST['id']) ? $_POST['id'] : die();

if($token == $_SESSION['apiToken']) {

    if($book->deleteBook()) {
        $res = array(
            "status" => true,
            "code" => 200,
            "message"=>"Libro eliminato con successo!"
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
        "message"=> "Non Autorizzato",
        "book"=> null
    );
}
print_r(json_encode($res));

?>