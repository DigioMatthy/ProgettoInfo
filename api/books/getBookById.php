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

//Set id to book object
$book->id = isset($_POST['id']) ? $_POST['id'] : die();

if($token == $_SESSION['apiToken']) {
    //Get all books if valid token is provided

    $response = $book->getBookById();

    if($response['status']) {
        $res = array(
            "status"=> true,
            "code"=> 200,
            "message"=> "Book successfully retrieved",
            "book"=> $response['row']
        );
    } else {
        $res = array(
            "status"=> false,
            "code"=> 400,
            "message"=> "Could not retrieve book. Probably id does not exists",
            "book"=> null
        );
    }
} else {
    $res = array(
        "status"=> false,
        "code"=> 300,
        "message"=> "unauthorized",
        "book"=> null
    );
}

print_r(json_encode($res));

?>