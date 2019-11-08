//定义Banner对象
function Banner() {
    this.bannerULWidth = 798;
    this.bannerGroup = $("#banner-group"); //定义属性指向id选择器
    this.self = this;
    this.index = 1;
    this.rightArrow = $(".right-arrow");
    this.leftArrow = $(".left-arrow");
    this.bannerUL = $("#banner-ul");
    this.pageControl = $(".page-control");
    this.liList = this.bannerUL.children("li");
    this.bannerCount = this.liList.length;
}

//初始化bannerUL自动更改css样式
Banner.prototype.initBannerUL = function(){
    var self = this;
    var firstLi = self.liList.eq(0).clone();
    var lastLi = self.liList.eq(self.bannerCount-1).clone();
    self.bannerUL.append(firstLi);
    self.bannerUL.prepend(lastLi);
    self.bannerUL.css({"width": self.bannerULWidth*(self.bannerCount + 2),"left": -self.bannerULWidth});
};

//初始化小点点，自动设置小点点的个数等
Banner.prototype.initPageControl = function(){
    var self = this;
    for(i=0;i<self.bannerCount;i++){
        var circel = $("<li></li>");
        self.pageControl.append(circel);
        if(i===0){
            circel.addClass("active");
        }
    }
//动态更改小点点的样式
    self.pageControl.css({
        "width": self.bannerCount*10 + 16 + (self.bannerCount - 1)*16
    })

};


//控制左右箭头显示
Banner.prototype.toggleArrow = function(istrue){
  var self = this;
  if(istrue){
      self.rightArrow.show();
      self.leftArrow.show();
  }else{
      self.rightArrow.hide();
      self.leftArrow.hide();
  }
};


//监听鼠标悬停时的操作
Banner.prototype.listenBannerHover = function(){
    var self = this;
    this.bannerGroup.hover(function () {
        self.toggleArrow(true);
        clearInterval(self.timer); //清除循环轮播
    },function () {
        self.toggleArrow(false);
        self.loop();
    });

};

//点击左右箭头实现图片轮播
Banner.prototype.listenArrowClick = function(){
  var self = this;
  self.leftArrow.click(function () {
      if(self.index === 0){
          self.bannerUL.css({"left": -self.bannerULWidth*(self.bannerCount)});
          self.index = self.bannerCount-1;
      }else{
          self.index--;
      }
      console.log(self.index);
      self.animate();
  });


  self.rightArrow.click(function () {
      if(self.index === self.bannerCount+1){
          self.bannerUL.css({"left": -self.bannerULWidth});
          self.index = 2;
      }else{
          self.index++;
      }
      self.animate();
  });
};

//监听小点点的点击事件
Banner.prototype.listenPageControlClick = function(){
    var self = this;
    //each 方法遍历所有的li标签
    self.pageControl.children("li").each(function (index,obj) {
        $(obj).click(function () {
            self.index = index + 1;
            self.animate();
        })
    })
};

//实现轮播图左移并且小点点跟着一起移动
Banner.prototype.animate = function(){
    var self = this;
    //动态更改bannerUL标签的css样式实现向左移动
    self.bannerUL.stop().animate({"left": -798*self.index}, 500);
    //children获取所有的li标签列表，eq方法获取li标签列表的某个标签，
    if(self.index>=self.bannerCount+1){
        self.pageControl.children("li").eq(0).addClass("active").siblings().removeClass("active");
    }else{
        self.pageControl.children("li").eq(self.index-1).addClass("active").siblings().removeClass("active");
        }
};

//循环轮播
Banner.prototype.loop = function () {
    var self = this;
    //setInterval函数不断循环执行
    this.timer = setInterval(function () {
        if(self.index>=self.bannerCount+1){
            self.bannerUL.css({"left": -self.bannerULWidth});
            self.index = 2;
        }
        else{
            self.index++;
        }
        self.animate();
    }, 2000)
};

//Banner对象的run方法
Banner.prototype.run = function () {
    this.initPageControl();
    this.initBannerUL();
    this.loop();
    this.listenBannerHover();
    this.listenArrowClick();
    this.listenPageControlClick();
};


//加载更多函数
function Loadmore() {
    this.page = 2;
    this.category = 0;
    this.loadBtn = $("#load-more-btn");
    //自定义过滤器格式化新闻发布时间
    template.defaults.imports.timeSince =  function (dateValue){
        var date = new Date(dateValue);
        var timest = date.getTime(); //获取到毫秒的时间
        var nowst = (new Date()).getTime();
        var timestamp = (nowst - timest)/1000; //获取时间戳并转换为秒
        if(timestamp < 60){
            return '刚刚'
        }else if (timestamp >= 60 && timestamp < 3600){
            var minutes = parseInt(timestamp/60);
            return minutes+'分钟前'
        }else if (timestamp >= 60*60 && timestamp < 60*60*24){
            hours = parseInt(timestamp / 3600);
		    return hours+'小时前'
        }else if(timestamp >= 60*60*24 && timestamp < 60*60*24*30){
            day = parseInt(timestamp / (60*60*24));
            return day+"天前"
        }else{
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDay();
            var hour = date.getHours();
            var minute = date.getMinutes();
            return year+'/'+month+'/'+day+" "+hour+":"+minute
        }
    };
}

//监听点击加载更多按钮
Loadmore.prototype.listenMoreEvent = function(){
    var self = this;
    self.loadBtn.click(function () {
        myajax.get({
            'url': '/news/news_list/',
            'data': {
                'p': self.page,
                'category_id': self.category
            },
            'success': function (result) {
                if(result['code'] === 200){
                    var data = result['data'];
                    if(data.length > 0){
                        var html = template('news-item',{'newses': data});
                        var ul = $("#list-more");
                        ul.append(html);
                        self.page += 1;
                    }else{
                        self.loadBtn.hide();
                    }

                }
            }
        })
    })
};

//监听点击分类获取分类新闻
Loadmore.prototype.listenCategoryChangeEvent = function(){
    var self = this;
    //获取所有的分类的li标签
    var li = $(".list-tab").children();
    li.click(function () {
        self.page = 1; //默认获取第一页
        var current_select = $(this); //获取当前点击的标签
        self.category = current_select.attr("data-category"); //获取当前点击的分类id
        self.loadBtn.show(); //点击分类时需要让加载更多按钮默认显示
        current_select.addClass("active").siblings().removeClass("active"); //给当前点击的标签添加active类，并去除它的兄弟元素的类
        myajax.get({
            'url': '/news/news_list/',
            'data': {
                'p': self.page,
                'category_id': self.category
            },
            'success': function (result) {
                if(result['code'] === 200){
                    var data = result['data'];
                    var ul = $("#list-more");
                    if(data.length > 0) {
                        var html = template('news-item', {'newses': data});
                        ul.empty().append(html);
                        self.page += 1;
                    }else {
                        ul.empty();
                    }
                }
            }
        })
    })
};

//加载更多函数
Loadmore.prototype.run = function(){
    this.listenMoreEvent();
    this.listenCategoryChangeEvent();
};

//"$()"是jquery方法，用于浏览器完全加载完成后执行里面的函数
$(function () {
    var banner = new Banner(); //生成一个banner实例
    banner.run();

    var load = new Loadmore();
    load.run();
});

