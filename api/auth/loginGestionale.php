<?php 
// include database and object files
include_once '../config.php';
include_once '../objects/user.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare user object
$user = new User($db);

//get properties for user to be logged in
$user->email = isset($_POST['email']) ? $_POST['email'] : die();
$user->password = isset($_POST['password']) ? $_POST['password'] : die();

$response = $user->loginGestionale();

if($response['status']){
    // get retrieved row
    $row = $response['rows'];

    //Start session if user is found
    session_start();

    //Create token for API
    $now = new DateTime();
    $token = base64_encode($row['name'].$row['email'].$row['codRole'].$now->getTimestamp());

    //set the current token to the session
    $_SESSION['apiToken'] = $token;

    // create array
    $user_arr=array(
        "status" => true,
        "code" => 200,
        "message" => "Successfully Login!",
        "id" => $row['id'],
        "name" => $row['name'],
        "email" => $row['email'],
        "role" => $row['codRole'],
        "token" => $token  //return token
    );
}
else{
    $user_arr=array(
        "status" => false,
        "code" => 404,
        "message" => "Invalid Username or Password! User not or unauthorized",
    );
}
// make it json format
print_r(json_encode($user_arr));
?>