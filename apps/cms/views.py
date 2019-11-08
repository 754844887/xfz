from django.shortcuts import render
from django.views import View
from apps.news.models import NewsCategory,News
from utils import restful
from django.views.decorators.http import require_POST
from apps.news.forms import EditCategory, WriteNewsForm
from django.conf import settings
import os
from .forms import BannerForm, editBannerForm, EditNewsForm
from apps.news.models import Banner
from apps.news.serializers import BannerSerializer
from django.utils.decorators import method_decorator
from apps.news.decorator.xfz_login_required import xfz_login_required, xfz_perms_change_required
from django.core.paginator import Paginator
from _datetime import datetime
from urllib import parse
from django.utils.timezone import make_aware



def index(request):
	return render(request, 'cms/index.html')

@method_decorator(xfz_perms_change_required, name='dispatch')
class WirteNewsView(View):
	def get(self,request):
		categories = NewsCategory.objects.all()
		return render(request, 'cms/write_news.html', {'categories':categories})
	def post(self,request):
		form = WriteNewsForm(request.POST)
		if form.is_valid():
			title = form.cleaned_data.get('title')
			desc = form.cleaned_data.get('desc')
			thumbnail = form.cleaned_data.get('thumbnail')
			content = form.cleaned_data.get('content')
			category_id = form.cleaned_data.get('category')
			category = NewsCategory.objects.get(pk=category_id)
			News.objects.create(title=title,desc=desc,thumbnail=thumbnail,
			                    content=content, category=category,author=request.user)
			return restful.ok()
		else:
			message = form.get_errors()
			print(message)
			restful.paramserror(message=message)

@method_decorator(xfz_perms_change_required, name='dispatch')
class EditNewsView(View):
	def get(self,request):
		news_id = request.GET.get('news_id')
		news = News.objects.select_related('category').get(pk=news_id)
		categories = NewsCategory.objects.all()
		return render(request, 'cms/write_news.html',{'news': news, 'categories': categories})

	def post(self, request):
		form = EditNewsForm(request.POST)
		if form.is_valid():
			title = form.cleaned_data.get('title')
			desc = form.cleaned_data.get('desc')
			thumbnail = form.cleaned_data.get('thumbnail')
			content = form.cleaned_data.get('content')
			category_id = form.cleaned_data.get('category')
			news_id = form.cleaned_data.get('news_id')
			category = NewsCategory.objects.get(pk=category_id)
			News.objects.filter(pk=news_id).update(
												title=title,
												desc=desc,
			                                    thumbnail=thumbnail,
												content=content,
												category=category)
			return restful.ok()
		else:
			return restful.paramserror(message=form.get_errors())

@xfz_perms_change_required
@require_POST
def del_news(request):
	news_id = request.POST.get('news_id')
	try:
		News.objects.get(pk=news_id).delete()
		return restful.ok()
	except News.DoesNotExist:
		return restful.paramserror(message='该新闻不存在！')

@method_decorator(xfz_perms_change_required, name='dispatch')
class NewsCategoryView(View):
	def get(self, request):
		# from django.db.models import Count
		# category.news_set.all().aggregate(Count('id'))
		categories = NewsCategory.objects.all()
		return render(request, 'cms/news_category.html', {'categories':categories})

@xfz_perms_change_required
@require_POST
def add_category(request):
	category = request.POST.get('category')
	if category:
		exists = NewsCategory.objects.filter(name=category)
		if not exists:
			NewsCategory.objects.create(name=category)
			return restful.ok()
		else:
			return restful.paramserror(message="分类名已存在!")
	else:
		return restful.paramserror(message="请输入分类名!")

@xfz_perms_change_required
@require_POST
def edit_category(request):
	form = EditCategory(request.POST)
	if form.is_valid():
		pk = request.POST.get('pk')
		category = request.POST.get('category')
		try:
			NewsCategory.objects.filter(pk=pk).update(name=category)
			return restful.ok()
		except:
			message = "该分类不存在！"
			return restful.paramserror(message=message)
	else:
		return restful.paramserror("参数错误！")

@xfz_perms_change_required
@require_POST
def del_category(request):
	pk = request.POST.get('pk')
	try:
		category = NewsCategory.objects.get(pk=pk)
		category.delete()
		return restful.ok()
	except NewsCategory.DoesNotExist:
		message = "该分类不存在！"
		return restful.paramserror(message=message)

