# Sigma Frontend

Frontend de **Sigma**, un sistema de gestión para centros de acuicultura: administración de usuarios y roles, centros de cultivo, pozas/estanques, sensores y dispositivos, con autenticación por RUT y verificación en dos pasos (2FA).

> Este proyecto nació como parte de un desafío técnico en un proceso de selección con **Thoughtworks**. El diseño y la implementación de este repositorio son propios.

## Stack técnico

- [Angular 18](https://angular.dev/) (standalone components) con Server-Side Rendering (`@angular/ssr` + Express)
- [Angular Material](https://material.angular.io/) para componentes de UI
- [Tailwind CSS](https://tailwindcss.com/) para estilos utilitarios
- [RxJS](https://rxjs.dev/) para manejo de flujos asíncronos
- [ngx-toastr](https://www.npmjs.com/package/ngx-toastr) para notificaciones
- [jwt-decode](https://www.npmjs.com/package/jwt-decode) para el manejo de tokens JWT

## Funcionalidades principales

- **Autenticación** por RUT chileno, con formateo automático y detección dinámica de si el usuario requiere contraseña, más soporte de verificación en dos pasos (2FA).
- **Gestión de roles**: Owner, Científico, Administrador de centro, Administrador de sistema y Super Administrador, cada uno con su propio dashboard y rutas.
- **Administración de recursos**: centros de acuicultura, pozas/estanques y sensores (alta, edición, detalle).
- **Gestión de usuarios**: creación de usuarios, reseteo de contraseñas, asignación de personal.
- **Mis dispositivos**: vista de dispositivos vinculados a la cuenta del usuario autenticado.

## Estructura del proyecto

```
src/app/
├── authentication/          # Login (RUT + contraseña / passwordless + 2FA)
├── dashboard/                # Dashboard genérico
├── devices/                  # Gestión de dispositivos propios
├── guards/                   # AuthGuard y RoleGuard
├── interceptors/              # Interceptores HTTP (base URL, manejo de 401)
├── layouts/                  # Layouts de la app (main, auth)
├── profile/                   # Perfil de usuario
├── ResourcesManagment/         # Gestión de centros de acuicultura y pozas
├── services/                  # Servicios de dominio (auth, usuarios, pozas, sensores, etc.)
├── shared/                    # Modales y componentes reutilizables
├── users/                     # Vistas específicas por rol (system-admin, center-admin, scientist)
└── interfaces/ · types/        # Contratos de datos y respuestas de API
```

## Puesta en marcha

### Requisitos

- Node.js 18+
- Angular CLI 18 (`npm install -g @angular/cli`)

### Instalación

```bash
npm install
```

### Configuración

La URL del backend se define en los archivos de entorno (`src/environments/`):

```ts
// src/environments/environment.development.ts
export const environment = {
  production: false,
  API_URL: "http://localhost:3000",
};
```

### Servidor de desarrollo

```bash
npm start
```

Navega a `http://localhost:4200/`. La aplicación se recarga automáticamente al detectar cambios.

### Build y SSR

```bash
npm run build
npm run serve:ssr:sigma-frontend
```

### Tests

```bash
npm test
```

## Estado del proyecto

Este repositorio está en proceso de revisión y hardening (autorización por rol a nivel de rutas, limpieza de código muerto, consistencia en el manejo de tokens) antes de considerarse listo para producción.
