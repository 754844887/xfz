//点击登录弹出登录界面
function MaskWrapper() {
    this.maskWrapper = $(".mask-wrapper");
    this.sigin = $("#sigin");
    this.signup = $("#signup");
    this.close = $("#close");
    this.scrollWrapper = $(".scroll-wrapper");
    this.switch = $(".switch");
}

//更新图形验证码
MaskWrapper.prototype.GetValidImg = function(){
    var imgCaptcha = $('.img-captcha');
    imgCaptcha.click(function () {
        imgCaptcha.attr("src","/account/get_valid_img/"+"?random="+Math.random())
    });
};

//展示错误
MaskWrapper.prototype.showError = function(result) {
    var self = this;
    if(result['code'] == 200){
        self.maskWrapper.hide();
        window.location.reload();
    }else{
        var messageobject = result['message'];
        if(typeof messageobject == 'string' || messageobject.constructor == String){
            window.messageBox.show(messageobject);
        }else{
            for(var key in messageobject){
                var messages = messageobject[key];
                var message = messages[0];
                window.messageBox.show(message);
            }
        }
    }
};

//显示登录界面
MaskWrapper.prototype.listenShow = function(){
    var self = this;
    self.sigin.click(function () {
        self.scrollWrapper.css({"left": "0"});
        self.maskWrapper.show();
    });

    self.signup.click(function () {
        self.scrollWrapper.css({"left": "-400px"});
        self.maskWrapper.show();

    })
};

//关闭登录界面
MaskWrapper.prototype.listenHide = function() {
    var self = this;
    self.close.click(function () {
        self.maskWrapper.hide();
    });
};

//登录界面点击切换
MaskWrapper.prototype.Switch = function(){
    var self = this;
     self.switch.click(function () {
        var CurrentLeft = self.scrollWrapper.css("left");
        CurrentLeft = parseInt(CurrentLeft);
        if(CurrentLeft < 0){
           self.scrollWrapper.animate({"left": "0"})
        }else{
           self.scrollWrapper.animate({"left": "-400px"})
        }
    });
};

//发起登录请求
MaskWrapper.prototype.listenLogin = function() {
    var self = this;
    var signinGroup = $(".sigin-group");
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");
    var submitBtn = $(".submit-siginbtn");
    submitBtn.click(function () {
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop('checked');
        myajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember?1:0
            },
            'success': function(result){
                self.showError(result)
            },
            'error': function (error) {
                window.messageBox.show('服务器内部错误！');
            }
        })
    })
};

//发起注册请求
MaskWrapper.prototype.listenSignup = function() {
    var self = this;
    var signupGroup = $(".sigup-group");
    var telephoneInput = signupGroup.find("input[name='telephone']");
    var usernameInput = signupGroup.find("input[name='username']");
    var img_captchaInput = signupGroup.find("input[name='img_captcha']");
    var password1Input = signupGroup.find("input[name='password1']");
    var password2Input = signupGroup.find("input[name='password2']");
    var submitBtn = $(".submit-signupbtn");
    submitBtn.click(function () {
        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var img_captcha = img_captchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        myajax.post({
            'url': '/account/signup/',
            'data': {
                'telephone': telephone,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
            },
            'success': function(result){
                self.showError(result)
            },
            'error': function (error) {
                window.messageBox.show('服务器内部错误！');
            }
        })
    })
};

MaskWrapper.prototype.run = function () {
    this.listenShow();
    this.listenHide();
    this.Switch();
    this.listenLogin();
    this.GetValidImg();
    this.listenSignup();
};


//"$()"是jquery方法，用于浏览器完全加载完成后执行里面的函数
$(function () {
    var banner = new MaskWrapper(); //生成一个banner实例
    banner.run();
});

