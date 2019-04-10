// const process = require('process'); //process 是node的全局变量

let mode = (process.env.LOGNAME == 'administrator' ? 'dev' : 'prod');
module.exports = {
  mode,
  ...(mode == 'dev' ? require('./config.dev') : require('./config.prod'))
};
