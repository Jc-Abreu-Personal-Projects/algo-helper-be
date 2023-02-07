const express = require('express');
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
}

app.use(cors(corsOptions));

const PORT = process.env.NODE_DOCKER_PORT || 4000;

const chokidar = require("chokidar");
const watcher = chokidar.watch('./app');

watcher.on('ready', () => {
  watcher.on('all', () => {
    console.log("Clearing /dist/ module cache from server");
    Object.keys(require.cache).forEach((id) => {
      if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id];
    })
  })
})

const index = require('./app/index');

app.use("/", index);

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
})