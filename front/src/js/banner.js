function BannerAdd() {
    this.addBannerBtn = $(".addBanner-btn");
    this.count = 1;
    this.action = "show";
    this.bannerListGroup = $(".banner-list");
}

//点击关闭按钮
BannerAdd.prototype.listenCloseBtn = function(){
    var self = this;
    $(".banner-list").on('click','.close-btn',function(){
        var current = $(this);
        var bannerHide = current.parent().parent().parent().parent();
        var banner_id = current.data("bannerid");
        if(banner_id) {
            swal({
                    title: "确定删除该轮播图吗？",
                    text: "你将无法恢复该信息！",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定删除！",
                    cancelButtonText: "取消删除！",
                    closeOnConfirm: false,
                    closeOnCancel: false

                },
                function (isConfirm) {
                    if (isConfirm) {
                        myajax.post({
                            'url': '/cms/banner_del/',
                            'data': {
                                'banner_id': banner_id
                            },
                            'success': function (result) {
                                console.log("deling---");
                                if (result['code'] === 200) {
                                    window.location.reload();
                                }
                            }
                        });
                    } else {
                        window.location.reload();
                    }

                });
        }else{
            bannerHide.hide();
        }
        if(self.count >1){
            self.count -=1;
        }
    });
};

//最大、小化按钮
BannerAdd.prototype.listenMinimizeBtn = function(){
    var self = this;
    //监听点击事件，根据action的值分别做最大化和最小化操作
    $(".banner-list").on('click','.min-btn',function() {
        var current = $(this);
        var bannerHide = current.parent().parent().siblings();
        if(self.action === "show"){
            bannerHide.hide();
            $("#banner-icon").removeClass("fa-minus").addClass("fa-plus");
            self.action = "hide";
        }else if(self.action === "hide"){
            bannerHide.show();
            $("#banner-icon").removeClass("fa-plus").addClass("fa-minus");
            self.action = "show";
        }
    });
};

//添加轮播图
BannerAdd.prototype.listenAddBanner = function(){
    var self = this;
    self.addBannerBtn.click(function () {
        if(self.count <= 6) {
            var html = template('banner-item', {'data': self.count});
            self.bannerListGroup.prepend(html);
            self.count += 1;
        }
    })
};

//点击图片上传轮播图,通过监听图片的点击事件转移到input标签上
BannerAdd.prototype.listenImageInput = function() {
    var self = this;
    $(".banner-list").on('click', '.image-input', function () {
        var that = $(this);
        var inputBtn = that.siblings("#input-upload");
        inputBtn.click();
        inputBtn.change(function () {
        //获取文件
        var file = inputBtn[0].files[0];
        //创建formdata对象才能拿到文件数据
        var formData = new FormData();
        //拼接文件
        formData.append('file', file);
        myajax.post({
            'url': '/cms/upload/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if (result['code'] == 200) {
                    var url = result['data']['url'];
                    //更改图片显示
                    that.attr("src",url);
                }
            },
        });
        })
    });
};

//保存轮播图地址，跳转链接和位置到数据库
BannerAdd.prototype.listenBannerSave = function() {
    var self = this;
    $(".banner-list").on('click', '#submin-btn', function () {
        var that = $(this);
        var common = that.parent().siblings(".box-body").children(".banner-group");
        var image = common.children(".thumbnail-group").children(".image-input");
        var priority = common.children(".thumbnail-input").children(".priority").children("#priority");
        var link = common.children(".thumbnail-input").children(".link").children("#link");
        var url = "";
        var pk = that.attr("data-bannerid");
        if(pk){
            var url = "/cms/banner_edit/"
        }else{
            var url = "/cms/banner_add/"
        }
        var image_url = image.attr("src");
        if(image_url === "/static/images/banner.png"){
            var image_url = "";
        }
        var priorityInput = priority.val();
        var linkInput = link.val();
        myajax.post({
            "url": url,
            "data": {
                "pk":pk,
                "priority": priorityInput,
                "image_url": image_url,
                "link_to": linkInput
            },
            "success": function (result) {
                if(result['code'] === 200){
                    if(pk){
                        window.messageBox.show("轮播图编辑成功！");
                        window.location.reload();
                    }else{
                        window.messageBox.show('轮播图添加成功！');
                        window.location.reload();
                    }
                }else{
                    var messageobject = result['message'];
                    if(typeof messageobject == 'string' || messageobject.constructor == String){
                        window.messageBox.show(messageobject);
                    }else{
                        for(var key in messageobject){
                            var messages = messageobject[key];
                            var message = messages[0];
                            window.messageBox.showError(message);
                     }
                 }
                }
            }
        })
        })
};

//展示轮播图
BannerAdd.prototype.listenBannerList = function(){
    var self = this;
    myajax.get({
        'url': '/cms/banner_list/',
        'success': function (result) {
            if(result['code'] === 200){
                var banners = result['data'];
                for(var i=0; i < banners.length; i++){
                    var banner = banners[i];
                    var html = template('banner-item', {'banner': banner});
                    self.bannerListGroup.append(html)
                }
            }
        }
    });


};

BannerAdd.prototype.run = function () {
    this.listenAddBanner();
    this.listenCloseBtn();
    this.listenMinimizeBtn();
    this.listenImageInput();
    this.listenBannerSave();
    this.listenBannerList();

};

$(function () {
    var addbanner = new BannerAdd(); //生成一个实例
    addbanner.run();
});