const express = require("express");
const app = express();
const db = require("./models/index.js");
require("express-async-errors");
const errorHandler = require("./Middleware/errorHandler.middleware.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
app.use("/api", require("./Routes/index"));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "TigrisCode API",
      version: "1.0.0",
      description: "TigrisCode API Documentation",
      contact: {
        name: "HamzaDev",
        email: "hamza0xdev@gmail.com",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./routes/*.js", "./swaggerSchemas.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

db.sequelize
  .sync({ force: false, logging: false })
  .then(() => {
    console.log("Synced db.");
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

module.exports = app;
