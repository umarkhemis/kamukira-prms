from .base import *
import os
import dj_database_url

DEBUG = False

SECRET_KEY = os.environ['SECRET_KEY']

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')



DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.environ.get('POSTGRES_DB', 'kamukira_prms'),
#         'USER': os.environ.get('POSTGRES_USER', 'prms_user'),
#         'PASSWORD': os.environ.get('POSTGRES_PASSWORD', ''),
#         'HOST': os.environ.get('POSTGRES_HOST', 'db'),
#         'PORT': os.environ.get('POSTGRES_PORT', '5432'),
#     }
# }

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
