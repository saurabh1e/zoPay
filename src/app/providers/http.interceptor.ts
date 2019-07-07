import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // do not intercept request whose urls are filtered by the injected filter

    const token = localStorage.getItem('auth_token');
    if (token) {
      const JWT = `Bearer ${token}`;
      req = req.clone({
        setHeaders: {
          Authorization: JWT,
        },
      });
      return next.handle(req);
    } else {
      return next.handle(req);
    }
  }
}
