const path = require('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./db/database');

const addCsrfTokenMiddleware = require('./middleware/csrf-token');
const errorHandlerMiddleware = require('./middleware/error-handler');
const checkAuthStatusMiddleware = require('./middleware/checkAuth');
const protectRoutesMiddleware = require("./middleware/protect-routes");
const cartMiddleware = require('./middleware/cart')

const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes')

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));

app.use(csrf());

app.use(cartMiddleware);
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);


app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use(cartRoutes);
app.use(protectRoutesMiddleware);
app.use(adminRoutes);
app.use(orderRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(5000);
  })
  .catch(function (error) {
    console.log('Failed to connect to the database!');
    console.log(error);
  });