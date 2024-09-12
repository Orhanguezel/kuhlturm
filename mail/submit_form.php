<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'error' => 'Geçersiz JSON girişi']);
        exit;
    }

    $namesurname = $data['namesurname'];
    $email = $data['email'];
    $telefon = $data['telefon'];
    $message = $data['message'];

    $mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.your-email-provider.com'; // SMTP sunucu adresi (örneğin smtp.gmail.com)
        $mail->SMTPAuth = true;
        $mail->Username = 'ensotek@ensotek.com.tr'; // SMTP kullanıcı adı
        $mail->Password = 'your_password'; // SMTP şifresi
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587; // SMTP portu

        //Recipients
        $mail->setFrom('ensotek@ensotek.com.tr', 'Ensotek Mailer');
        $mail->addAddress('ensotek@ensotek.com.tr', 'Ensotek'); // Alıcı adresi ve adı

        //Content
        $mail->isHTML(true);
        $mail->Subject = 'Neue Nachricht von ' . $namesurname;
        $mail->Body    = "Name: $namesurname<br>E-Mail: $email<br>Telefon: $telefon<br>Nachricht:<br>$message";
        $mail->AltBody = "Name: $namesurname\nE-Mail: $email\nTelefon: $telefon\nNachricht:\n$message";

        $mail->send();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Yalnızca POST istekleri kabul edilir']);
}
?>
