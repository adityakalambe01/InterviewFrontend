import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'timeDifference',
  pure: false
})
export class TimeDifferencePipe implements PipeTransform, OnDestroy {
  private intervalId: any;
  private currentTime: Date = new Date();
  private subscription!: Subscription;

  constructor(private cdr: ChangeDetectorRef) {
    // Update the current time every minute
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.markForCheck();  // Trigger change detection manually
    }, 60000);  // Every 1 minute
  }

  transform(startTime: string | Date): string {
    if (!startTime) return '';

    const startDate = new Date(startTime);
    const diffInMs = this.currentTime.getTime() - startDate.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return `${hours}hr ${minutes}min`;
  }

  ngOnDestroy(): void {
    // Clear the interval when the pipe is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
