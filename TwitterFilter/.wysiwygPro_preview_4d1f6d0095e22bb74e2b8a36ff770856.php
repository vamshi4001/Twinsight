<?php
if ($_GET['randomId'] != "bbvBQVeYQXwz8mw5EzM6Lhdw0arUEGOpqCZD7dnuEUutXpxbw22ynXqsO4W4Ohcs") {
    echo "Access Denied";
    exit();
}

// display the HTML code:
echo stripslashes($_POST['wproPreviewHTML']);

?>  
