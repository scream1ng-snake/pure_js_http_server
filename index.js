const Application = require("./framework/Application.js");
const staticRouter = require("./src/routers/staticRouter.js");
const jsonParser = require("./src/midleware/parseJSON.js");
const urlParser = require("./src/midleware/parseUrl.js");

const PORT = 5000;

const app = new Application();

app.addRouter(staticRouter);
app.use(jsonParser);
app.use(urlParser("http://localhost:5000"));

app.listen(PORT, () => console.log("\n Сервер запущен на", PORT));