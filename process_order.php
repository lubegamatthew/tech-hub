<?php
header('Content-Type: application/json');

// Define response array
$response = ['success' => false, 'message' => '', 'errors' => [], 'order_id' => '', 'total' => 0];

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

// Get form data
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$email = trim($_POST['email'] ?? '');
$location = trim($_POST['location'] ?? '');
$order_id = trim($_POST['order_id'] ?? '');
$total = trim($_POST['total'] ?? '');
$cart_items_json = $_POST['cart_items'] ?? '[]';

// Validation errors
$errors = [];

// Validate name
if (empty($name)) {
    $errors['name'] = 'Please enter your name';
} elseif (strlen($name) < 2) {
    $errors['name'] = 'Name must be at least 2 characters long';
}

// Validate phone
if (empty($phone)) {
    $errors['phone'] = 'Please enter your phone number';
} elseif (!preg_match('/^\d{10,}$/', $phone)) {
    $errors['phone'] = 'Phone number must be at least 10 digits';
}

// Validate email
if (empty($email)) {
    $errors['email'] = 'Please enter your email address';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address';
}

// Validate location
if (empty($location)) {
    $errors['location'] = 'Please enter your delivery location';
} elseif (strlen($location) < 5) {
    $errors['location'] = 'Location must be at least 5 characters long';
}

// If there are validation errors
if (!empty($errors)) {
    $response['message'] = 'Validation failed';
    $response['errors'] = $errors;
    echo json_encode($response);
    exit;
}

// Parse cart items
$cart_items = json_decode($cart_items_json, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    $cart_items = [];
}

// Prepare order data
$order_data = [
    'order_id' => $order_id,
    'customer_name' => $name,
    'customer_phone' => $phone,
    'customer_email' => $email,
    'delivery_location' => $location,
    'total_amount' => $total,
    'cart_items' => $cart_items,
    'order_date' => date('Y-m-d H:i:s'),
    'status' => 'pending'
];

// Save order to file (or you can use a database)
$orders_file = 'orders.json';
$existing_orders = [];

if (file_exists($orders_file)) {
    $existing_content = file_get_contents($orders_file);
    $existing_orders = json_decode($existing_content, true) ?? [];
}

$existing_orders[] = $order_data;
file_put_contents($orders_file, json_encode($existing_orders, JSON_PRETTY_PRINT));

// Send confirmation email (optional, commented out for safety)
/*
$to = $email;
$subject = 'Order Confirmation - ' . $order_id;
$message = "Thank you for your order!\n\n";
$message .= "Order ID: " . $order_id . "\n";
$message .= "Total: UGX " . number_format($total) . "\n";
$message .= "Delivery Location: " . $location . "\n\n";
$message .= "Items:\n";
foreach ($cart_items as $item) {
    $message .= "- " . $item['name'] . " x " . $item['quantity'] . " = UGX " . number_format($item['price'] * $item['quantity']) . "\n";
}
$headers = 'From: noreply@' . $_SERVER['HTTP_HOST'];
@mail($to, $subject, $message, $headers);
*/

// Success response
$response['success'] = true;
$response['message'] = 'Order placed successfully';
$response['order_id'] = $order_id;
$response['total'] = (float)$total;

echo json_encode($response);
?>