xfz_perms_change_required
@require_POST
def upload_file(request):
	file = request.FILES.get('file')
	name = file.name
	with open(os.path.join(settings.MEDIA_ROOT,name), 'wb') as fp:
		for chunk in file.chunks():
			fp.write(chunk)
	url = request.build_absolute_uri(settings.MEDIA_URL + name)
	return restful.result(data={'url':url})

@xfz_perms_change_required
def banners(request):
	return render(request,'cms/banner.html')

@xfz_perms_change_required
def banner_add(request):
	form = BannerForm(request.POST)
	if form.is_valid():
		priority = form.cleaned_data.get("priority")
		image_url = form.cleaned_data.get("image_url")
		link_to = form.cleaned_data.get("link_to")
		banner = Banner.objects.create(priority=priority, image_url=image_url, link_to=link_to)
		return restful.result(data={"banner_id": banner.pk})
	else:
		message = form.get_errors()
		return restful.paramserror(message=message)

xfz_perms_change_required
@require_POST
def banner_del(request):
	pk = request.POST.get('banner_id')
	try:
		banner = Banner.objects.get(pk=pk)
		banner.delete()
		return restful.ok()
	except Banner.DoesNotExist:
		message = "该轮播图不存在！"
		return restful.paramserror(message=message)

@xfz_perms_change_required
@require_POST
def banner_edit(request):
	form = editBannerForm(request.POST)
	if form.is_valid():
		pk = form.cleaned_data.get('pk')
		priority = form.cleaned_data.get("priority")
		image_url = form.cleaned_data.get("image_url")
		link_to = form.cleaned_data.get("link_to")
		Banner.objects.filter(pk=pk).update(priority=priority, image_url=image_url, link_to=link_to)
		return restful.ok()
	else:
		message = form.get_errors()
		return restful.paramserror(message)

@xfz_perms_change_required
def banner_list(request):
	banners = Banner.objects.all()
	serializer = BannerSerializer(banners, many=True)
	data = serializer.data
	return restful.result(data=data)

@method_decorator(xfz_perms_change_required, name='dispatch')
class NewsListView(View):
	def get(self,request):
		start = request.GET.get('start-time')
		end = request.GET.get('end-time')
		title = request.GET.get('title')
		category_id = int(request.GET.get('category', 0))
		around_count = 2
		page = int(request.GET.get('page',1))
		newses = News.objects.select_related('category', 'author')
		if start or end:
			if start:
				start_date = datetime.strptime(start,'%Y/%m/%d')
			else:
				start_date = datetime(year=2019, month=10, day=1)
			if end:
				end_date = datetime.strptime(end,'%Y/%m/%d')
			else:
				end_date = datetime.today()
			newses = newses.filter(pub_time__range=(make_aware(start_date), make_aware(end_date)))
		if title:
			newses = newses.filter(title__icontains=title)
		if category_id:
			newses = newses.filter(category=category_id)

		paginator = Paginator(newses, around_count)
		page_obj = paginator.page(page)
		context_data = self.get_pagination_data(paginator, page_obj, around_count)
		context = {
			'categorys': NewsCategory.objects.all(),
			'news_list': page_obj.object_list,
			'url_query': '&' + parse.urlencode({
				'start-time': start or '',
				'end-time': end or '',
				'title': title or '',
				'category': category_id
			})
		}
		context.update(context_data)
		return render(request, 'cms/search_news.html', context=context)

	def post(self,request):
		pass

	def get_pagination_data(self, paginator, page_obj, around_count=5):
		current_page = page_obj.number
		num_pages = paginator.num_pages
		left_has_more = False
		right_has_more = False

		# 显示左边页码
		if current_page <= around_count + 2:
			left_pages = range(1, current_page)
		else:
			left_has_more = True
			left_pages = range(current_page-around_count, current_page)

		# 显示右边页码
		if current_page + around_count >= num_pages:
			right_pages = range(current_page+1, num_pages+1)
		else:
			right_has_more = True
			right_pages = range(current_page+1, current_page+around_count+1)
		return {
		 'page_obj': page_obj,
         'left_pages': left_pages,
         'right_pages': right_pages,
         'current_page': current_page,
         'around_count': around_count,
         'left_has_more': left_has_more,
         'right_has_more': right_has_more,
         'num_pages': num_pages
      }


