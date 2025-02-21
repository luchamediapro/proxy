const express = require('express');
const { v4: uuidv4 } = require('uuid');
const redis = require('redis');

const app = express();
const port = 3000;

// Conexión a Redis (para almacenar URLs temporales)
const client = redis.createClient();

client.on('error', (err) => {
    console.error('Error de Redis:', err);
});

// Middleware para verificar URLs dinámicas
const checkURL = (req, res, next) => {
    const { id } = req.params;
    client.get(id, (err, data) => {
        if (err) throw err;
        if (!data) {
            return res.status(404).send('URL no válida o expirada');
        }
        const { ip, videoPath } = JSON.parse(data);
        if (ip !== req.ip) {
            return res.status(403).send('Acceso denegado');
        }
        req.videoPath = videoPath;
        next();
    });
};

// Ruta para generar una URL dinámica
app.get('/generate-url', (req, res) => {
    const videoPath = 'ruta/al/video.mp4'; // Cambia esto por la ruta real del video
    const id = uuidv4();
    const ip = req.ip;
    const expirationTime = 60 * 10; // 10 minutos de expiración

    client.setex(id, expirationTime, JSON.stringify({ ip, videoPath }));
    const dynamicURL = `http://${req.headers.host}/video/${id}`;
    res.send({ url: dynamicURL });
});

// Ruta para servir el video
app.get('/video/:id', checkURL, (req, res) => {
    const videoPath = req.videoPath;
    res.sendFile(videoPath, { root: __dirname });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
