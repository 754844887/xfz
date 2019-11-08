function WriteNews() {

}

WriteNews.prototype.initUeditor = function () {
    window.ue = UE.getEditor('container',{
         initialFrameHeight: 400,
         serverUrl: "/controller/"
    });
};

//上传缩略图
WriteNews.prototype.listenUploadEvent = function(){
    var self = this;
    var uploadBtn = $("#thumbnail-btn");
    uploadBtn.change(function () {
        //获取文件
        var file = uploadBtn[0].files[0];
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
                    var thumbnailInput = $('#thumbnail');
                    thumbnailInput.val(url);
                }
            },
        });
    })
};


WriteNews.prototype.writeNewsEvent = function(){
    var submitBtn = $("#submin-btn");
    submitBtn.click(function (event) {
        event.preventDefault();
        var that = $(this);
        var title = $("input[name='title']").val();
        var desc = $("input[name='desc']").val();
        var thumbnail = $("input[name='thumbnail']").val();
        var content = window.ue.getContent();
        var category = $("select[name='category']").val();
        var pk = that.attr("data-news-id");
        var url = '';
        if(pk){
            url = '/cms/edit_news/'
        }else{
            url = '/cms/write_news/'
        }
        myajax.post({
            'url': url,
            'data': {
                'title':title,
                'desc':desc,
                'thumbnail':thumbnail,
                'content':content,
                'category':category,
                'news_id': pk
            },
            'success': function (result) {
                if(result['code'] === 200){
                    args = {
                        'title':"新闻发布成功！",
                        'text': "",
                        'type':"success",
                    };
                    swal(args, function () {
                        window.location.reload();
                    });
                }else{
                    var messageobject = result['message'];
                    if(typeof messageobject == 'string' || messageobject.constructor == String){
                    window.messageBox.showError(messageobject);
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

WriteNews.prototype.run = function () {
    this.listenUploadEvent();
    this.initUeditor();
    this.writeNewsEvent();
};

$(function () {
    var writenews = new WriteNews(); //生成一个实例
    writenews.run();
});