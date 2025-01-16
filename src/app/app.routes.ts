import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./authentication/authentication.component').then((m) => m.AuthenticationComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
        children: [
          // {
          //   path: 'admin',
          //   loadComponent: () =>
          //     import('./profile/admin-profile/admin-profile.component').then((m) => m.AdminProfileComponent),
          // },
          // {
          //   path: 'user',
          //   loadComponent: () =>
          //     import('./profile/user-profile/user-profile.component').then((m) => m.UserProfileComponent),
          // }
        ]
      },
      {
        path: 'system-admin',
        loadComponent: () =>
          import('./users/system-admin/system-admin.component').then((m) => m.SystemAdminComponent),
      },
      {
        path: 'system-admin/create-user',
        loadComponent: () =>
          import('./users/system-admin/create-users/create-users.component').then((m) => m.CreateUsersComponent),
      },
      {
        path: 'system-admin/reset-password',
        loadComponent: () =>
          import('./users/system-admin/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
      },
      {
        path: 'system-admin/acquaculture-manage',
        loadComponent: () =>
          import('./acquaculture-manage/acquaculture-manage.component').then((m) => m.AcquacultureManageComponent),
      },
      {
        path: 'system-admin/create-aquaculture',
        loadComponent: () =>
          import('./acquaculture-manage/create-acquaculture/create-acquaculture.component').then((m) => m.CreateAquacultureComponent),
      }
    ]
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' },
];

