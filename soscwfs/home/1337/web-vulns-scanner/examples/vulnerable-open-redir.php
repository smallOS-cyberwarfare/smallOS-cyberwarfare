<?php
$redirect = $_GET["url"];  header("Location: " . $redirect);
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Open Redirect Vulnerable Page</title>
</head>
<body>
Open Redir (get url)
<!-- http://localhost:8080/vulnerable-open-redir.php?url=https://google.com -->
</body>
</html>
