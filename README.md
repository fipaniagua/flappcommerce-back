# API de Envíos

Este repositorio contiene una API para cotizar envíos utilizando dos proveedores ficticios: TraeloYa y Uder. La API está construida con NestJS y permite obtener, comparar y seleccionar la mejor tarifa de envío disponible.

## Características

- Cotización de envíos con múltiples proveedores
- Selección automática de la tarifa más económica
- Validación de datos de entrada
- Estructura modular y extensible

## Configuración

### Pre-requisitos

- Docker y Docker Compose (recomendado)
- Node.js 16+ y npm (alternativa)

### Variables de entorno

Antes de iniciar la aplicación, debes configurar las variables de entorno necesarias:

1. Crea un archivo `.env` en la raíz del proyecto:

```
TRAELO_YA_API_KEY=tu_api_key_aqui
UDER_API_KEY=tu_api_key_aqui
```

### Ejecución con Docker (Recomendado)

1. Construye y levanta el contenedor:

```bash
docker-compose up --build
```

2. La API estará disponible en: `http://localhost:3000/api`

### Ejecución sin Docker

1. Instala las dependencias:

```bash
npm install
```

2. Inicia la aplicación:

```bash
npm run start:dev
```

3. La API estará disponible en: `http://localhost:3000/api`

