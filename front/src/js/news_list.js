function NewsList() {
    
}

NewsList.prototype.ListenDatePickerEvent = function(){
    var self = this;
    var startPicker = $("#startpicker");
    var endPicker = $("#endpicker");
    var todayDate = new Date();
    var todayStr = todayDate.getFullYear() + '/' + (todayDate.getMonth()+1) + '/' + todayDate.getDate()
    var options = {
        'showButtonPanel': true,
        'format': 'yyyy/mm/dd',
        'startDate': '2019/10/1',
        'endDate': todayStr,
        'language': 'zh-CN',
        'todayBtn': 'linked',
        'todayHighlight': true,
        'clearBtn': true,
        'autoclose': true
    };
    startPicker.datepicker(options);
    endPicker.datepicker(options);

};

NewsList.prototype.deleteNews = function(){
    // var deleteBtn = $("#delete-btn");
    $(".del-btn").click(function () {
        var that = $(this);
        var pk = that.data("news-id");
        console.log(pk);
        swal({
                title: "确定删除吗？",
                text: "你将无法恢复该信息！",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定删除！",
                cancelButtonText: "取消删除！",
                closeOnConfirm: false,
                closeOnCancel: false
            },
        function(isConfirm) {
            if (isConfirm){
                myajax.post({
            'url': '/cms/del_news/',
            'data': {
                'news_id': pk
            },
            'success': function (result) {
                if(result['code'] === 200){
                    window.location.reload();
                }
            }
        })
            }else{
                window.location.reload();
            }
        })
    })
};

NewsList.prototype.run = function () {
    this.ListenDatePickerEvent();
    this.deleteNews();
};


$(function () {
    var newslist = new NewsList();
    newslist.run();
});