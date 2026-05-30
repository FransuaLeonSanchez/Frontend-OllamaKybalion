# Frontend-OllamaKybalion

Interfaz web para interactuar con la API de análisis de texto OllamaKybalion. Construida con React, TypeScript y Tailwind CSS.

## Tecnologías

- Vite + React + TypeScript
- shadcn-ui
- Tailwind CSS

## Instalación

Clonar el repositorio:

```sh
git clone https://github.com/FransuaLeonSanchez/Frontend-OllamaKybalion.git
cd Frontend-OllamaKybalion
```

Instalar dependencias:

```sh
npm install
```

## Desarrollo local

```sh
npm run dev
```

El servidor estará disponible en http://localhost:8080

## Despliegue con Docker

### Docker Compose (recomendado)

```sh
sudo docker compose up -d --build
```

El servicio estará disponible en http://localhost:6001

Para usar un puerto diferente, edita `docker-compose.yml`:

```yaml
ports:
  - "PUERTO_DESEADO:80"
```

### Docker Run

```sh
sudo docker build -t ollama-kybalion:latest .

sudo docker run -d \
  --name ollama-kybalion-frontend \
  -p 6001:80 \
  --restart always \
  ollama-kybalion:latest
```

## Comandos Docker útiles

```sh
# Ver logs
sudo docker logs ollama-kybalion-frontend

# Ver estado
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Detener
sudo docker stop ollama-kybalion-frontend

# Eliminar
sudo docker rm ollama-kybalion-frontend

# Reiniciar
sudo docker restart ollama-kybalion-frontend
```
