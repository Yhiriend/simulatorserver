# Simulator Server

Este servidor proporciona una API para simular y gestionar procesos y catálogos relacionados. Siga los pasos a continuación para configurar y utilizar el servidor.

## Configuración

1. **Verificar Sincronización con el Repositorio:**
   Antes de comenzar, asegúrese de que su repositorio local esté sincronizado con el repositorio remoto en GitHub.

2. **Instalar Dependencias:**
   Ejecute el siguiente comando para instalar todas las dependencias necesarias:

`` npm install ``

3. **Iniciar el Servidor:**
   Una vez que todas las dependencias estén instaladas, puede iniciar el servidor ejecutando:

`` npm run serve ``

El servidor se iniciará y estará disponible en [http://localhost:3000](http://localhost:3000) de forma predeterminada.

## Endpoints

A continuación se muestran los endpoints disponibles en este servidor:

- **POST /catalogue**
  Crea un nuevo catálogo con el formato `{ id, name }`.

- **POST /processes**
  Crea un nuevo proceso con el formato `{ PID, name, user, description, priority, id_catalogue }`.

- **POST /createTxtFile**
  Crea un archivo de texto con la información del proceso.

- **GET /readTxtFile/:fileName**
  Lee el contenido de un archivo de texto específico.

- **GET /catalogue**
  Obtiene todos los catálogos y sus procesos asociados.

- **GET /processes**
  Obtiene todos los procesos.
