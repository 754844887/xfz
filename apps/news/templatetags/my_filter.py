## 定义一个自定义简单模板标签
from django.template import Library
from datetime import datetime
from django.utils.timezone import now,localtime

register = Library()

#第一种注册
@register.filter
def time_since(value):
	if not isinstance(value, datetime):
		return value
	current_time = now()
	timestamp = (current_time - value).total_seconds()
	if timestamp < 60:
		return '刚刚'
	elif timestamp >= 60 and timestamp < 3600:
		minutes = int(timestamp / 60)
		return '%s分钟前' % minutes
	elif timestamp >= 60*60 and timestamp < 60*60*24:
		hours = int(timestamp / 3600)
		return '%s小时前' % hours
	elif timestamp >= 60*60*24 and timestamp < 60*60*24*30:
		day = int(timestamp / (60*60*24))
		return  '%s天前' % day
	else:
		return value.strftime("%Y/%m/%d %H:%M")

@register.filter
def time_format(value):
	if not isinstance(value, datetime):
		return value
	return localtime(value).strftime("%Y/%m/%d %H:%M")