<?php

if(isset($_POST["name"]) && isset($_POST["message"]) && $_POST["name"] != "" && $_POST["message"] != ""){
      file_put_contents("message.txt", $_POST["name"] . "," . $_POST["message"] . "\n", FILE_APPEND);
      setcookie("user", $_POST["name"]);
}
header("Location: .");

?>