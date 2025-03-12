import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-challenge-instructions',
  imports: [],
  templateUrl: './challenge-instructions.component.html',
  styleUrl: './challenge-instructions.component.css',
})
export class ChallengeInstructionsComponent {
  @Output() startChallenge: EventEmitter<any> = new EventEmitter<any>();

  onStartChallenge() {
    this.startChallenge.emit();
  }
}
