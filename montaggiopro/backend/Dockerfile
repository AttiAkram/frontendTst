FROM python:3.11.4-slim

LABEL maintainer="aufrutten@gmail.com"

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV SECRET_KEY=ONLY_FOR_TEST

RUN apt update && apt install -y netcat-traditional

WORKDIR /app/
COPY . .

RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r requirements.txt

RUN chmod -R 777 /app/scripts/
RUN coverage run manage.py test --settings=backend.test_settings || exit 1

EXPOSE 8080

CMD ["/bin/sh", "-c", "/app/scripts/backend_entrypoint.sh"]
