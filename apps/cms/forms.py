from apps.forms import FormMixin
from django import forms
from apps.news.models import Banner, News

class BannerForm(forms.ModelForm, FormMixin):
	class Meta:
		model = Banner
		fields = ['priority', 'image_url', 'link_to']
		error_messages = {
			'priority':{'required':"请输入优先级！", "invalid": "优先级必须为数字！"},
			'image_url':{'required':"请上传轮播图！"},
			'link_to':{'required':"请输入跳转链接！","invalid": "跳转链接格式错误！"},
		}

class editBannerForm(forms.ModelForm, FormMixin):
	pk = forms.IntegerField()
	class Meta:
		model = Banner
		fields = ['priority', 'image_url', 'link_to']
		error_messages = {
			'priority':{'required':"请输入优先级！", "invalid": "优先级必须为数字！"},
			'image_url':{'required':"请上传轮播图！"},
			'link_to':{'required':"请输入跳转链接！","invalid": "跳转链接格式错误！"},
		}

class EditNewsForm(forms.ModelForm, FormMixin):
	category = forms.IntegerField()
	news_id = forms.IntegerField()
	class Meta:
		model = News
		fields = ['thumbnail', 'title', 'desc', 'content']