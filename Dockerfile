ARG PYTHON_VERSION=3.13.2
FROM python:${PYTHON_VERSION}-slim

WORKDIR /app

COPY Pipfile Pipfile.lock ./
RUN pip install --no-cache-dir pipenv
RUN pipenv install --deploy --ignore-pipfile

# Copy all project files (including src/main.py)
COPY . .

CMD ["pipenv", "run", "python3", "src/main.py"]
