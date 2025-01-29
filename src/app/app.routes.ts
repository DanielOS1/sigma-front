import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MyDevicesComponent } from './devices/my-devices/my-devices.component';

export const routes: Routes = [
  // Ruta de autenticación (sin guard)
  {
    path: 'auth',
    loadComponent: () =>
      import('./authentication/authentication.component').then((m) => m.AuthenticationComponent),
  },

  // Rutas protegidas por AuthGuard
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [AuthGuard], // Protección para rutas autenticadas
    children: [
      // Perfil: accesible para todos los roles autenticados
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
      },

      // Dashboard: general para todos los roles
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },

      // Rutas específicas para administradores del sistema
      {
        path: 'system-admin',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./users/system-admin/system-admin.component').then((m) => m.SystemAdminComponent),
          },
          {
            path: 'create-user',
            loadComponent: () =>
              import('./users/system-admin/create-users/create-users.component').then((m) => m.CreateUsersComponent),
          },
          {
            path: 'reset-password',
            loadComponent: () =>
              import('./users/system-admin/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
          },
          {
            path: 'aquaculture-manage',
            loadComponent: () =>
              import('./ResourcesManagment/acquaculture-manage/aquaculture-manage.component').then(
                (m) => m.AquacultureManageComponent
              ),
          },
          {
            path: 'view-aquaculture',
            loadComponent: () =>
              import('./ResourcesManagment/acquaculture-manage/view-aquaculture/view-aquaculture.component').then(
                (m) => m.ViewAquacultureComponent
              ),
          },
          {
            path: 'pool-managment',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./ResourcesManagment/pool-managment/pool-managment.component').then(
                    (m) => m.PoolManagmentComponent
                  ),
              },
              {
                path: 'create-pool',
                loadComponent: () =>
                  import('./ResourcesManagment/pool-managment/create-pool/create-pool.component').then(
                    (m) => m.CreatePoolComponent
                  ),
              },
            ],
          },
        ],
      },
      {
        path: 'center-admin',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./users/center-admin/dashboard-center-admin/dashboard-center-admin.component').then((m) => m.DashboardCenterAdminComponent),
          },
        ],
      },

      // Mis dispositivos
      {
        path: 'my-devices',
        component: MyDevicesComponent,
      },
    ],
  },
];
