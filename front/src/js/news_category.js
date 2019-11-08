function NewsCategory() {
    this.BtnAdd = $("#category-add-btn")
}

//展示错误
NewsCategory.prototype.showError = function(result) {
    var self = this;
    if(result['code'] == 200){
        args = {
            'title':"添加成功！",
            'text': "",
            'type':"success",
        };
        swal(args, function () {
            window.location.reload();
        });
    }else{
        var messageobject = result['message'];
        sweetAlert("出错了！",messageobject,"error");
        }
};

//添加分类
NewsCategory.prototype.addCategory = function(){
    var self = this;
    self.BtnAdd.click(function () {
        swal.setDefaults({
            confirmButtonText: "确认",
        });
        swal({
              title: "分类名",
              type: "input",
              showCancelButton: true,
              closeOnConfirm: false,
              animation: "slide-from-top",
              inputPlaceholder: "请输入分类名",
              cancelButtonText: "取消"

            },
        function(inputValue){
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("分类名不能为空");
                return false
            }
            myajax.post({
            'url': '/cms/add_category/',
            'data': {
                'category': inputValue,
            },
            'success': function (result) {
                self.showError(result);
            },
            'error': function () {
                sweetAlert("出错了！","服务器内部错误","error");
            }
        });
        });
    });
};

//编辑分类
NewsCategory.prototype.editCategory = function(){
    var self = this;
    $(".edit-btn").click(function () {
        var currentBtn = $(this);
        var pk = currentBtn.parent().parent().data("pk");
        var name = currentBtn.parent().parent().data("name");
        swal({
              title: "分类名",
              type: "input",
              showCancelButton: true,
              closeOnConfirm: false,
              animation: "slide-from-top",
              inputPlaceholder: "请输入分类名！",
              inputValue: name,
              cancelButtonText: "取消"

            },
        function(inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("分类名不能为空");
                return false
            }
            myajax.post({
                'url': '/cms/edit_category/',
                'data': {
                    'pk':pk,
                    'category': inputValue,
                },
                'success': function (result) {
                    self.showError(result);
                },
                'error': function () {
                    sweetAlert("出错了！", "服务器内部错误", "error");
                }
            });
        })


    })
};


//删除分类
NewsCategory.prototype.delCategory = function(){
    var self = this;
    $(".del-btn").click(function () {
        var currentBtn = $(this);
        var pk = currentBtn.parent().parent().data("pk");
        var name = currentBtn.parent().parent().data("name");
        swal({
                title: "确定删除"+name+"分类吗？",
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
                'url': '/cms/del_category/',
                'data': {
                    'pk':pk,
                },
                'success': function (result) {
                    if(result['code'] == 200){
                        window.location.reload();
                    }else{
                        var messageobject = result['message'];
                        sweetAlert("出错了！",messageobject,"error");
                     }

                },
                'error': function () {
                    sweetAlert("出错了！", "服务器内部错误", "error");
                }
            });

            }else{
                window.location.reload();
            }
        })


    })
};

NewsCategory.prototype.run = function () {
    this.addCategory();
    this.editCategory();
    this.delCategory();
};

$(function () {
    var addCategory = new NewsCategory(); //生成一个实例
    addCategory.run();
});