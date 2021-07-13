import { FilesType, User } from './../../../shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from 'src/app/shared/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient
  ) { }

  addUser(user: FormData) {
    const url = `${SERVER_URL}users/`;
    return this.http.post(url, user);
  }

  updateUser(id:string, user: FormData) {
    const url = `${SERVER_URL}users/${id}`;
    return this.http.put(url, user);
  }

  getAllUser(): Observable<User[]> {
    const url = `${SERVER_URL}users/`;
    return this.http.get<User[]>(url);
  }

  getUserDetail(id: string): Observable<User> {
    const url = `${SERVER_URL}users/${id}`;
    return this.http.get<User>(url);
  }

  deleteUser(id: string) {
    const url = `${SERVER_URL}users/${id}`;
    return this.http.delete(url);
  }

  // updateUser(id: string, body: User) {
  //   const url = `${SERVER_URL}users/${id}`;
  //   return this.http.put(url, body);
  // }

  getFile(id: string) {
    const url = `${SERVER_URL}users/file/${id}`;
    return this.http.get(url);
  }



  handleFileChange(event: Event, acceptFileType: FilesType): Promise<any> {
    const file: File = (event.target as any).files[0];
    let fileType = file.type;
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        if (fileType.includes(acceptFileType)) {
          reader.onload = ((_) => {
            return (e: ProgressEvent) => {
              resolve(reader.result);
            };
          })(file);
        } else {
          resolve(null);
        }
        reader.readAsDataURL(file);

      } catch (_) {
        resolve(null);
      }
    });
  }
}
