$RequestMapping("/signCloud/getCustomerList.do", function(searchText, page) {
    this.get({
        url: "/serve-api/customer/search",
        param: {
            key: searchText,
            current: page || 1,
            size: 10
        }
    }).then(data => {
        this.send({
            page: data.current,
            total: data.total,
            data: data.records
        });
    });
});

$RequestMapping("/signCloud/getCustomerServiceList.do", function(customerId) {
    this.get({
        url: "/serve-api/customer/get/bills",
        param: {
            customerId: customerId,
        }
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/signCloud/saveHouseKeeper.do", function(customerId, userId) {
    this.post({
        url: "/serve-api/customer/houseKeeper/save",
        param: {
            customerId: customerId,
            userId: userId
        }
    }).then(data => {
        this.send();
    });
});

$RequestMapping("/signCloud/saveManager.do", function(billId, customerId, userId) {
    this.post({
        url: "/serve-api/customer/manager/save",
        param: {
            billId: billId,
            customerId: customerId,
            userId: userId
        }
    }).then(data => {
        this.send();
    });
});

$RequestMapping("/signCloud/getContactList.do", function(customerId) {
    this.get({
        url: "/serve-api/customer/getContactUser",
        param: {
            customerId: customerId
        }
    }).then(data => {
        this.send(data);
    });
});