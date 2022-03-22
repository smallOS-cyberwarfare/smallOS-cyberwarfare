<?php
$user = $_GET["user"];
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Reflected XSS Vulnerable Page</title>
</head>
<body>
Reflected XSS (get url)<br />
<?php
echo "<div>$user</div>";
?>
<!-- http://localhost:8080/vulnerable-reflected-xss.php?user=StringManolo -->
</body>
</html>
