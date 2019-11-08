from django.urls import path
from . import views

app_name = 'ueditor'
urlpatterns = [
    path('', views.UploadView.as_view(), name="Upload"),
    path('send_file/<filename>/', views.send_file, name="send_file"),
]