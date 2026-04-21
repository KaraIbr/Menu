FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p staticfiles media

EXPOSE 10000

CMD ["gunicorn", "--bind", ":10000", "--workers", "2", "--chdir", "/app", "yuki_backend.wsgi:application"]