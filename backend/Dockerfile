FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Dependencias de sistema para Postgres
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del proyecto
COPY . .

# Preparar archivos estáticos
RUN python manage.py collectstatic --noinput

# Puerto estándar de Render
EXPOSE 10000

# Comando de inicio corregido
CMD ["gunicorn", "yuki_backend.wsgi:application", "--bind", "0.0.0.0:10000"]