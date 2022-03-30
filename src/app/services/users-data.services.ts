import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  baseUrl = 'http://localhost/suzuki/services/SuzukiUserDetail';
  constructor(private http: HttpClient) {}

  getUser() {
    return this.http
      .get<any>(
        `${this.baseUrl}/suzuki-user-detail.api.controller.php?uController=GetUserDetail`
      )
      .pipe(
        map((res: any) => {
          return res.Data;
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
          return res.Data;
        })
      );
  }
}
