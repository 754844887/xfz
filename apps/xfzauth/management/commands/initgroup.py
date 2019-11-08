from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission,Group
from django.contrib.contenttypes.models import ContentType
from apps.news.models import NewsCategory,News,Banner,Comment

class Command(BaseCommand):
	def handle(self, *args, **options):
		# 编辑组(管理新闻/评论/轮播图等)
		edit_content_types = [
			ContentType.objects.get_for_model(News),
			ContentType.objects.get_for_model(NewsCategory),
			ContentType.objects.get_for_model(Banner),
			ContentType.objects.get_for_model(Comment),
		]
		editPermissions = Permission.objects.filter(content_type__in=edit_content_types)
		editGroup= Group.objects.create(name='编辑')
		editGroup.permissions.set(editPermissions)
		self.stdout.write(self.style.SUCCESS('编辑组创建成功！'))