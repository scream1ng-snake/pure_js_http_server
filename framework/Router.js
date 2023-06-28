module.exports = class Router {

  constructor(name) {
    this.endpoints = {};
    this.name = name;
  }

  request(method ="GET", path, handler) {
    if(!this.endpoints[path]) {
      this.endpoints[path] = {};
    }
    const endpoint = this.endpoints[path];
    if(endpoint[method]) {
      throw new Error(`${method} по адресу ${path} уже есть`);
    }
    endpoint[method] = handler;

    console.log('\n URL mapped: [' + this.name + '] ' + method + ' ' + path)
  }

  get(path, handler) {
    this.request("GET", path, handler);
  };

  post(path, handler) {
    this.request("POST", path, handler);
  };

  put(path, handler) {
    this.request("PUT", path, handler);
  };

  delete(path, handler) {
    this.request("DELETE", path, handler);
  };
}