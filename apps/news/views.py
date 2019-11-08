from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import NewsCategory, News, Comment
from django.conf import settings
from utils import restful
from .serializers import NewsSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.views import View
from .forms import CommentForm
from apps.news.decorator.xfz_login_required import xfz_login_required
from .models import Banner


@ensure_csrf_cookie
def index(request):
	categories = NewsCategory.objects.all()
	count = settings.PAGE_OF_NEWS_COUNT
	newses = News.objects.select_related('category','author').all()[0:count]
	banners = Banner.objects.all()
	return render(request, "news/index.html", {'categories':categories, 'newses':newses, 'banners': banners})

def news_list(request):
	page = int(request.GET.get('p',1))
	category = int(request.GET.get('category_id'))
	count = settings.PAGE_OF_NEWS_COUNT
	start = (page - 1) * count
	end = page * count
	if category == 0:
		newses = News.objects.select_related('category','author').all()[start:end]
	else:
		newses = News.objects.select_related('category','author').filter(category=category)[start:end]
	serializer = NewsSerializer(newses, many=True)
	data = serializer.data
	return restful.result(data=data)


class NewsDteail(View):
	def get(self, request, news_id):
		news = get_object_or_404(News, pk=news_id)
		total = news.comments.aggregate(total=Count('content'))
		return render(request, "news/new_detail.html", {"news": news, 'total': total})


@xfz_login_required
def comment(request):
	form = CommentForm(request.POST)
	if form.is_valid():
		news_id = form.cleaned_data.get('news_id')
		content = form.cleaned_data.get('content')
		news = get_object_or_404(News, pk=news_id)
		Comment.objects.create(content=content, news=news, author=request.user)
		return restful.ok()
	else:
		message = form.get_errors()
		return restful.paramserror(message=message)














