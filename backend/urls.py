from django.urls import include, path
from django.contrib import admin
from . import views


urlpatterns = [
    path('taps/', views.taps, name='tap'),
    path('tap/<slug:tap>/schema/', views.schema_config, name='tap-schema'),
    path('tap/<slug:tap>/selected/', views.selected_fields, name='field-selected'),
    path('target/', views.target_config, name='target'),
    path('access_token/', views.access_token, name='access_token'),
    path('zip/download/', views.tar_file_generator, name='zip-package'),
    path('admin/', admin.site.urls),
    path('', views.FrontendAppView.as_view()),
]
