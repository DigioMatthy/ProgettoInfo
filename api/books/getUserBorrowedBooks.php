<?php 
// include database and object files
include_once '../config.php';
include_once '../objects/book.php';

//Start session 
session_start();

//get db connection
$database = new Database();
$db = $database->getConnection();

//Get api token
$token = isset($_POST['token']) ? $_POST['token'] : die();
$userID = isset($_POST['idUser']) ? $_POST['idUser'] : die();

//prepare book object
$book = new Book($db);

if($token == $_SESSION['apiToken']) {
    //Get all favourites if valid token is provided

    $response = $book->GetAllBorrowedBooks($userID);

    if($response['status']) {
        $res = array(
            "status"=> true,
            "code"=> 200,
            "message"=> "Books successfully retrieved",
            "books"=> $response['rows']
        );
    } else {
        $res = array(
            "status"=> false,
            "code"=> 400,
            "message"=> "Could not retrieve books",
            "books"=> null
        );
    }
} else {
    $res = array(
        "status"=> false,
        "code"=> 300,
        "message"=> "unauthorized",
        "books"=> null
    );
}

print_r(json_encode($res));
?>