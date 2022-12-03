// const bodyParser = require("body-parser");
const { json } = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];
let id = 1;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// TODO: your code to handle requests
// solución a la tarea:
server.post("/posts", (req, res) => {
  const { author, title, contents } = req.body;
  if (!author || !title || !contents) {
    res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  } else {
    const post = {
      id,
      author,
      title,
      contents,
    };
    posts.push(post);
    id++;
    res.json(post);
  }
});

server.post("/posts/author/:author", (req, res) => {
  const { title, contents } = req.body;
  const { author } = req.params;

  if (!author || !title || !contents) {
    res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  } else {
    const post = {
      id,
      author,
      title,
      contents,
    };
    posts.push(post);
    id++;
    res.json(post);
  }
});

server.get("/posts", (req, res) => {
  // recordando query --> url ?nombre=Sutanito&apellidoPerez ---> {nombre: Sutanito, apellido: Perez}
  const { term } = req.query;
  if (term) {
    let elegidos = posts.filter(
      (post) => post.title.includes(term) || post.contents.includes(term)
    );
    res.json(elegidos);
  } else {
    res.json(posts);
  }
});

server.get("/posts/:author", (req, res) => {
  const { author } = req.params;
  let elegidos = posts.filter((post) => post.author === author);

  if (elegidos.length > 0) res.json(elegidos);
  else
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
});

server.get("/posts/:author/:title", (req, res) => {
  const { author, title } = req.params;
  let elegidos = posts.filter(
    (post) => post.author === author && post.title === title
  );
  if (elegidos.length > 0) res.json(elegidos);
  else
    res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado",
    });
});

server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;
  if (!id || !title || !contents) {
    res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });
  }
  //los post tiene la forma: post = {id: id, author: author, title: title, contents: contents} ---> posts= [{...}, {...}, {...}, ...] entonces:
  let post = posts.find((post) => post.id === id);
  if (!post) {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post con el id indicado" });
  } else {
    post.title = title;
    post.contents = contents;
    res.json(post);
  }
});

server.delete("/posts", (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(STATUS_USER_ERROR).json({ error: "No existe este id" });
  }
  let post = posts.find((post) => post.id === id);
  if (!post) {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningún Post con ese id" });
  } else {
    posts = posts.filter((post) => post.id !== id);
    res.json({ success: true });
  }
});

server.delete("/author", (req, res) => {
  const { author } = req.body;
  if (!author) {
    res.status(STATUS_USER_ERROR).json({ error: "No existe este autor" });
  }
  let postAuthor = posts.filter((post) => post.author === author);
  if (postAuthor.length) {
    posts = posts.filter((post) => post.author !== author);
    res.json(postAuthor);
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe el autor indicado" });
  }
});

module.exports = { posts, server };
// server.get();
// // rutas para el post:
// server.post("/post", (req, res, next) => {
//   //agarrar los datos y validarlos
//   const { post } = req.body;
//   if (!post.title || !post.contents || !post.author) {
//     return res.status(STATUS_USER_ERROR).json({
//       error: "No se recibieron los parámetros necesarios para crear el Post",
//     });
//   }
//   try {
// // vamos a comunicarnos con la base de datos
// post.id = ++identificador
// posts.push(post)
// return res.status(200).json(post);
//   } catch (error) {
//     console.log(error)

//   }

//   //intentar hacer una logica manejando errores
// });
// server.put();
// server.delete();
