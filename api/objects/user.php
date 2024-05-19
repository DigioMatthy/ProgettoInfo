<?php

class User{
 
    // connessione e nome della tabella
    private $conn;
    private $table_name = "users";
 
    // object properties
    public $id;
    public $name;
    public $surname;
    public $email;
    public $password;
    public $role;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    //user signup method
    function signup(){
    
        if($this->isAlreadyExist()){
            return false;
        }

        // query to insert record of new user signup
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    name=:name, surname=:surname, email=:email, password=:password, codRole=:role";
    
        // prepare query
        $stmt = $this->conn->prepare($query);
    
        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->surname=htmlspecialchars(strip_tags($this->surname));
        $this->email=htmlspecialchars(strip_tags($this->email));
        $this->password=htmlspecialchars(strip_tags($this->password));

        //Hash password
        $hashedPassword = password_hash($this->password, PASSWORD_DEFAULT);
    
        // bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":surname", $this->surname);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $hashedPassword);
        $stmt->bindParam(":role", $this->role); // 1 if admin, 2 if client
    
        // execute query
        if($stmt->execute()){
            $this->id = $this->conn->lastInsertId();
            return true;
        }
    
        return false;
        
    }

    // login user method
    function login(){
        // select all query with user inputed username and password
        $query = "SELECT
                    `id`, `name`, `surname`, `password`, `email`, `codRole`
                FROM
                    " . $this->table_name . " 
                WHERE
                    email='".$this->email."' AND codRole='2'";
        // prepare query statement
        $stmt = $this->conn->prepare($query);
        // execute query
        $stmt->execute();

        //check if the password is correct
        $rows = $stmt->fetch(PDO::FETCH_ASSOC);

        if(password_verify($this->password, $rows['password'])) {
            $res = array(
                "status"=> true,
                "rows"=> $rows
            );
        } else {
            $res = array(
                "status"=> false,
                "rows"=> null
            );
        }

        return $res;
    }

    //login use method for CMS 
    function loginGestionale(){
        // select all query with user inputed username and password
        $query = "SELECT
        `id`, `name`, `surname`, `password`, `email`, `codRole`
        FROM
        " . $this->table_name . " 
        WHERE
        email='".$this->email."' AND codRole='1'";
        // prepare query statement
        $stmt = $this->conn->prepare($query);
        // execute query
        $stmt->execute();

        //check if the password is correct
        $rows = $stmt->fetch(PDO::FETCH_ASSOC);

        if(password_verify($this->password, $rows['password'])) {
            $res = array(
                "status"=> true,
                "rows"=> $rows
            );
        } else {
            $res = array(
                "status"=> false,
                "rows"=> null
            );
        }

        return $res;
    }

    //Notify if User with given username Already exists during SignUp
    function isAlreadyExist(){
        $query = "SELECT *
            FROM
                " . $this->table_name . " 
            WHERE
                email='".$this->email."'";
        // prepare query statement
        $stmt = $this->conn->prepare($query);
        // execute query
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        else{
            return false;
        }
    }
}