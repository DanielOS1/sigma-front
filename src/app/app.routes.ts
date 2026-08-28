import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './interfaces/entities/user.interface';
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
        canActivate: [RoleGuard],
        data: { roles: [UserRole.SYSTEM_ADMIN, UserRole.SUPER_ADMIN] },
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
        canActivate: [RoleGuard],
        data: { roles: [UserRole.AQUACULTURE_ADMIN, UserRole.SUPER_ADMIN] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./users/center-admin/dashboard-center-admin/dashboard-center-admin.component').then((m) => m.DashboardCenterAdminComponent),
          },
          {
            path: 'pond-administration',
            loadComponent: () =>
              import('./users/center-admin/pond-administration/pond-administration.component').then((m) => m.PondAdministrationComponent),
          },
          {
            path: 'sensor-administration',
            loadComponent: () =>
              import('./users/center-admin/sensor-administration/sensor-administration.component').then((m) => m.SensorAdministrationComponent),
          },
        ],
      },
      {
        path: 'scientist',
        canActivate: [RoleGuard],
        data: { roles: [UserRole.SCIENTIST, UserRole.SUPER_ADMIN] },
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./users/scientist/scientist-dashboard/scientist-dashboard.component').then((m) => m.ScientistDashboardComponent),
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

  // Cualquier URL no reconocida cae al dashboard (AuthGuard redirige a /auth si no hay sesión)
  { path: '**', redirectTo: 'dashboard' },
];
