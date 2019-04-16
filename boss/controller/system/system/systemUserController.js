$RequestMapping("/system/user/getCurrentUserInfo.do", function() {
    var userList = {};
    userList = this.getCurrentUser();
    this.get({
        url: "/portal-api/users/" + userList.id
    }).then(items => {
        if( items.userVo.headPortrait){
            userList.headPortrait = items.userVo.headPortrait
        }
        this.send(userList);
    });
});

$RequestMapping("/system/user/getCurrentUserPost.do", function() {
    this.get({
        url: "/portal-api/users/getUserPost/" + this.getCurrentUser().id,
    }).then(items => {
        this.send(items);
    });
});

$RequestMapping("/system/user/updateUserInfo.do", function(data) {
    let user = this.getCurrentUser();
    this.get({
        url: "/portal-api/users/" + user.id
    }).then(item => {
        item.userName = data.userName;
        item.realName = data.realName;
        this.put({
            url: "/portal-api/users/" + user.id + "/update",
            data: data
        }).then(() => {
            user.userName = data.userName;
            user.realName = data.realName;
            this._setCurrentUser(user);
            this.send();
        });
    });
});

$RequestMapping("/system/user/changePassword.do", function(oldPassword, password) {
    this.put({
        url: "/portal-api/users/pwdchange",
        param: {
            userId: this.getCurrentUser().id,
            nowPassword: oldPassword,
            newPassword: password
        }
    }).then(() => {
        this._logout();
        this.send();
    });
});

$RequestMapping("/systemManage/update/updateImg.do", function(data) {
    this.put({
        url: "/portal-api/users/"+data.id+"/info",
        data:data
    }).then(() => {
        this.send();
    });
});



$RequestMapping("/system/user/changePhone.do", function(password, phoneNumber, validCode) {
    let user = this.getCurrentUser();
    this.request({
        url: "/portal-api/sms/updatePhone",
        param: {
            userId: user.id,
            passWord: password,
            phoneNumbers: phoneNumber,
            validateCode: validCode
        }
    }).then(result => {
        user.phone = phoneNumber;
        this._setCurrentUser(user);
        this.send();
    });
});