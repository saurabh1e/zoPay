import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {Storage} from '@ionic/storage';
import {switchMap} from 'rxjs/operators';


@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private storage: Storage) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // do not intercept request whose urls are filtered by the injected filter
    const obs = from(this.storage.get('auth_token'));
    return obs.pipe(switchMap(token => {
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
    }));

  }
}
