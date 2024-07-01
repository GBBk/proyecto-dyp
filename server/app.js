const express = require("express");
const cors = require("cors");
const session = require("express-session");
const http = require("http");
const dotenv = require("dotenv");
const MySQLStore = require("express-mysql-session")(session);
const initializeSocket = require("./socket");

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "deporteysalud",
};

const sessionStore = new MySQLStore({
  clearExpired: true,
  ...dbConfig,
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
    expiration: 24 * 60 * 60 * 1000,
    createDatabaseTable: true,
    connectionLimit: 1,
  },
});

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://presumably-joint-marmot.ngrok-free.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    },
  })
);

// Routes for authentication and sessions
app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/usersAdmin", require("./routes/usersAdmin"));
app.use("/api/isAdmin", require("./routes/isAdmin"));
app.use("/api/user", require("./routes/user"));
app.use("/api/ejercicios", require("./routes/ejercicios"));
app.use("/api/crearRutina", require("./routes/crearRutina"));
app.use("/api/obtenerUsuarios", require("./routes/obtenerUsuarios"));
app.use("/api/asignarRutina", require("./routes/asignarRutina"));
app.use("/api/gestionarRutinas", require("./routes/gestionarRutinas"));
app.use("/api/rutinasUsuarios", require("./routes/rutinasUsuarios"));
app.use("/api/historialRutina", require("./routes/historialRutina"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/membresias", require("./routes/membresias"));
app.use("/api/asignarMembresia", require("./routes/asignarMembresia"));
app.use("/api/seriesReps", require("./routes/seriesReps"));
app.use("/api/topEjercicios", require("./routes/topEjercicios"));
app.use("/api/membresiaUser", require("./routes/membresiaUser"));
app.use("/api/verRutinaUsuario", require("./routes/verRutinaUsuario"));
app.use("/api/membresiaActiva", require("./routes/membresiaActiva"));

initializeSocket(server);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
