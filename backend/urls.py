from django.urls import include, path
from django.contrib import admin
from . import views


urlpatterns = [
    path('tap/', views.taps, name='tap'),
    path('admin/', admin.site.urls),
    path('tap/<slug:tap>/schema/', views.post_config, name='tap-schema'),
    path('zip/download/', views.zip_file_generator, name='zip-package'),
    path('', views.FrontendAppView.as_view()),
]
