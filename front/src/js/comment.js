function Comment() {
    this.submitBtn = $(".submit-buttom");

}

//发布评论
Comment.prototype.listenContenUpload = function(){
    var self = this;
    var comment = $("#comment");
    self.submitBtn.click(function () {
        var content = comment.val();
        var news_id = comment.data("news-id");
        myajax.post({
            'url': '/news/comment/',
            'data': {
                'news_id': news_id,
                'content': content
            },
            'success':function (result) {
                if(result['code'] === 200){
                    window.location.reload();
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

Comment.prototype.run = function () {
    this.listenContenUpload();
};


$(function () {
   var comment = new Comment();
   comment.run();
});