import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';


export const routes: Routes = [
    { path: 'auth', loadComponent: () => import('./authentication/authentication.component').then(m => m.AuthenticationComponent) },
];
