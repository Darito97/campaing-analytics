# Aplicacion de Analisis de Campañas Publicitarias

Los pasos necesarios para poder ejecutar este proyecto en local son los siguientes:
1. Clonar el repositorio
2. Acceder a la carpeta del backend
3. Ejecutar el siguiente comando para crear el entorno virtual: 
```bash
python -m venv venv
```
4. Activar el entorno virtual:
```bash
venv\Scripts\activate
```
5. Instalar las dependencias:
```bash
pip install -r requirements.txt
```
6. Inicializar la base de datos:
```bash
python seed.py
```
7. Ejecutar el servidor con uvicorn:
```bash
uvicorn app.main:app --reload
```
Y con esto estaria listo el backend para realizar cualquier modificacion y con hot reload podremos ver los cambios en tiempo real.

Por otro lado, para el frontend
1. Acceder a la carpeta del frontend
2. Instalar las dependencias:
```bash
npm install
```
3. Ejecutar el servidor con vite:
```bash
npm run dev
```
Y con esto estaria listo el frontend para realizar cualquier modificacion

#### Opcional:
Si necesitas verificar las pruebas necesitas hacer lo siguiente:
1. Repetir hasta el paso 6 del backend
2. Ejecutar el siguiente comando en el entorno virtual:
```bash
pytest
```

## Documentación
La documentacion del proyecto se encuentra en la siguiente url al tener levantado el servidor en local: http://127.0.0.1:8000/docs

## Deploy
El deploy del proyecto se encuentra en la siguiente url: https://campaing-analytics-wgdu.vercel.app/

