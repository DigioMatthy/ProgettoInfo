<?php 

    class Book {

        // connessione e nome della tabella
        private $conn;
        private $table_name = 'book';

        // proprieta' dell'oggetto
        public $id;
        public $title;
        public $author;
        public $ISBN;
        public $category;
        public $publishYear;

        // costruttore con $db per connessione
        public function __construct($db) {
            $this->conn = $db;
        }

        //Retrieves all books from the database
        function getAll() {
            $query = "SELECT * FROM ". $this->table_name;

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            //execute query
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                //Get rows 
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // generate response - success
                $res = array(
                    "status"=> true,
                    "rows"=> $rows
                );
            } else {
                // generate response - failed
                $res = array(
                    "status"=> false,
                    "rows"=> null 
                );
            }

            return $res;
        }

        //Retreives book by id from the database
        function getBookById() {
            //Check if book exists
            if(!$this->isAlreadyExistsById()){
                return false;
            }

            $query = "SELECT * FROM " . $this->table_name . " WHERE id='".$this->id."'";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // execute query
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                //Get row 
                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                // generate response - success
                $res = array(
                    "status"=> true,
                    "row"=> $row
                );
            } else {
                // generate response - failed
                $res = array(
                    "status"=> false,
                    "row"=> null 
                );
            }
            
            return $res;
        }

        function createBook(){
            //Check if book exists
            if($this->isAlreadyExists()){
                return false;
            }

            // query to insert record of new user signup
            $query = "INSERT INTO
                        " . $this->table_name . "
                    SET
                        title=:title, author=:author, ISBN=:isbn, category=:category, publishYear=:year";

            // prepare query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->title=htmlspecialchars(strip_tags($this->title));
            $this->author=htmlspecialchars(strip_tags($this->author));
            $this->ISBN=htmlspecialchars(strip_tags($this->ISBN));
            $this->category=htmlspecialchars(strip_tags($this->category));
            $this->publishYear=htmlspecialchars(strip_tags($this->publishYear));

            // bind values
            $stmt->bindParam(":title", $this->title);
            $stmt->bindParam(":author", $this->author);
            $stmt->bindParam(":isbn", $this->ISBN);
            $stmt->bindParam(":category", $this->category);
            $stmt->bindParam(":year", $this->publishYear);

            // execute query
            if($stmt->execute()){
                $this->id = $this->conn->lastInsertId();
                return true;
            }
        
            return false;

        }

        function deleteBook(){
            //Check if book exists
            if($this->isAlreadyExistsById()){
                $query = "DELETE FROM " . $this->table_name . " WHERE id='".$this->id."'";

                // prepare query statement
                $stmt = $this->conn->prepare($query);

                // execute query
                $stmt->execute();

                if($stmt->rowCount() > 0) {
                    // generate response - success
                    return true;
                } else {
                    // generate response - failed
                    return false;
                }

            } else {
                return false;
            }

            return false;
        }

        function editBook() {
            if($this->isAlreadyExistsById()) {
                $query = "UPDATE " . $this->table_name . " SET title=:title, author=:author, ISBN=:isbn, category=:category, publishYear=:year WHERE id='".$this->id."'";

                // prepare query
                $stmt = $this->conn->prepare($query);

                // sanitize
                $this->id=htmlspecialchars(strip_tags($this->id));
                $this->title=htmlspecialchars(strip_tags($this->title));
                $this->author=htmlspecialchars(strip_tags($this->author));
                $this->ISBN=htmlspecialchars(strip_tags($this->ISBN));
                $this->category=htmlspecialchars(strip_tags($this->category));
                $this->publishYear=htmlspecialchars(strip_tags($this->publishYear));

                // bind values
                $stmt->bindParam(":title", $this->title);
                $stmt->bindParam(":author", $this->author);
                $stmt->bindParam(":isbn", $this->ISBN);
                $stmt->bindParam(":category", $this->category);
                $stmt->bindParam(":year", $this->publishYear);

                // execute query
                if($stmt->execute()){
                    return true;
                }
            
            } else{
                return false;
            }
            
            return false;
        }


        //Cheks if the book exists
        function isAlreadyExists() {
            $query = "SELECT *
            FROM
                " . $this->table_name . " 
            WHERE
                ISBN='".$this->ISBN."'";
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

         //Cheks if the book exists by id
         function isAlreadyExistsById() {
            $query = "SELECT *
            FROM
                " . $this->table_name . " 
            WHERE
                id='".$this->id."'";
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

?>