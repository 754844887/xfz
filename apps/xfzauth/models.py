from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, PermissionsMixin
)
from shortuuidfield import ShortUUIDField

class UserManager(BaseUserManager):
	def _create_user(self, telephone, username, password, **kwargs):
		if not telephone:
			raise ValueError('必须输入手机号!')
		if not username:
			raise ValueError('必须输入用户名!')
		if not password:
			raise ValueError('必须输入密码!')
		user = self.model(username=username, telephone=telephone, **kwargs)
		user.set_password(password)
		user.save()
		return user

	def create_user(self, telephone, username, password, **kwargs):
		kwargs['is_superuser'] = False
		return self._create_user(username=username, password=password, telephone=telephone, **kwargs)

	def create_superuser(self, telephone, username, password, **kwargs):
		kwargs['is_superuser'] = True
		return self._create_user(username=username, password=password, telephone=telephone, **kwargs)


class User(AbstractBaseUser, PermissionsMixin):
	uid = ShortUUIDField(primary_key=True)
	username =models.CharField(max_length=100)
	telephone = models.CharField(max_length=11, unique=True)
	email = models.EmailField(null=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	date_joined = models.DateTimeField(auto_now_add=True)

	USERNAME_FIELD = 'telephone' # 用于做登录认证的字段
	REQUIRED_FIELDS = ['username'] # 创建用户的时候需要输入的字段(默认已有USERNAME_FIELD,password)
	EMAIL_FIELD = 'email'

	objects = UserManager()

	def get_full_name(self):
		return self.username

	def get_short_name(self):
		return self.username

