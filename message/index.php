<?php
  $user = "";
  $userfocus = "";
  $messagefocus = "";
  if(isset($_COOKIE["user"])){
    $user = $_COOKIE["user"];
    $messagefocus= "autofocus";
  }else{
    $userfocus = "autofocus";
  }
?>

<!DOCTYPE html>
<html>
  <head>
    <title>Leave a message</title>
    <link href="http://students.washington.edu/qingyf/favicon/me.png" type="image/png" rel="shortcut icon" />
    <link href="message.css" type="text/css" rel="stylesheet" />
  </head>
  <body>
    <h1>Leave a Message to Me :)</h1>
    <div id="message">
      <?php 
        $messages = file("message.txt", FILE_IGNORE_NEW_LINES);
        foreach($messages as $message){
          list($name, $word) = explode(",", $message); ?>
          <p><?= htmlspecialchars($name) ?> says: <?= htmlspecialchars($word) ?></p>
        <?php } ?>
    </div>

    <form action="message-save.php" method="post">
      <div>Name: <input value=<?= "\"" . $user . "\""?> name="name" type="text" size="8" <?= $userfocus ?> /></div>
      <div>Message: <input name="message" type="text" size="15" <?= $messagefocus ?> /></div>
      <div><p><input type="submit" value="Leave a Message" /></p></div>
    </form>
    <img src="http://students.washington.edu/qingyf/me.png" alt="sheep" style="position: fixed; right: 10px; bottom: 0px"/>
  </body>
</html>
