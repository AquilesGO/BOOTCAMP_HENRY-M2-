"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor) {
  if (typeof executor !== "function")
    throw new TypeError("executor is not a function");

  this._state = "pending";
  this._handlerGroups = [];

  executor(this._internalResolve.bind(this), this._internalReject.bind(this));
}

$Promise.prototype.then = function (sH, eH) {
  if (typeof sH !== "function") sH = false;
  if (typeof eH !== "function") eH = null;

  let downstreamPromise = new $Promise(function () {});

  this._handlerGroups.push({
    successCb: sH,
    errorCb: eH,
    downstreamPromise,
  });

  if (this._state !== "pending") {
    this._callHandlers();
  }

  return downstreamPromise;
};
$Promise.prototype._internalResolve = function (data) {
  if (this._state === "pending") {
    this._state = "fulfilled";
    this._value = data;
    this._callHandlers();
  }
};
$Promise.prototype._internalReject = function (reason) {
  if (this._state === "pending") {
    this._state = "rejected";
    this._value = reason;
    this._callHandlers();
  }
};
$Promise.prototype._callHandlers = function () {
  //handlergroups ---> [{1},{2},...]
  while (this._handlerGroups.length > 0) {
    let objeto = this._handlerGroups.shift();

    if (this._state === "fulfilled") {
//-->para el estado "fulfilled"<-- evaluo si no hay handler:
      if (!objeto.successCb) {
        objeto.downstreamPromise._internalResolve(this._value);
      }
      try {
        //-->para el estado "fulfilled"<-- si hay handler, intento llamarlo:
        let resultado = objeto.successCb(this._value);
        if (resultado instanceof $Promise) {
          resultado.then(
            function (value) {
              objeto.downstreamPromise._internalResolve(value);
            },
            function (err) {
              objeto.downstreamPromise._internalReject(err);
            }
          );
        } else {
            objeto.downstreamPromise._internalResolve(resultado);
          }
      } catch (error) {
        //-->para el estado "fulfilled"<-- manejo de errores para modificar el downstreamPromise:
          objeto.downstreamPromise._internalReject(error);
        }

    } else {
// si el estado en "rejected":
//-->para el estado "rejected"<-- evaluo si no hay handler:
        if (!objeto.errorCb) {
          objeto.downstreamPromise._internalReject(this._value);
        } else {
            // si hay handler para el error...
            try {
              // ...intento llamarlo
              let resultado = objeto.errorCb(this._value);
              if (resultado instanceof $Promise) {
                resultado.then(
                  function (value) {
                    objeto.downstreamPromise._internalResolve(value);
                  },
                  function (err) {
                    objeto.downstreamPromise._internalReject(err);
                  }
                );
              } else {
                  objeto.downstreamPromise._internalResolve(resultado);
                }
            } catch (error) {
                objeto.downstreamPromise._internalReject(error);
              }
          }
      }
  }
};
$Promise.prototype.catch = function (eH) {
  return this.then(null, eH);
};

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
