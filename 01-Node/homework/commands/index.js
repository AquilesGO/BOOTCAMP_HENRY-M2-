const fs = require("fs");
const request = require("request");
//---muestra la fecha y la hora actual:---//
function date(inpt, escribir) {
  escribir(Date());
}
//---muestra la ruta del directorio actual---//
function pwd(inpt, escribir) {
  escribir(process.mainModule.path);
}
//---muestra un listado de todos los nombres de archivos de una carpeta:
function ls(input, escribir) {
  fs.readdir(".", function (err, files) {
    if (err) throw err;
    //---una forma de hacerlo: ---//
    // files.forEach((nombre) => {
    //     process.stdout.write(nombre.toString() + "\n");
    // });
    // escribir("listo");

    // ---otra forma mas sencilla: ---//
    var aux = files.join("\n");
    escribir(aux);
  });
}
//--- es como un console.log, pues muestra el nombre del archivo que le sigue al comando echo
function echo(input, escribir) {
  escribir(input.join(" "));
}
//--- muestra el contenido de todo lo escrito en un archivo recibido por input:
function cat(input, escribir) {
  fs.readFile(input[0], function (err, data) {
    if (err) throw err;
    escribir(data);
  });
}
//--- muestra las primeras 10 líneas del contenido del archivo recibido por input:
function head(input, escribir) {
  fs.readFile(input[0], "utf-8", function (err, data) {
    if (err) throw err;
    let lineas = data.toString().split("\n").splice(0, 10).join("\n");
    escribir(lineas);
  });
}
//--- muestra las últimas 10 líneas del contenido del archivo recibido por input:
function tail(input, escribir) {
  fs.readFile(input[0], "utf-8", function (err, data) {
    if (err) throw err;
    let lineas = data.toString().split("\n").slice(-10).join("\n");
    escribir(lineas);
  });
}
//--- curl se usa para descargar páginas web:
function curl(input, escribir) {
  request(`http://${input[0]}`, function (err, response, body) {
    if (err) throw err;
    if (response.statusCode === "200") console.log("Llegó un 200");
    escribir(body);
  });
}
module.exports = {
  date,
  pwd,
  ls,
  echo,
  cat,
  head,
  tail,
  curl,
};
