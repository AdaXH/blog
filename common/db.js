const mongoose = require('mongoose');

module.exports = class Datebase {
  constructor(options) {
    this.options = options;
  }

  async connect(callback) {
    try {
      const res = await mongoose.connect(this.options.host);
      console.log('connected db');
      callback && callback(res);
    } catch (error) {
      callback && callback(error);
    }
  }
};
