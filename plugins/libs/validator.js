module.exports = {
    username(name) {
        if (!name) {
            return '用户名不能为空';
        } else {
            return null;
        }
    },
    password(pwd) {
        if (!pwd) {
            return '密码不能为空';
        } else if (!/^\d{6,12}$/.test(pwd)) {
            return '密码格式不对';
        } else {
            return null;
        }
    }
}