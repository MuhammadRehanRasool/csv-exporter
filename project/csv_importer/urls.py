from django.urls import re_path
from . import views
urlpatterns = [
    re_path(r'^users$', views.users_list),
    re_path(r'^users/validate$', views.login_check),
    re_path(r'^data$', views.raw_data),
    re_path(r'^records/(?P<pk>[0-9]+)$', views.log),
]
