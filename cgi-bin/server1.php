<?php
$uuid = "";
$platform = "";
$retVal = "";
if (isset($_POST["uuid"])) {
  $uuid = $_POST["uuid"];
}
if (isset($_POST["platform"])) {
  $platform = $_POST["platform"];
}

print "UUID : $uuid :: PLATFORM : $platform";

?>