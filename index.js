import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
import chalk from "chalk";

const app = express();
const PORT = 3000;
const Api = "https://randomuser.me/api/";
const usuarios = [];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/usuarios", async (req, res) => {
  try {
    for (let i = 0; i < 10; i++) {
      const response = await axios.get(Api);
      const userData = response.data.results[0];
      const id = uuidv4().slice(0, 6);
      const fecha = moment().format();

      const nuevoUsuario = {
        nombre: userData.name.first,
        apellido: userData.name.last,
        genero: userData.gender,
        id: id,
        fecha: fecha,
      };

      usuarios.push(nuevoUsuario);
    }

    const usuariosXgenero = _.partition(usuarios, (u) => u.genero === "male");

    const templateHombres = `
      <h5>Hombres</h5>
      <ol>
        ${usuariosXgenero[0]
          .map(
            (user) => `
          <li>ID: ${user.id} - Fecha: ${user.fecha} - Nombre: ${user.nombre} - Apellido: ${user.apellido} - Genero: ${user.genero} </li>
        `
          )
          .join("")}
      </ol>
    `;

    const templateMujeres = `
      <h5>Mujeres</h5>
      <ol>
        ${usuariosXgenero[1]
          .map(
            (user) => `
          <li>ID: ${user.id} - Fecha: ${user.fecha} - Nombre: ${user.nombre} - Apellido: ${user.apellido} - Genero: ${user.genero}</li>
        `
          )
          .join("")}
      </ol>
    `;

    console.log(chalk.blue.bgWhite("Usuarios Masculinos:"));
    usuariosXgenero[0].forEach((user) => {
      console.log(chalk.blue.bgWhite(
        `ID: ${user.id} - Fecha: ${user.fecha} - Nombre: ${user.nombre} - Apellido: ${user.apellido} - Genero: ${user.genero}`
      ));
    });

    console.log(chalk.blue.bgWhite("Usuarios Femeninos:"));
    usuariosXgenero[1].forEach((user) => {
      console.log(chalk.blue.bgWhite(
        `ID: ${user.id} - Fecha: ${user.fecha} - Nombre: ${user.nombre} - Apellido: ${user.apellido} - Genero: ${user.genero}`
      ));
    });

    res.send(templateHombres + templateMujeres);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("*", (req, res) => {
  res.send("Route not found");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/usuarios`);
});
