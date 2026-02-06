import express, { Application } from "express"
import router from "./routes/routes";
import cors from "cors"
import appointmentsRouter from "./routes/appointmentsRouter";

const server: Application = express();

server.use(cors())
server.use(express.json());
server.use("/appointments", appointmentsRouter);
server.use(router)

export default server;