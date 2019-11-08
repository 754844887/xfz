from django.shortcuts import render
from .forms import LoginForm,SignupForm
from django.contrib.auth import login, logout, authenticate, get_user_model
from django.views.decorators.http import require_POST
from django.http import  HttpResponse
from utils import restful
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect,reverse
from django.views import View
from utils.captcha.xfzcaptcha import ValidCodeImg
from django.core.cache import cache

User = get_user_model()

@require_POST
def login_view(request):
	form = LoginForm(request.POST)
	if form.is_valid():
		telephone = form.cleaned_data.get('telephone')
		remember = form.cleaned_data.get('remember')
		password = form.cleaned_data.get('password')
		user = authenticate(username=telephone, password=password)
		if user:
			if user.is_active:
				login(request, user)
				if remember:
					request.session.set_expiry(None)
				else:
					request.session.set_expiry(0)
				return 	restful.ok()
			else:
				return restful.unauth(message="用户已被禁用!")
		else:
			return restful.paramserror(message="用户名或密码错误!")
	else:
		errors = form.get_errors()
		return restful.paramserror(message=errors)


@login_required
def logout_view(request):
	logout(request)
	return redirect(reverse('index'))


class GetValidImg(View):
	def get(self, request):
		obj = ValidCodeImg()
		img_data,valid_code = obj.getValidCodeImg()
		response = HttpResponse(content_type='image/png')
		response.write(img_data)
		cache.set(valid_code.upper(),valid_code.upper(),60)
		return response

@require_POST
def signup_view(request):
	form = SignupForm(request.POST)
	if form.is_valid():
		telephone = form.cleaned_data.get('telephone')
		username = form.cleaned_data.get('username')
		password = form.cleaned_data.get('password2')
		user = User.objects.create_user(username=username,telephone=telephone,password=password)
		login(request, user)
		return restful.ok()
	else:
		errors = form.get_errors()
		return restful.paramserror(message=errors)


