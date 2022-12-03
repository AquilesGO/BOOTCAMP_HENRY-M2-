// console.log(Object.keys(process));
const commands = require("./commands");

function escribir(algo){
    process.stdout.write(algo);
    process.stdout.write("\nprompt >")
}
// Output un prompt
process.stdout.write("prompt > ");
// El evento stdin 'data' se dispara cuando el user escribe una línea
process.stdin.on("data", function (data) {
    var cmd = data.toString().trim().split(" "); // remueve la nueva línea
   var aux = cmd.shift();
// inicialmente se usó este código para escoger el comando:
    // if (cmd === 'date') { 
    //     escribir(Date());
    // }
    // else if(cmd === 'pwd') {
    //     escribir(process.mainModule.path);
    // }
    // else escribir("El comando no existe")

// ahora para escoger (sirve para todos)el comando se puede simplificar así:
    if (commands[aux]) commands [aux](cmd, escribir);
    else escribir ("El comando no existe")
});

// console.log(process);
// console.log(path);
