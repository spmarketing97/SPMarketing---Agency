<?php
require 'vendor/autoload.php';

use TCPDF;

// Configuración
$destinatario = 'hristiankrasimirov7@gmail.com';
$asunto = 'SPMarketing - Agency: Nuevo contacto';
$redireccion = 'thank-you.html';

// Recibir datos del formulario
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$service = $_POST['service'] ?? '';
$message = $_POST['message'] ?? '';

// Validar datos básicos
if (empty($name) || empty($email)) {
    header("Location: index.html?error=campos_requeridos");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: index.html?error=email_invalido");
    exit;
}

// Crear el contenido del correo
$contenido_email = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #003366; color: white; padding: 15px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>Nuevo contacto desde el formulario</h2>
    </div>
    <div class='content'>
        <div class='field'>
            <span class='label'>Nombre:</span> $name
        </div>
        <div class='field'>
            <span class='label'>Email:</span> $email
        </div>
        <div class='field'>
            <span class='label'>Teléfono:</span> $phone
        </div>
        <div class='field'>
            <span class='label'>Servicio solicitado:</span> $service
        </div>
        <div class='field'>
            <span class='label'>Mensaje:</span><br>" . nl2br($message) . "
        </div>
        <div class='field'>
            <span class='label'>Fecha y hora:</span> " . date('d/m/Y H:i:s') . "
        </div>
    </div>
    <div class='footer'>
        <p>Este mensaje fue generado automáticamente por SPMarketing Agency.</p>
    </div>
</body>
</html>
";

// Cabeceras para envío de correo HTML
$cabeceras  = "MIME-Version: 1.0\r\n";
$cabeceras .= "Content-type: text/html; charset=UTF-8\r\n";
$cabeceras .= "From: SPMarketing <noreply@spmarketing.com>\r\n";
$cabeceras .= "Reply-To: $email\r\n";

// Intentar enviar el correo
$enviado = mail($destinatario, $asunto, $contenido_email, $cabeceras);

// Guardar registro en JSON para la notificación mediante Python
$datos_json = json_encode($_POST);
file_put_contents('ultimo_formulario.json', $datos_json);

// Ejecutar script Python para la notificación avanzada (si está disponible)
if (file_exists('informe_landing_page.py')) {
    // Ejecutar el script en segundo plano
    exec('python informe_landing_page.py --notificar-formulario > /dev/null 2>&1 &');
}

// Redirigir según el resultado
if ($enviado) {
    // Éxito - redirigir a página de agradecimiento
    header("Location: $redireccion");
} else {
    // Error - redirigir con mensaje de error
    header("Location: index.html?error=envio_fallido");
}

// Registrar el formulario en un archivo para estadísticas
$registro = date('Y-m-d H:i:s') . " | $name | $email | $service\n";
file_put_contents('registros_formularios.log', $registro, FILE_APPEND);

exit;
?>