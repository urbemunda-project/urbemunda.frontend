import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor() {}

  add(message) {
    console.log(message);
  }
}
