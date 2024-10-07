import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import websockets from "./websockets/ws";
const bodyParser = require("body-parser");

dotenv.config({ path: "./.env" });

const app: Application = express();

const port = process.env.PORT || 8000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors());
websockets(app);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
