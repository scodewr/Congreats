.PHONY: build up down restart logs ps

## Gera o package-lock.json do frontend se não existir, depois builda as imagens
build:
	@if [ ! -f frontend/package-lock.json ]; then \
		echo ">> Gerando frontend/package-lock.json..."; \
		cd frontend && npm install --package-lock-only; \
	fi
	docker compose build

## Build + sobe todos os serviços em background
up:
	@$(MAKE) build
	docker compose up -d

## Para e remove os containers (dados preservados)
down:
	docker compose down

## Para, remove containers E volumes (apaga banco e uploads)
down-v:
	docker compose down -v

## Para e sobe novamente
restart:
	docker compose down
	docker compose up -d

## Acompanha os logs de todos os serviços
logs:
	docker compose logs -f

## Lista containers e status
ps:
	docker compose ps
