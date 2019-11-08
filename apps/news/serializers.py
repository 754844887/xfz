from rest_framework import serializers
from .models import News, NewsCategory, Banner
from apps.xfzauth.serializers import UserSerializer

class NewsCategorySerializer(serializers.ModelSerializer):
	class Meta:
		model = NewsCategory
		fields = ['id', 'name']

class NewsSerializer(serializers.ModelSerializer):
	category = NewsCategorySerializer()
	author = UserSerializer()
	class Meta:
		model = News
		fields = ['id', 'title', 'desc', 'thumbnail', 'pub_time', 'author', 'category']

class BannerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Banner
		fields = ['id', 'priority', 'image_url', 'link_to']
