import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ProjectService } from '../../../core/service/http/project/project.service';
import { Subscription } from 'rxjs';
import { InterviewService } from '../../../core/service/http/interview/interview.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-challenge-modal',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './challenge-modal.component.html',
  styleUrl: './challenge-modal.component.css',
})
export class ChallengeModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() _ids: any;
  @Output() onDismiss: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSaveChallenge: EventEmitter<any> = new EventEmitter<any>();

  private subscription!: Subscription;

  protected projects!: any;
  protected challengeForm!: FormGroup;

  constructor(
    private interviewService: InterviewService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();

  }
  initChallengeForm() {
    this.challengeForm = new FormGroup({
      _id: new FormControl(''),
      title: new FormControl('', [Validators.required, Validators.min(3)]),
      projectId: new FormControl('', [Validators.required]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initChallengeForm();
    const { interviewSessionId, challengeSessionId } =
    changes['_ids'].currentValue;

    if (interviewSessionId && challengeSessionId) {
      this.getChallengeDetails(changes['_ids'].currentValue);
    }
  }

  getChallengeDetails(obj: any) {
    this.subscription = this.interviewService
      .getCandidateInterviewChallenge({
        interviewSessionId: obj.interviewSessionId,
        challengeSessionId: obj.challengeSessionId,
      })
      .subscribe({
        next: (response: any) => {
          this.challengeForm.patchValue(response.challengeSession);
        },
        error: (err: any) => {
          console.error('Error fetching challenge details:', err);
        },
      });
  }
  onSubmitChallengeForm() {
    if (this.challengeForm.valid)
      this.onSaveChallenge.emit(this.challengeForm.value);
  }
  onCloseModal() {
    this.onDismiss.emit();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  getAllProjects() {
    this.subscription = this.projectService
      .getProjects({
        page: 1,
        limit: 999,
      })
      .subscribe({
        next: (response: any) => {
          console.log(response.projects);
          this.projects = response.projects;
        },
        error: (err: any) => {
          console.error('Error fetching projects:', err);
        },
      });
  }
}
