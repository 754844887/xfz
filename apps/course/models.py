from django.db import models

class CourseCategory(models.Model):
	name = models.CharField(max_length=20)

class Teacher(models.Model):
	name = models.CharField(max_length=20)
	avatar = models.URLField()
	jobtitle = models.CharField(max_length=100)
	perfile = models.TextField()

class Course(models.Model):
	title = models.CharField(max_length=100)
	category = models.ForeignKey('CourseCategory', on_delete=models.DO_NOTHING)
	teacher = models.ForeignKey('Teacher',on_delete=models.DO_NOTHING)
	video_url = models.URLField()
	cover_url = models.URLField()
	price = models.FloatField()
	duration = models.IntegerField() # 时长
	profile = models.TextField()
	pub_time = models.DateTimeField(auto_now_add=True)

