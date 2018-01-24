from django.urls import include, path
from django.contrib import admin
from . import views


urlpatterns = [
    path('tap/', views.taps, name='tap'),
    path('tap/<slug:tap>/schema/', views.schema_config, name='tap-schema'),
    path('tap/<slug:tap>/selected/', views.selected_fields, name='field-selected'),
    path('target/', views.target_config, name='target'),
    path('access_token/', views.access_token, name='access_token'),
    path('zip/download/', views.zip_file_generator, name='zip-package'),
    path('admin/', admin.site.urls),
    path('', views.FrontendAppView.as_view()),
]
