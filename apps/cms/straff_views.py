from django.shortcuts import render,redirect,reverse
from django.views import View
from apps.xfzauth.models import User
from django.contrib.auth.models import Group
from apps.news.decorator.xfz_login_required import xfz_superuser_required
from django.utils.decorators import method_decorator
from django.contrib import messages

@method_decorator(xfz_superuser_required,name='dispatch')
class StaffView(View):
	def get(self, request):
		staffs = User.objects.filter(is_staff=True)
		context = {
			'staffs': staffs,
		}
		return render(request, 'cms/staff.html', context=context)


@method_decorator(xfz_superuser_required,name='dispatch')
class StaffAddView(View):
	def get(self,request):
		groups = Group.objects.all()
		context = {
			'groups':groups
		}
		return render(request, 'cms/staff_add.html',context=context)

	def post(self,request):
		telephone = request.POST.get('telephone')
		user = User.objects.filter(telephone=telephone).first()
		if user:
			user.is_staff = True
			group_ids = request.POST.getlist('group')
			groups = Group.objects.filter(pk__in=group_ids)
			user.groups.set(groups)
			user.save()
			return redirect(reverse('cms:staff_view'))
		else:
			messages.info(request, message='手机号码不存在！',extra_tags='alter')
			return redirect(reverse('cms:staff_add_view'))
