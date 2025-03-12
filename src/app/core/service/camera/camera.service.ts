import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }
  getCameraStream(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          resolve(stream);
        })
        .catch((err) => {
          console.error('Error accessing camera: ', err);
          reject(err);
        });
    });
  }

  stopCameraStream(stream: MediaStream): void {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
}
