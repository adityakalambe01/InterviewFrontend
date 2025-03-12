import { Component } from '@angular/core';
import { CameraService } from '../../../core/service/camera/camera.service';

@Component({
  selector: 'app-camera',
  imports: [],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent {
  videoElement!: HTMLVideoElement;
  cameraStream!: MediaStream;
  captureInterval: any; // Store the interval ID to clear it on destroy

  constructor(private cameraService: CameraService) {}

  ngOnInit(): void {
    this.startCamera();
    this.startCaptureInterval();
  }

  ngOnDestroy(): void {
    // Stop the camera and the interval when the component is destroyed
    if (this.cameraStream) {
      this.cameraService.stopCameraStream(this.cameraStream);
    }
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
    }
  }

  startCamera(): void {
    this.cameraService
      .getCameraStream()
      .then((stream) => {
        this.cameraStream = stream;
        this.videoElement = <HTMLVideoElement>document.getElementById('videoElement');
        this.videoElement.srcObject = stream;
        this.videoElement.play();
      })
      .catch((err) => {
        console.error('Error starting camera: ', err);
      });
  }

  // Set up an interval to capture the image every 30 seconds
  startCaptureInterval(): void {
    this.captureInterval = setInterval(() => {
      this.captureImage();
    }, 30000); // 30000 ms = 30 seconds
  }

  // Capture image from the video feed and log it or display it
  captureImage(): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (this.videoElement && ctx) {
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;

      // Draw the current frame of the video onto the canvas
      ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL (image)
      const imageDataUrl = canvas.toDataURL('image/png');

      // For demonstration, log the image or store it
      console.log(imageDataUrl); // You can replace this with logic to store/display the image

      // Optionally, display the image in the component (e.g., store it in a variable)
      this.displayCapturedImage(imageDataUrl);
    }
  }

  // Optionally, display the captured image
  displayCapturedImage(imageDataUrl: string): void {
    const imageElement = document.getElementById('capturedImage') as HTMLImageElement;
    if (imageElement) {
      imageElement.src = imageDataUrl;
    }
  }
}



// import { HttpClient } from '@angular/common/http';

// constructor(private cameraService: CameraService, private http: HttpClient) {}

// captureImage(): void {
//   // Capture image logic (same as before)

//   // Send image to backend
//   this.http.post('/api/upload-image', { image: imageDataUrl }).subscribe(response => {
//     console.log('Image uploaded successfully:', response);
//   });
// }
