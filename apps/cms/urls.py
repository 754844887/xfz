from django.urls import path
from . import views
from . import course_views, straff_views

app_name = 'cms'
urlpatterns = [
    path('index/', views.index, name="index"),
    path('write_news/', views.WirteNewsView.as_view(), name="write_news"),
    path('edit_news/', views.EditNewsView.as_view(), name="edit_news"),
    path('del_news/', views.del_news, name="del_news"),
    path('news_category/', views.NewsCategoryView.as_view(), name="news_category"),
    path('add_category/', views.add_category, name="add_category"),
    path('edit_category/', views.edit_category, name="edit_category"),
    path('del_category/', views.del_category, name="del"),
    path('upload/', views.upload_file, name="upload_file"),
    path('banner/', views.banners, name="banners"),
    path('banner_add/', views.banner_add, name="banner_add"),
    path('banner_list/', views.banner_list, name="banner_list"),
    path('banner_del/', views.banner_del, name="banner_del"),
    path('banner_edit/', views.banner_edit, name="banner_edit"),
    path('news_list/', views.NewsListView.as_view(), name="news_list"),
]

urlpatterns += [
    path('publish_course/', course_views.PublishCourseView.as_view(), name="publish_course"),
]

urlpatterns += [
    path('staff_view/', straff_views.StaffView.as_view(), name="staff_view"),
    path('staff_add_view/', straff_views.StaffAddView.as_view(), name="staff_add_view"),
]
