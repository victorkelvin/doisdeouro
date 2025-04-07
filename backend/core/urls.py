from django.urls import path, include
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Other URL patterns for your core app
    path("admin/", admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Include the academia URLs with authentication
    path('api/academia', include(('apps.academia.urls' , 'apps.contas.urls'))),
    path('api/contas/', include(('apps.contas.urls'))),
    path('api/atendimento/', include(('apps.atendimento.urls'))),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)