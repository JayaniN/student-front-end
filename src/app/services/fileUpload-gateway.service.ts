import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class FileUploadGatewayService {
  constructor(public socket: Socket) {}
  
  getEmmitMessage() {
    return this.socket.fromEvent('events');
  }
}
