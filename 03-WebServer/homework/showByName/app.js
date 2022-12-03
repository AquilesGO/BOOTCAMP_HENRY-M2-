var fs = require("fs");
var http = require("http");

// Escribí acá tu servidor:

http
.createServer(function (require, response) {
    if(require.url === "/"){
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("Esta es la ruta principal");
    } else {
        fs.readFile(__dirname + `/images${require.url}_doge.jpg`, (err, img) => {
            if(err) {
                response.writeHead(404);
                response.end("Imagen no encontrada");
            }else {
                response.writeHead(200);
                response.end(img);
            }
        });
    }
})
.listen(3001,console.log("Corriendo en PORT 3001"));   
