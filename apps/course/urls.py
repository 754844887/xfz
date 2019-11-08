from django.urls import path
from . import views

app_name = 'course'
urlpatterns = [
    path('index/', views.course_index, name="course_index"),
	path('detail/', views.course_detail, name='course_detail'),
	path('auth/', views.auth, name='auth'),
]