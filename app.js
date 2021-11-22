const express = require("express");
const path = require("path");
const csrf = require('csurf');

const expressSession = require('express-session')
const createSessionConfig = require('./config/session')

const db = require("./db/database");
const addCsrfTokenMiddleware = require('./middleware/csrf-token')
const errorHandlerMiddleware = require("./middleware/error-handler");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}))

const sessionConfig = createSessionConfig()
app.use(expressSession(sessionConfig));

app.use(csrf());
app.use(addCsrfTokenMiddleware);


app.use(authRoutes);
app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(() => app.listen(5000))
  .catch((error) => console.log("failed to connect to db", error));

