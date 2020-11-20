const mongoose = require('mongoose');
const MAX_CONNECT_TIME = 10;
module.exports = class Datebase {
  constructor(options) {
    this.options = options;
    this.time = 0;
    // this.init();
  }
  async init() {
    try {
      await mongoose.connect(this.options.host);
      console.log('connected db');
    } catch (error) {
      throw new Error(error);
    }
  }
  async connect() {
    try {
      await this.init();
    } catch (error) {
      console.log('db error ', error);
      if (this.time > MAX_CONNECT_TIME) {
        console.log('max connect times');
        return;
      }
      await this.init();
    }
  }
};
