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

ob_start();
$link = mysql_connect ("localhost","mudbream_malherb","") or die ('I cannot connect to the database because: ' . mysql_error());
mysql_select_db("bnikzn");

// Now that we are passing through the uuid and platform we need to enter this into the user table (insert)
// and then get all the data we need to send back...
$lastupdate = "";
list ($lastupdate) = mysql_fetch_row(mysql_query("select lastupdate from user where uuid='$uuid'"));
if ($lastupdate != "") {   // TODO - change this to !=
  // since the user is already in the db we need to get the timestamp of last update
  // we then use this timestamp and pull out all rows that have an updated timestamp of later than user timestamp
  $sql = "insert into user set uuid = '$uuid', platform = '$platform'";
  mysql_query($sql);
  // now we need to prepare the full data to return...

  $sql = mysql_query("select * from chapter where lastupdate > '$lastupdate'");
  $retVal .= "var chapters = [\n";
  while (list($id, $chaptername, $venue, $city, $area, $meetingday, $meetingtime) = mysql_fetch_row($sql)) {
    $retVal .= "{'id': $id, 'chaptername': '$chaptername', 'venue': '$venue', 'city': '$city', 'area': '$area', 'meetingday': '$meetingday', 'meetingtime': '$meetingtime'},\n";
  }
  $retVal .= "];\n";
  $retVal .= "addChapterData(tx, chapters);\n";

  $sql = mysql_query("select * from member where lastupdate > '$lastupdate'");
  $retVal .= "var members = [\n";
  while (list($id, $name, $company, $phone, $mobile, $website, $address, $chapterId ) = mysql_fetch_row($sql)) {
    $retVal .= "{'id': $id, 'name': '$name', 'chapterId': $chapterId, 'company': '$company', 'phone': '$phone', 'mobile': '$mobile', 'website': '$website', 'address': '$address'},\n";
  }
  $retVal .= "];\n";
  $retVal .= "addMemberData(tx, members);\n";

  $sql = mysql_query("select * from keyword where lastupdate > '$lastupdate'");
  $retVal .= "var keywords = [\n";
  while (list($id, $keyword) = mysql_fetch_row($sql)) {
    $retVal .= "{'id': $id, 'keyword': '$keyword'},\n";
  }
  $retVal .= "];\n";
  $retVal .= "addKeywordData(tx, keywords);\n";

  $sql = mysql_query("select * from keywordmember where lastupdate > '$lastupdate'");
  $retVal .= "var keywordmembers = [\n";
  while (list($id, $keyid, $memberid) = mysql_fetch_row($sql)) {
    $retVal .= "{'id': $id, 'keyid': '$keyid', 'memberid': '$memberid'},\n";
  }
  $retVal .= "];\n";
  $retVal .= "addKeywordMemberData(tx, keywordmembers);\n";

  // and now update the user with the latest timestamp
  $sql = "update user set uuid = '$uuid', platform = '$platform' where uuid = '$uuid'";
  mysql_query($sql);
}
else {
  $sql = "insert into user set uuid = '$uuid', platform = '$platform'";
  mysql_query($sql);
  // now we need to prepare the full data to return...

  $sql = mysql_query("select * from chapter");
  $retVal .= "var chapters = [\n";
  while (list($id, $chaptername, $venue, $city, $area, $meetingday, $meetingtime) = mysql_fetch_row($sql)) {
    $retVal .= "{'id': $id, 'chaptername': '$chaptername', 'venue': '$venue', 'city': '$city', 'area': '$area', 'meetingday': '$meetingday', 'meetingtime': '$meetingtime'},\n";
  }
  $retVal .= "];\n";
  $retVal .= "addChapterData(tx, chapters);\n";

  $sql = mysql_query("select * from member");
  $retVal .= "var members = [\n";
  while (list($id, $name, $company, $phone, $mobile, $website, $address, $chapterId ) = mysql_fetch_row($sql)) {
    $retVal .= "{'id': $id, 'name': '$name', 'chapterId': $chapterId, 'company': '$company', 'phone': '$phone', 'mobile': '$mobile', 'website': '$website', 'address': '$address'},\n";
  }
  $retVal .= "];\n";
  $retVal .= "addMemberData(tx, members);\n";

  $sql = mysql_query("select * from keyword");
  $retVal .= "var keywords = [\n";
  while (list($id, $keyword) = mysql_fetch_row($sql)) {
    $retVal .= "{'id': $id, 'keyword': '$keyword'},\n";
  }
  $retVal .= "];\n";
  $retVal .= "addKeywordData(tx, keywords);\n";

  $sql = mysql_query("select * from keywordmember");
  $retVal .= "var keywordmembers = [\n";
  while (list($id, $keyid, $memberid) = mysql_fetch_row($sql)) {
    $retVal .= "{'id': $id, 'keyid': '$keyid', 'memberid': '$memberid'},\n";
  }
  $retVal .= "];\n";
  $retVal .= "addKeywordMemberData(tx, keywordmembers);\n";

}
print mysql_error();

// user is inserted into db - now need to generate full table data to return...

print $retVal;


?>