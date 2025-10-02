# Use an official Python runtime as a parent image
FROM python:3.11-slim as base

# Set the working directory in the container
WORKDIR /app

# --------- PROD STAGE --------- 
FROM base AS prod

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only source code (not .dockerignore’d junk)
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# --------- DEV STAGE --------- 
FROM base AS dev

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project (mounted in compose usually, but keep fallback copy)
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]