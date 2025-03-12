import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  socket: Socket;
  constructor() {
    this.socket = io(environment.API_URL);
  }

  getResponse(event: string) {
    return new Observable((observer) => {
      this.socket.on(event, (data: any) => {
        observer.next(data);
      });
    });
  }

  sendData(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
