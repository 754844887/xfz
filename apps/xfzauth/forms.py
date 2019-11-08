from django import forms
from apps.forms import FormMixin
from django.core import validators
from .models import User
from django.core.cache import cache

class LoginForm(forms.Form,FormMixin):
	telephone = forms.CharField(max_length=11, error_messages={"max_length":"手机号码只能为11位！"})
	password = forms.CharField(max_length=16, min_length=8,
	                           error_messages={"max_length":"密码不能超过16位！",
	                                           "min_length":"密码不能少于8位！"})
	remember = forms.IntegerField(required=False)


class SignupForm(forms.Form,FormMixin):
	telephone = forms.CharField(max_length=11, validators=[
		validators.RegexValidator(r'1[345678]\d{9}$', message='请输入正确格式的手机号码！')])
	username = forms.CharField(max_length=100)
	img_captcha = forms.CharField(max_length=4)
	password1 = forms.CharField(max_length=16, min_length=8,
	                           error_messages={"max_length": "密码不能超过16位！",
	                                           "min_length": "密码不能少于8位！"})
	password2 = forms.CharField(max_length=16, min_length=8,
	                            error_messages={"max_length": "密码不能超过16位！",
	                                            "min_length": "密码不能少于8位！"})

	def clean_telephone(self):
		# 验证telephone字段
		telephone = self.cleaned_data.get('telephone')
		exists = User.objects.filter(telephone=telephone).exists()
		if exists:
			raise forms.ValidationError(message='手机号码已被注册！')
		return telephone

	def clean_img_captcha(self):
		img_captcha = self.cleaned_data.get('img_captcha').upper()
		cache_img_captcha = cache.get(img_captcha)
		print(cache_img_captcha)
		if not cache_img_captcha or cache_img_captcha != img_captcha:
			raise forms.ValidationError(message='图形验证码错误！')
		return img_captcha

	# 重写clean 方法，当需要对多个字段进行验证的时候可以考虑此方法
	def clean(self):
		# 如果来到clean方法，说明之前的每一个字段都验证成功了
		cleand_data = super().clean()
		password1 = cleand_data.get('password1')
		password2 = cleand_data.get('password2')
		if password1 != password2:
			raise forms.ValidationError(message='两次输入的密码不一致！')
		return cleand_data














