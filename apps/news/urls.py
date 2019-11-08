from django.urls import path
from . import views

app_name = 'news'
urlpatterns = [
    path('<int:news_id>/', views.NewsDteail.as_view(), name="news_detail"),
    path('news_list/', views.news_list, name="news_list"),
    path('comment/', views.comment, name="comment"),
]