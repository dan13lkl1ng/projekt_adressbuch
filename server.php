<?php
  $neueDaten=$_POST['neuedaten']; // neuedaten ist der POST Parameter der von Jquery im AJAX Aufruf Ć¼bergeben wird
   
  $myfile = fopen("database.json", "w") or die("Unable to open file!");// Die Datei JSONDaten.json wird komplett neu geschrieben
  var_dump($neueDaten);
  $data = $neueDaten;
  fwrite($myfile, $data);
  fclose($myfile);
  echo "Alles gespeichert!";
?>
