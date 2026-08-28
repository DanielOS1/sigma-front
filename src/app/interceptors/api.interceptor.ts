import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.API_URL;

  // Si la URL no es absoluta, agrega la URL base
  const apiReq = req.url.startsWith('http')
    ? req
    : req.clone({ url: `${baseUrl}${req.url}` });

  return next(apiReq);
};
