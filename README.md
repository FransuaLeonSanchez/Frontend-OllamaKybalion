# Frontend-OllamaKybalion

Interfaz web tipo Postman para probar la API de análisis de texto OllamaKybalion. Construida con React, TypeScript y Tailwind CSS.

## Características

- Endpoints predefinidos (`/test`, `/question`, `/custom`) y **endpoint personalizado** con ruta editable
- Selección de **verbo HTTP** (GET/POST/PUT/PATCH/DELETE) para custom/personalizado
- Editor de body en **modo campos** (clave-valor estilo Postman) o **JSON**, sincronizados
- Pestañas de **Headers** y **Autenticación** (Bearer / API Key / Basic)
- **Copiar como cURL** del request configurado
- Respuesta con **status, tiempo y tamaño**, vista JSON o formulario

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

# Verificar healthcheck
curl http://localhost:6001/health
```

> Nota: el puerto 6000 lo bloquea Chrome (`ERR_UNSAFE_PORT`). Por eso se usa 6001.
