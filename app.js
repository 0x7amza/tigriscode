const express = require("express");
const multer = require("multer");
const { Jimp } = require("jimp");
const QRCodeReader = require("qrcode-reader");
const fs = require("fs");
const app = express();
const db = require("./models/index.js");
require("express-async-errors");
const errorHandler = require("./Middleware/errorHandler.middleware.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
app.use(cors());
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

const upload = multer({ dest: "uploads/" });

app.post("/scan-qr", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  console.log("File uploaded:", req.file.path);
  try {
    const image = await Jimp.read(req.file.path);
    const qr = new QRCodeReader();
    const qrResult = await new Promise((resolve, reject) => {
      qr.callback = (err, value) => (err ? reject(err) : resolve(value));
      qr.decode(image.bitmap);
    });
    fs.unlinkSync(req.file.path);
    res.json({ qrCode: qrResult?.result || "", isQrFound: !!qrResult });
  } catch (error) {
    console.error("QR Processing Error:", error);
    res
      .status(500)
      .json({ error: "Failed to process image", isQrFound: false });
  }
});

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
