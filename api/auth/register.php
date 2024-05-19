<?php 
// include database and object files
include_once '../config.php';
include_once '../objects/user.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// prepare user object
$user = new User($db);


//set properties for user to be created
$user->name = isset($_POST['name']) ? $_POST['name'] : die();
$user->surname = isset($_POST['surname']) ? $_POST['surname'] : die();
$user->email = isset($_POST['email']) ? $_POST['email'] : die();
$user->password = isset($_POST['password']) ? $_POST['password'] : die();
$user->role = isset($_POST['role']) ? $_POST['role'] : die();

//create the user
if($user->signup()){
    $user_arr=array(
        "status" => true,
        "code" => 200,
        "message" => "Successfully Signed up!"
    );
} else {
    $user_arr=array(
        "status" => true,
        "code" => 300,
        "message" => "user already exists!"
    );
}
print_r(json_encode($user_arr));
?>