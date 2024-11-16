import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import {finalize, tap  } from 'rxjs';
import { MessageService } from '../service/message/message.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;

    return next.handle(req).pipe(
      tap({
        next: (event) =>(ok = event instanceof HttpResponse ? 'succeeded' : ''),
        error: () => (ok = 'failed'),
      }),

      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
        this.messageService.add(msg);
      })
    );
  }
}
