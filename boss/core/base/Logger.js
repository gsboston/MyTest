require("./Constants");
const fs = require("fs");
const os = require("os");
const Logger = {};

Logger.TEXT_SUBFIX = "#### ";
Logger.TYPE_LOG = "TYPE_LOG";
Logger.TYPE_BUSINESS = "TYPE_BUSINESS";

Logger.log = function(type, text, param, currentUser) {
    let time = new Date().format("yyyy-MM-dd hh:mm:ss");
    if(type == this.TYPE_LOG) {
        text = this.TEXT_SUBFIX + time + " " + text;
        console.log(text);
        this.writeLogFile(text);
    }else if(type == this.TYPE_BUSINESS) {
        let busLogger = {};
        busLogger.text = text;
        busLogger.param = (typeof param === "object" ? JSON.stringify(param) : param);
    }
};

Logger.writeLogFile = function(text) {
    let time = new Date().format("yyyyMMdd");
    let path = getLoggerPath() + "boss_web_log_" + time + ".log";
    let appendFile = () => {
        fs.appendFile(path, "\n" + text, (error, data) => {
            error && console.error(Logger.TEXT_SUBFIX, time, "日志文件写入失败", error);
        });
    };
    fs.exists(path, (isExists) => {
        if(isExists) {
            appendFile();
        }else  {
            fs.writeFile(path, "#node运行日志 - " + time, (error, data) => {
                if(error) {
                    console.error(Logger.TEXT_SUBFIX, time, "日志文件创建失败", error);
                }else {
                    appendFile();
                }
            });
        }
    })
};

const getLoggerPath = function() {
    let env = process.env.NODE_ENV;
    let systemType = os.type();
    if(env == ENV_DEVELOPMENT || systemType == "Windows_NT") {
        return "../"
    }else if(systemType == "linux" || systemType == "Linux" || systemType == "Darwin") {
        return os.homedir() + "/../../data/logs/"
    }
};

module.exports = Logger;