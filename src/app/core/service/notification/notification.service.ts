import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      htmlContainer: '!bg-gray-900',
    },
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  constructor() {}

  showSuccess(message: string): void {
    this.toast.fire({
      icon: 'success',
      title: message,
    });
  }

  showError(message: string): void {
    this.toast.fire({
      icon: 'error',
      title: message,
    });
  }

  showWarning(message: string): void {
    this.toast.fire({
      icon: 'warning',
      title: message,
    });
  }

  showInfo(message: string): void {
    this.toast.fire({
      icon: 'info',
      title: message,
    });
  }

  showConfirmation(
    message: string,
    title: string = 'Are you sure?',
    confirmButtonText: string = 'Yes, proceed!',
    cancelButtonText: string = 'No, cancel!'
  ): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    }).then((result) => result.isConfirmed);
  }
}
