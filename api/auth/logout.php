<?php 

// include database and object files
include_once '../config.php';

//Start session 
session_start();

// get database connection
$database = new Database();
$db = $database->getConnection();

//Get api token
$token = isset($_POST['token']) ? $_POST['token'] : die();

if($token == $_SESSION['apiToken']){
    $params = session_get_cookie_params();
    setcookie(session_name(), '', 0, $params['path'], $params['domain'], $params['secure'], isset($params['httponly']));

    session_unset();
    session_destroy();

    //Create response
    $response = array(
        "status" => true,
        "code" => 200,
        "message" => "Logout effettuato con successo!",
    );

} else {
    //Create response
    $response = array(
        "status" => false,
        "code" => 300,
        "message" => "Token API Invalido!"
    );
}
print_r(json_encode($response));

?>