<?php

// Start the session
session_start();

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "user_db";

// Create database connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// -----------------------------------------------------------
// Main logic: Handle user authentication and display content
// -----------------------------------------------------------

// Check if a user is already logged in
if (isset($_SESSION['email'])) {
    echo "<h2>Welcome, " . htmlspecialchars($_SESSION['email']) . "!</h2>";
    echo '<a href="?logout=true">Logout</a>';

    // Handle logout request
    if (isset($_GET['logout'])) {
        session_destroy();
        header("Location: login.html");
        exit();
    }
} else {
    // If not logged in, handle the login attempt
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        // Prepare and execute a safe SQL query
        // IMPORTANT: The original code is vulnerable to SQL injection. 
        // This is a corrected example using prepared statements.
        $sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($result && mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);

            // Verify the password
            if (!isset($row['password'])) {
                die("Error: 'password' column is missing in your database table. Please check table structure.");
            }

            if (password_verify($password, $row['password'])) {
                $_SESSION['email'] = $email;
                header("Location: index.php");
                exit();
            } else {
                echo "<p style='color:red;'>Invalid password</p>";
            }
        } else {
            echo "<p style='color:red;'>No user found with that email</p>";
        }
    } else {
        // If no POST request, redirect to the login page
        header("Location: login.html");
        exit();
    }
}

// -----------------------------------------------------------
// Example of adding a new user (for demonstration purposes)
// -----------------------------------------------------------

// Hash the password
$hashedPassword = password_hash("Ivan", PASSWORD_DEFAULT);

// Check if a user with that email already exists before inserting
$check_sql = "SELECT email FROM users WHERE email = 'ivan@gmail.com' LIMIT 1";
$check_result = mysqli_query($conn, $check_sql);

if (mysqli_num_rows($check_result) == 0) {
    // Insert the new user if they don't exist
    $insert_sql = "INSERT INTO users (email, password) VALUES ('ivan@gmail.com', '$hashedPassword')";
    mysqli_query($conn, $insert_sql);
}

// Close the database connection
mysqli_close($conn);
?>