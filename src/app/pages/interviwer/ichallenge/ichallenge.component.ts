import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { InterviewService } from '../../../core/service/http/interview/interview.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TimeDifferencePipe } from '../../../core/pipe/time-difference/time-difference.pipe';
import { FormsModule } from '@angular/forms';
import { ChallengeModalComponent } from '../../../shared/reuseable-component/challenge-modal/challenge-modal.component';
import { initFlowbite, Modal } from 'flowbite';
import { ChallengeEnum } from '../../../core/constant/Challenge.enum';
import { SocketIoService } from '../../../core/service/socket/socket-io.service';
import { PaginationComponent } from '../../../shared/reuseable-component/pagination/pagination.component';
import { PaginationHelper, PaginationQueryParams } from '../../../core/models/Pagination.model';
import { NotificationService } from '../../../core/service/notification/notification.service';
import { MenuDropDownComponent } from '../../../shared/reuseable-component/menu-drop-down/menu-drop-down.component';
@Component({
  selector: 'app-ichallenge',
  imports: [
    TimeDifferencePipe,
    DatePipe,
    CommonModule,
    FormsModule,
    ChallengeModalComponent,
    PaginationComponent,
    MenuDropDownComponent,
  ],
  templateUrl: './ichallenge.component.html',
  styleUrl: './ichallenge.component.css',
})
export class IChallengeComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription!: Subscription;
  protected interview: any;
  protected challenges: any;
  private challengeModal: Modal | null = null;
  protected challengeId: string = '';
  protected challengeEnumScore = ChallengeEnum.score;
  protected paginationHelper!: PaginationHelper;
  protected pageQueryParams!: PaginationQueryParams;

  protected menuItems: { title: string; link?: string; fun?: Function, icon?:string }[] = [
    { title: 'View' },
    { title: 'Edit' },
    { title: 'Delete' },
    { title: 'Terminate' },
  ];

  constructor(
    private interviewService: InterviewService,
    private activatedRoute: ActivatedRoute,
    private socketService: SocketIoService,
    private notificationservice: NotificationService
  ) {}
  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((res: any) => {
      this.getInterviewDetails(res.interviewSessionId);
    });
    this.initializeModal();
    this.initSockets();
  }

  initSockets() {
    this.socketService
      .getResponse('onUpdateChallengeSession')
      .subscribe((response: any) => {
        this.getChallenges();
      });
    this.socketService
      .getResponse('onStartSession')
      .subscribe((response: any) => {
        this.notificationservice.showSuccess('Candidate stated the test!');
        this.getChallenges();
      });
    this.socketService
      .getResponse('onEndStartedSession')
      .subscribe((response: any) => {
        this.notificationservice.showSuccess('Candidate ended the test!');
        this.getChallenges();
      });
  }

  // Model for Addition and updation of challenge
  initializeModal() {
    initFlowbite();
    const challengeModalElement = document.getElementById('challenge-modal');
    if (challengeModalElement) {
      this.challengeModal = new Modal(challengeModalElement);
    }
  }

  ngAfterViewInit(): void {}

  getInterviewDetails(interviewSessionId: string) {
    this.subscription = this.interviewService
      .getInterviewById(interviewSessionId)
      .subscribe({
        next: (response: any) => {
          this.interview = response.session;
          this.paginationHelper = new PaginationHelper();
          this.paginationHelper.limit = [
            { value: 6 },
            { value: 9, selected: true },
            { value: 12 },
            { value: 18 },
          ];
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  convertMinutesToHrMin(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}hr ${minutes}min`;
  }

  onEndInterviewSession() {
    this.subscription = this.interviewService
      .endInterview(this.interview._id)
      .subscribe({
        next: (response: any) => {
          this.notificationservice.showSuccess(response.message);
          this.getInterviewDetails(this.interview._id);
          this.getChallenges();
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  getChallenges() {
    this.subscription = this.interviewService
      .getChallenges(this.interview._id, this.pageQueryParams)
      .subscribe({
        next: (response: any) => {
          this.challenges = response.challengeSession;
          this.paginationHelper.setCurrentPage = response.currentPage;
          this.paginationHelper.setTotalPages = response.totalPages;
          this.paginationHelper.setTotalDocuments = response.total;
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  copyLink(examLink: string) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(examLink)
        .then(() => {
          this.notificationservice.showInfo('Link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      console.error('Clipboard API is not available on this browser');
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  showChallengeModelForm(_id: string) {
    this.challengeId = _id;
    this.challengeModal?.show();
  }

  dismissChallengeModal() {
    this.challengeId = '';
    this.challengeModal?.hide();
  }

  onCreateNewChallenge(newChallenege: any) {
    const { _id, ...restNewChallenge } = newChallenege;
    this.subscription = this.interviewService
      .createChallenge({
        interviewSessionId: this.interview._id,
        challenge: restNewChallenge,
      })
      .subscribe({
        next: (response: any) => {
          this.notificationservice.showSuccess(response.message);
          this.dismissChallengeModal();
          this.getChallenges();
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  onUpdateChallenge(existingChallenge: any, message?: string) {
    const { _id, ...restChallenge } = existingChallenge;
    this.subscription = this.interviewService
      .updateChallenge({
        interviewSessionId: this.interview._id,
        challengeId: _id,
        challenge: restChallenge,
      })
      .subscribe({
        next: (response: any) => {
          this.notificationservice.showSuccess(message || response.message);
          this.dismissChallengeModal();
          this.getChallenges();
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  onSubmitChallenge(data: any) {
    if (data._id) {
      this.onUpdateChallenge(data);
    } else {
      this.onCreateNewChallenge(data);
    }
  }

  onDeleteChallenge(challengeId: string) {
    this.notificationservice
      .showConfirmation('Are you sure you want to delete this challenge')
      .then((response: boolean) => {
        if (response) {
          this.subscription = this.interviewService
            .deleteChallenge({
              interviewSessionId: this.interview._id,
              challengeId: challengeId,
            })
            .subscribe({
              next: (response: any) => {
                this.notificationservice.showSuccess(response.message);
                this.getChallenges();
              },
              error: (err: any) => {
                console.error(err);
              },
            });
        }
      });
  }

  updateScore(_id: string, object: any) {
    this.onUpdateChallenge(
      { _id, ...object },
      `Score updated to ${object.score}`
    );
  }
  changePageOrSize(obj: PaginationQueryParams) {
    this.pageQueryParams = obj;
    this.getChallenges();
  }
}
