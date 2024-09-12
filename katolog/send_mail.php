<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$company = $data['company'];
$contact = $data['contact'];
$position = $data['position'];
$email = $data['email'];
$phone = $data['phone'];
$address = $data['address'] ?? '';
$requestType = $data['requestType'] ?? '';

$body = "<b>Firma:</b> $company<br><b>Yetkili:</b> $contact<br><b>Görevi:</b> $position<br><b>E-Posta:</b> $email<br><b>Telefon:</b> $phone<br><b>Adres:</b> $address<br>";

if ($requestType == 'newTower') {
    $body .= "<b>Kulenin Kullanılacağı Proses:</b> {$data['process']}<br>
              <b>Kulenin Kurulacağı İl:</b> {$data['city']}<br>
              <b>Kulenin Kurulacağı İlçe:</b> {$data['district']}<br>
              <b>Saatlik Su Debisi:</b> {$data['waterFlow']}<br>
              <b>Giriş Sıcaklığı:</b> {$data['inletTemp']}<br>
              <b>Çıkış Sıcaklığı:</b> {$data['outletTemp']}<br>
              <b>Yaş Termometre Değeri:</b> {$data['wetBulbTemp']}<br>
              <b>Kapasite:</b> {$data['capacity']}<br>
              <b>Su Kalitesi:</b> {$data['waterQuality']}<br>
              <b>Havuz:</b> {$data['pool']}<br>
              <b>Kulenin Konulacağı Yer:</b> {$data['location']}<br>
              <b>Mevcut Kule Var mı:</b> {$data['existingTower']}<br>
              <b>Bizi Nereden Tanıyorsunuz:</b> {$data['howYouKnow']}<br>";
}

$mail = new PHPMailer(true);
try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.your-email-provider.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'your-email@example.com';
    $mail->Password = 'your-email-password';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Recipients
    $mail->setFrom('your-email@example.com', 'KUHTURM');
    $mail->addAddress('recipient@example.com');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Neue Anfrage';
    $mail->Body    = $body;

    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
}
?>
