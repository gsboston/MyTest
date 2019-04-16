$RequestMapping("/systemManage/bd/searchCategory.do", function(page,name) {
     this.get({
         url:'/portal-api/basedocs/categoryPage',
         param:{page:page,name:name,size:8}
     }).then(data => {
         this.send(data);
     });
});

$RequestMapping("/systemManage/bd/searchItems.do", function(page,categoryId) {
    this.get({
        url:'/portal-api/basedocs/itemPage',
        param:{page:page,categoryId:categoryId,size:8}
    }).then(data => {
        this.send(data);
    });
});


$RequestMapping("/systemManage/bd/saveCategory.do", function(data) {
    this.post({
        url:'/portal-api/basedocs/saveCategory',
        data:data
    }).then(data => {
        this.send(data);
    });
});


$RequestMapping("/systemManage/bd/removeCategory.do", function(id) {
    this.delete({
        url:'/portal-api/basedocs/removeCategory/'+id
    }).then(data => {
        this.send();
    });
});

$RequestMapping("/systemManage/bd/saveItem.do", function(data) {
    this.post({
        url:'/portal-api/basedocs/saveItem',
        data:data
    }).then(data => {
        this.send(data);
});
});

$RequestMapping("/systemManage/bd/removeItem.do", function(id) {
    this.delete({
        url:'/portal-api/basedocs/removeItem/'+id
    }).then(data => {
        this.send();
});
});


$RequestMapping("/systemManage/bd/getItemsList.do", function(data) {
    this.post({
        url:'/portal-api/basedocs/getItemsList',
        data:data
    }).then(data => {
        this.send(data);
});
});

$RequestMapping("/systemManage/bd/getItemTree.do", function(categoryCode) {
    this.get({
        url:'/portal-api/basedocs/treeLevel/item',
        param:{categoryCode:categoryCode}
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/systemManage/bd/getItemTreeNode.do", function(id,categoryCode) {
    this.get({
        url:'/portal-api/basedocs/treeLevel/item',
        param:{categoryCode:categoryCode,parentId:id}
    }).then(data => {
        this.send(data);
    });
});