from apps.forms import FormMixin
from django import forms
from .models import News

class EditCategory(forms.Form,FormMixin):
	category = forms.CharField(max_length=100, error_messages={"required":"必须输入分类名！"})


class WriteNewsForm(forms.ModelForm, FormMixin):
	category= forms.IntegerField()
	class Meta:
		model = News
		exclude = ['pub_time', 'author', 'category']

class CommentForm(forms.Form,FormMixin):
	news_id = forms.IntegerField()
	content = forms.CharField(error_messages={"required":"评论不能为空！"})
