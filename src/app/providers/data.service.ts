import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpService} from './http.service';


@Injectable()
export class DataService extends HttpService<any> {

  constructor(private _http: HttpClient) {
    super(_http, {
      path: '',
    });
  }

}
