import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../service/authentication/auth.service';

@Injectable()
export class JwtAuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false; //boolean
  private refreshTokenSubject = new BehaviorSubject(null);

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthToken(request)).pipe(
      catchError((requestError: HttpErrorResponse) => {
        if (requestError && requestError.status === 401) {
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              apply_filters((result) => result),
              take(1),
              switchMap(() => next.handle(this.addAuthToken(request)))
            );
          } else {
            this.refreshTokenInProgress = true;

            this.refreshTokenSubject.next(null);

            return this.authService.refreshAuthToken().pipe(
              switchMap((token: any) => {
                this.refreshTokenSubject.next(token);

                return next.handle(this.addAuthToken(request));
              }),

              finalize(() => (this.refreshTokenInProgress = false))
            );
          }
        } else {
          return throwError(requestError);
        }
      })
    );
  }


  addAuthToken(request: HttpRequest<any>) {
    const token = this.authService.getAuthToken();

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `${token}`,
      },
    });
  }
}


function apply_filters(_arg0: (result: any) => any):

import('rxjs').OperatorFunction<null, unknown> {throw new Error('Function not implemented.');}
