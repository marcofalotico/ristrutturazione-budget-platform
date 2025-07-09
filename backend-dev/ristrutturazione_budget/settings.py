from pathlib import Path
from decouple import config  # Per leggere variabili .env

# 📌 Path di base del progetto
BASE_DIR = Path(__file__).resolve().parent.parent

# 📌 Chiave segreta
SECRET_KEY = config('DJANGO_SECRET_KEY', default='cambiala')

# 📌 Debug da .env
DEBUG = config('DJANGO_DEBUG', default=True, cast=bool)

# 📌 Host consentiti da .env
ALLOWED_HOSTS = config('DJANGO_ALLOWED_HOSTS', default='127.0.0.1,localhost').split(',')

# 📌 App installate
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # REST & JWT
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'api',
]

# 📌 Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 📌 Templates (obbligatorio per admin)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 📌 URL principale
ROOT_URLCONF = 'ristrutturazione_budget.urls'

# 📌 WSGI Application
WSGI_APPLICATION = 'ristrutturazione_budget.wsgi.application'

# 📌 REST Framework + JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# 📌 CORS per React
CORS_ALLOW_ALL_ORIGINS = True

# 📌 Database: SQLite configurato correttamente
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 📌 Validatori password default
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# 📌 Internazionalizzazione base
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# 📌 Static files URL
STATIC_URL = 'static/'

# 📌 PK default
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
