let mode = (process.env.LOGNAME == 'administrator' ? 'dev' : 'pro');
module.exports = {
    mode,
    ...(mode == 'dev' ? require('./config.dev') : require('./config_pro'))
}