<?php

$conn = mysqli_connect("localhost", "root", "", "test");

if (!$conn) {
    die("Couldn't connect to the database");
}

$email = mysqli_real_escape_string($conn, $_POST["email"]);

if (!empty($email) && isset($email)) {

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        //Check if the user selected images;

        $array = array();
        $files = $_FILES["file"]["name"];


        for ($i = 0; $i < count($files); $i++) {
            $file_name = $files[$i];

            if ($file_name == "") {
                continue;
            } else {
                array_push($array, $files[$i]);
            }
        }

        if (count($array) > 0) {

            //let us save them and share a link

            $link = substr(md5(time() . $email), 0, 5);
            $sql = "INSERT INTO files(name, email, link)VALUES";
            $values = "";
            $sent_files = "";
            for ($i = 0; $i < count($files); $i++) {
                $name = $files[$i];
                $tmp_file = $_FILES["file"]["tmp_name"][$i];

                if ($i != count($files) - 1) {
                    $values .= "('{$name}', '{$email}', '{$link}'),";
                } else {
                    $values .= "('{$name}', '{$email}', '{$link}')";
                }
                $sent_files .= "\n{$name}";
                move_uploaded_file($tmp_file, "uploads/" . $name);
            }


            if (mysqli_query($conn, $sql . $values)) {

                //If they are stored on the table
                $subject = "You received new Files";
                $to = $email;
                $header = "From:team@hlaakworld.com";
                $body = "Dear {$email}\n\nYou have received files from someone \n\nfiles:{$sent_files}\nTo open them please follow the link : http://localhost/share/{$link}\n\nPlease Subscribe to my channel";

                if (mail($to, $subject, $body, $header)) {
                    $array = array(array("response" => "success", "link" => "http://localhost/share/{$link}"));
                    echo json_encode($array);
                }
            } else {
                echo "Failed to save data to server" . mysqli_error($conn);
                exit();
            }
        } else {
            echo "You didn't select files";
        }
    } else {
        echo $email . "-  is not a valid email address";
    }
} else {
    echo "Please provide an email address of a recipient";
}
