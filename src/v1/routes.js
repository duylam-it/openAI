import chatRoute from "./chat/route.js";
import {
  developmentErrors,
  mongoseErrors,
  notFound,
  productionErrors,
} from "./handlers/errorHandlers.js";

function routes(app) {
  app.use("/chat", chatRoute);

  // Setup Error Handlers
  app.use(notFound);
  app.use(mongoseErrors);
  if (process.env.MODE === "DEVELOPMENT") {
    app.use(developmentErrors);
  } else {
    app.use(productionErrors);
  }
}

export default routes;
