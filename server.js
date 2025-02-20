const express = require('express');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 3000;

// Función para generar un token único
function generateToken() {
    return crypto.randomBytes(16).toString('hex');
}

// Ruta para servir el contenido con el iframe
app.get('/', (req, res) => {
    // Generar un token para el video
    const token = generateToken();

    // URL del video con el token (esto es solo un ejemplo)
    const videoUrl = `https://ok.ru/videoembed/9858135820851/${token}`;

    // HTML con el iframe que carga el video
    const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reproductor de Video</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                }
                iframe {
                    width: 80%;
                    height: 500px;
                    border: none;
                    border-radius: 10px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <h1>Reproductor de Video</h1>

            <!-- Contenedor del iframe -->
            <div id="video-container">
                <iframe src="${videoUrl}" frameborder="0"></iframe>
            </div>
        </body>
        </html>
    `;

    // Responder con el HTML generado
    res.send(html);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
