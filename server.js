const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);

    if (req.method === 'GET' && parsedUrl.pathname === '/formulario') {
        // Servir el formulario HTML
        const filePath = path.join(__dirname, 'formulario.html');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.method === 'POST' && parsedUrl.pathname === '/datos') {
        // Procesar los datos del formulario POST
        let formData = '';

        req.on('data', (chunk) => {
            formData += chunk.toString();
        });

        req.on('end', () => {
            const parsedFormData = querystring.parse(formData);

            // Crear la respuesta HTML con los datos del formulario
            const htmlResponse = `
                <html>
                <head>
                    <title>Datos del Formulario</title>
                </head>
                <body>
                    <pre>${JSON.stringify(req.headers, null, 2)}</pre>
                    <h1>Metodo: ${req.method}</h1>
                    <h1>URL: ${req.url}</h1>
                    <h1>Datos del Formulario:</h1>
                    <p>Dato 1: ${parsedFormData.dato1}</p>
                    <p>Dato 2: ${parsedFormData.dato2}</p>
                </body>
                </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlResponse);
        });
    } else {
        // Configurar las cabeceras de respuesta para el método GET
        res.writeHead(200, { 'Content-Type': 'text/html' });

        // Crear la respuesta HTML para el método GET
        const htmlResponse = `
            <html>
            <head>
                <title>Información del Request</title>
            </head>
            <body>
                <h1>Request headers:</h1>
                <pre>${JSON.stringify(req.headers, null, 2)}</pre>
                <h1>Metodo: ${req.method}</h1>
                <h1>URL: ${req.url}</h1>
            </body>
            </html>
        `;

        res.end(htmlResponse);
    }
});

const port = 4000;
server.listen(port, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${port}`);
});
