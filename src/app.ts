import "reflect-metadata";
import express from "express";
import bodyParser from 'body-parser';
import { InversifyExpressServer } from "inversify-express-utils";
import { container } from "./ioc/container";
import "./infrastructure/http/controllers/cartController"; // Import controllers
import "./infrastructure/http/controllers/ruleController"; // Import controllers
import "./infrastructure/http/controllers/ConfigController"; // Import controllers

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = new InversifyExpressServer(container, null, { rootPath: "/api" }, app);

const appConfigured = server.build();
appConfigured.listen(3000, () => {
    console.log("Server is running on port 3000");
});
