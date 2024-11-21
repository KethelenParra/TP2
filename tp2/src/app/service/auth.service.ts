import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  login(username: string, senha: string, perfil: number): Observable<any> {
    const payload = { username, senha, perfil };
    return this.http.post(this.apiUrl, payload, { observe: 'response' }).pipe(
      map((response) => {
        const token = response.headers.get('Authorization');
        if (token) {
          localStorage.setItem('token', token);
          this.loggedIn.next(true);
        }
        return response.body;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.groups ? decodedToken.groups[0] : null;
    }
    return null;
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
