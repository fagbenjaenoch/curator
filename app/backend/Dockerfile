FROM python:3.11-slim AS base

COPY --from=ghcr.io/astral-sh/uv:0.9.6 /uv /uvx /bin/

WORKDIR /app

# --------- PROD STAGE --------- 
FROM base AS prod

ENV UV_COMPILE_BYTECODE=1

RUN uv sync --locked

COPY . .

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

# --------- DEV STAGE --------- 
FROM base AS dev

ENV UV_COMPILE_BYTECODE=1

RUN uv sync --locked

COPY . .

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]