# Campaign Analytics - Frontend

Frontend application for the Campaign Analytics platform, built with modern web technologies to provide a responsive and interactive user experience.

## 🚀 Tech Stack

- **Stack Tecnologico**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Enrutado**: [React Router DOM](https://reactrouter.com/)
- **Gestion de estado**: React Context API (`AuthContext`)
- **Consumo de API**: [Axios](https://axios-http.com/)
- **Graficos**: [Recharts](https://recharts.org/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Diff/PDF**: `html2canvas`, `jspdf`

## 📂 Estructura del proyecto

```
src/
├── api/
│   └── client.ts       # Instancias de axios, tipos y llamadas a la API
├── components/
│   ├── CampaignTable.tsx   # Tabla de campañas
│   └── CampaignFilters.tsx # Filtros para la tabla
├── context/
│   └── AuthContext.tsx # Contexto de autenticacion (Login/Logout)
├── pages/
│   ├── Dashboard.tsx       # Vista principal con lista de campañas
│   ├── CampaignDetail.tsx  # Vista detallada con gráficos y tablas
│   ├── CampaignCreate.tsx  # Formulario dinámico para recopilar datos de la campaña
│   └── LoginPage.tsx       # Página de inicio de sesión con diseño navidad
└── App.tsx             # Configuración de enrutado y rutas protegidas
```

## ✨ Características principales

### 1. Autenticación & Seguridad
- **JWT Authentication**: Flujo de inicio de sesión seguro usando tokens de acceso.
- **Protected Routes**: Middleware que redirige usuarios no autenticados a `/login`.
- **Interceptors**: Axios interceptor automáticamente adjunta el token Bearer a las peticiones.

### 2. Dashboard
- **Pagination**: Paginación del lado del servidor sincronizada con los parámetros de URL.
- **Filtering**: Filtros para la tabla de campañas.

### 3. Visualización de Campañas
- **Dynamic Charts**: Gráficos interactivos de barras, líneas y tortas.
- **Data Tables**: Tabla detallada de Sitios, Periodos y Demografía.
- **Export**: Exportar el informe de la campaña como PDF.

## 🛠️ Setup & Running

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Correr el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación generalmente se ejecutará en `http://localhost:5173`.

3. **Build para producción**:
   ```bash
   npm run build
   ```

## 🔐 Variables de entorno

- `VITE_API_URL`: URL base para la API (default: `http://127.0.0.1:8000`).
