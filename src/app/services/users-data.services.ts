import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  apiURL = environment.apiURL;
  baseUrl = `${this.apiURL}/suzuki/services/SuzukiUserDetail`;
  constructor(private http: HttpClient) {}

  getUser(data: any) {
    return this.http
      .get<any>(
        `${this.baseUrl}/suzuki-user-detail.api.controller.php?uController=GetUserDetail&uDataID=${data}`
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  postUser(data: any) {
    console.log(data);
    return this.http
      .post<any>(
        `${this.baseUrl}/suzuki-user-detail.api.controller.php?uController=PostUserDetail`,
        data
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
