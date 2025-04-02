<?php
require 'vendor/autoload.php';

use TCPDF;

// Configuración de correo
$to = 'hristiankrasimirov7@gmail.com';
$subject = 'SPMarketing - Agency';

// Recibir datos del formulario
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$service = $_POST['service'] ?? '';
$message = $_POST['message'] ?? '';
$date = $_POST['date'] ?? 'No especificada';
$time = $_POST['time'] ?? 'No especificada';

// Crear el contenido del correo
$email_content = "Nuevo contacto desde el formulario\n\n";
$email_content .= "Nombre: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Teléfono: $phone\n";
$email_content .= "Servicio: $service\n";
$email_content .= "Mensaje: $message\n";
$email_content .= "Fecha preferida: $date\n";
$email_content .= "Hora preferida: $time\n";

// Enviar correo
$headers = 'From: ' . $email . "\r\n" .
    'Reply-To: ' . $email . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $email_content, $headers);

// Crear directorio CITAS si no existe
if (!file_exists('CITAS')) {
    mkdir('CITAS', 0777, true);
}

// Crear PDF
$pdf = new TCPDF();
$pdf->AddPage();
$pdf->SetFont('helvetica', '', 12);

// Agregar contenido al PDF
$pdf_content = <<<EOD
Datos del Cliente

Nombre: $name
Email: $email
Teléfono: $phone
Servicio: $service
Mensaje: $message
Fecha preferida: $date
Hora preferida: $time
Fecha de registro: {$date('Y-m-d H:i:s')}
EOD;

$pdf->writeHTML($pdf_content, true, false, true, false, '');

// Guardar PDF en la carpeta CITAS
$filename = 'CITAS/' . date('Y-m-d_H-i-s') . '_' . $name . '.pdf';
$pdf->Output($filename, 'F');

// Programar eliminación del archivo después de 12 meses
$deletion_date = date('Y-m-d', strtotime('+12 months'));
file_put_contents('CITAS/.deletion_schedule', $filename . '|' . $deletion_date . "\n", FILE_APPEND);

// Respuesta JSON para el frontend
$response = [
    'success' => true,
    'message' => 'Gracias por tu interés y confianza. En breve uno de nuestros expertos se pondrá contigo para discutir el proyecto.'
];

header('Content-Type: application/json');
echo json_encode($response);
?>