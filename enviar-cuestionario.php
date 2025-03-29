<?php
// Configuración
$destinatario = 'hristiankrasimirov7@gmail.com';
$asunto = 'Nuevo cuestionario completado - SPMarketing';

// Recibir datos del formulario (enviados como JSON)
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Verificar si se recibieron datos
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'No se recibieron datos válidos']);
    exit;
}

// Construir el contenido del correo
$mensaje = "<html><body>";
$mensaje .= "<h2>Nuevo cuestionario completado</h2>";
$mensaje .= "<p><strong>Fecha:</strong> " . date('d/m/Y H:i:s') . "</p>";

// Información de contacto
$mensaje .= "<h3>Información de contacto</h3>";
$mensaje .= "<p><strong>Nombre:</strong> " . htmlspecialchars($data['nombre'] ?? 'No especificado') . "</p>";
$mensaje .= "<p><strong>Email:</strong> " . htmlspecialchars($data['email'] ?? 'No especificado') . "</p>";
$mensaje .= "<p><strong>Teléfono:</strong> " . htmlspecialchars($data['telefono'] ?? 'No especificado') . "</p>";
$mensaje .= "<p><strong>Empresa:</strong> " . htmlspecialchars($data['empresa'] ?? 'No especificado') . "</p>";

// Información del negocio
$mensaje .= "<h3>Información del negocio</h3>";
$mensaje .= "<p><strong>Sector:</strong> " . htmlspecialchars($data['sector'] ?? 'No especificado') . "</p>";
$mensaje .= "<p><strong>Fase del negocio:</strong> " . htmlspecialchars($data['fase'] ?? 'No especificado') . "</p>";

// Objetivos
$mensaje .= "<h3>Objetivos de marketing digital</h3>";
if (isset($data['objetivos']) && is_array($data['objetivos']) && !empty($data['objetivos'])) {
    $mensaje .= "<ul>";
    foreach ($data['objetivos'] as $objetivo) {
        $mensaje .= "<li>" . htmlspecialchars($objetivo) . "</li>";
    }
    $mensaje .= "</ul>";
} else {
    $mensaje .= "<p>No se especificaron objetivos</p>";
}

// Estrategias
$mensaje .= "<h3>Estrategias de marketing utilizadas</h3>";
if (isset($data['estrategias']) && is_array($data['estrategias']) && !empty($data['estrategias'])) {
    $mensaje .= "<ul>";
    foreach ($data['estrategias'] as $estrategia) {
        $mensaje .= "<li>" . htmlspecialchars($estrategia) . "</li>";
    }
    $mensaje .= "</ul>";
} else {
    $mensaje .= "<p>No se especificaron estrategias</p>";
}

// Presupuesto
$mensaje .= "<p><strong>Presupuesto mensual:</strong> " . htmlspecialchars($data['presupuesto'] ?? 'No especificado') . "</p>";

// Desafíos
$mensaje .= "<h3>Desafíos específicos</h3>";
$mensaje .= "<p>" . (empty($data['desafios']) ? 'No especificado' : nl2br(htmlspecialchars($data['desafios']))) . "</p>";

$mensaje .= "<hr>";
$mensaje .= "<p><em>Este mensaje fue generado automáticamente desde el formulario de cuestionario de SPMarketing Agency.</em></p>";
$mensaje .= "</body></html>";

// Cabeceras para envío de correo HTML
$cabeceras = "MIME-Version: 1.0" . "\r\n";
$cabeceras .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$cabeceras .= 'From: SPMarketing <noreply@spmarketing.com>' . "\r\n";
$cabeceras .= 'Reply-To: ' . $data['email'] . "\r\n";

// Intentar enviar el correo
if (mail($destinatario, $asunto, $mensaje, $cabeceras)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Formulario enviado correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo enviar el correo', 'data' => $data]);
}
?> 