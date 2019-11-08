from django.shortcuts import render
from django.views import View

class PublishCourseView(View):
	def get(self, request):
		return render(request, 'cms/publish_course.html')