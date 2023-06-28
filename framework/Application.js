const http = require('http');
const EventEmiter = require("events");

module.exports = class Application {
  constructor() {
    this.emiter = new EventEmiter();
    this.server = this._createServer();
    this.midlewares = [];
  }

  use(midleware) {
    this.midlewares.push(midleware);
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }

  addRouter(router) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path];
      Object.keys(endpoint).forEach((method) => {
        const handler = endpoint[method];

        this.emiter.on(this._getEndpointMask(path, method), (req, res) => {
          handler(req, res);
        })
      })
    })
  }

  _createServer() {
    return http.createServer((req, res) => {
      let body = "";
      req.on("data", (chank) => {
        body += chank;
      })
      req.on("end", () => {
        if (body) {
          req.body = JSON.parse(body);
        }

        this.midlewares.forEach((midleware) => {
          midleware(req, res);
        })

        const isEmited = this.emiter.emit(this._getEndpointMask(req.pathname, req.method), req, res);
        if (!isEmited) {
          res.end();
        }
      })
    });
  }

  _getEndpointMask(path, method) {
    return `[${path}]:[${method}]`
  }
}