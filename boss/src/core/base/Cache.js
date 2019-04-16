const CACHE_MEMORY = "memory";
const CACHE_SESSION_STORAGE = "sessionStorage";
const CACHE_LOCAL_STORAGE = "localStorage";
const CACHE_DEFAULT_TIMEOUT = 1000 * 60 * 30;

const Cache = function() {};

Cache.prototype._storage = {};

Cache.prototype.setItem = function() {
    let _this = this;
    _this.refresh();
    let args = arguments;
    let key = args[0];
    let value = args[1];
    let type = CACHE_MEMORY;
    let timeout = CACHE_DEFAULT_TIMEOUT;
    let curTime = new Date().getTime();

    if(args.length == 3) {
        timeout = args[2];
    }else if(args.length == 4) {
        if(args[2] == CACHE_MEMORY || args[2] == CACHE_SESSION_STORAGE || CACHE_LOCAL_STORAGE) {
            type = args[2];
        }
        timeout = args[3];
    }

    let _value = {
        type: type,
        time: curTime,
        timeout: timeout
    };
    _this._storage[key] = _value;

    if(type == CACHE_MEMORY) {
        _value.value = value;
    }else if(type == CACHE_SESSION_STORAGE) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }else if(type == CACHE_LOCAL_STORAGE) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

Cache.prototype.getItem = function(key) {
    let _this = this;
    _this.refresh();
    let curTime = new Date().getTime();
    let _value = _this._storage[key];
    if(Object.isNull(_value)) {
        return null;
    }
    if((_value.time + _value.timeout < curTime)) {
        _this.removeItem(key);
    }
    let value = _value.value;
    if(_value.type == CACHE_SESSION_STORAGE) {
        let __value = sessionStorage.getItem(key);
        if(Object.notNull(__value)) {
            value = JSON.parse(__value);
        }
    }else if(_value.type == CACHE_LOCAL_STORAGE) {
        let __value = localStorage.getItem(key);
        if(Object.notNull(__value)) {
            value = JSON.parse(__value);
        }
    }
    return value;
};

Cache.prototype.removeItem = function(key) {
    let _this = this;
    let _value = _this._storage[key];
    if(Object.isNull(_value)) {
        return null;
    }
    if(_value.type == CACHE_SESSION_STORAGE) {
        sessionStorage.removeItem(key);
    }else if(_value.type == CACHE_LOCAL_STORAGE) {
        localStorage.removeItem(key);
    }
    delete _this._storage[key];
};

Cache.prototype.refresh = function() {
    let _this = this;
    let curTime = new Date().getTime();
    let keys = Object.keys(_this._storage);
    if(Object.isNull(keys) || Array.isEmpty(keys)) {
        return;
    }
    for(let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let _value = _this._storage[key];
        if(_value.time + _value.timeout < curTime) {
            _this.removeItem(key);
        }
    }
};

let cache = new Cache();
cache.adsf = 1;
// Object.preventExtensions(Cache);

export default cache;