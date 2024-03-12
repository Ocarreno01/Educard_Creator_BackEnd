import { Container } from "inversify";
import { TYPES } from "./types";
import { Routes } from "./routes/routes";
import { Controllers } from "./controllers/controllers";
import { Services } from "./services/services";

const container = new Container();

container.bind<Services>(TYPES.Services).to(Services);
container.bind<Routes>(TYPES.Routes).to(Routes);
container.bind<Controllers>(TYPES.Controllers).to(Controllers);

export default container;
