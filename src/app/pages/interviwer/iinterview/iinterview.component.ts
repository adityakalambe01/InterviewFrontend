import { Component, OnDestroy, OnInit } from '@angular/core';
import { InterviwerRouteConstant } from '../interviwer.routes';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { InterviewService } from '../../../core/service/http/interview/interview.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TimeDifferencePipe } from '../../../core/pipe/time-difference/time-difference.pipe';
import { PaginationComponent } from '../../../shared/reuseable-component/pagination/pagination.component';
import {
  PaginationHelper,
  PaginationQueryParams,
} from '../../../core/models/Pagination.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { initFlowbite, Modal } from 'flowbite';
import { NotificationService } from '../../../core/service/notification/notification.service';
@Component({
  selector: 'app-iinterview',
  imports: [
    RouterLink,
    CommonModule,
    DatePipe,
    TimeDifferencePipe,
    PaginationComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './iinterview.component.html',
  styleUrl: './iinterview.component.css',
})
export class IInterviewComponent implements OnInit, OnDestroy {
  protected interviwerRoutConst = InterviwerRouteConstant;
  private subscription!: Subscription;
  protected interviews!: any;
  protected paginationHelper!: PaginationHelper;
  protected pageQueryParams!: PaginationQueryParams;
  protected interviewForm!: FormGroup;

  protected modal: Modal | null = null;

  constructor(
    private interviewService: InterviewService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initInterviewForm();
    this.paginationHelper = new PaginationHelper();
    this.paginationHelper.setLimit = [
      { value: 6 },
      { value: 9, selected: true },
      { value: 15 },
      { value: 30 },
    ];
  }

  initInterviewForm() {
    this.interviewForm = new FormGroup({
      _id: new FormControl(''),
      candidateName: new FormControl('', [
        Validators.required,
        Validators.min(5),
      ]),
    });
    this.initModal();
  }

  initModal() {
    initFlowbite();
    const modalEl = document.getElementById('interview-modal');
    if (modalEl) {
      this.modal = new Modal(modalEl);
    }
  }

  getInterviews(): void {
    this.subscription = this.interviewService
      .getInterview(this.pageQueryParams)
      .subscribe((response: any) => {
        this.interviews = response.sessions;
        this.paginationHelper.setCurrentPage = response.currentPage;
        this.paginationHelper.setTotalDocuments = response.totalSessions;
        this.paginationHelper.setTotalPages = response.totalPages;
      });
  }

  convertMinutesToHrMin(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}hr ${minutes}min`;
  }

  onDeleteInterview(interviewId: string) {
    this.notificationService
      .showConfirmation('Are you sure you want to delete this interview?')
      .then((response: boolean) => {
        if (response) {
          this.interviewService.deleteInterview(interviewId).subscribe(() => {
            this.notificationService.showSuccess('Interview deleted successfully');
            this.getInterviews();
          });
        }
      });
  }

  onChangePageOrSize(queryParams: PaginationQueryParams) {
    this.pageQueryParams = queryParams;
    this.getInterviews();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSaveNewInterview() {
    const { _id, ...restObject } = this.interviewForm.value;
    this.subscription = this.interviewService
      .scheduleInterview(restObject)
      .subscribe({
        next: (res: any) => {
          this.notificationService.showSuccess(res.message);
          this.getInterviews();
          this.initInterviewForm();
          this.dismissModal();
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }
  onUpdateInterview() {
    this.subscription = this.interviewService
      .updateInterview(this.interviewForm.value)
      .subscribe({
        next: (res: any) => {
          this.notificationService.showSuccess(res.message);
          this.getInterviews();
          this.initInterviewForm();
          this.dismissModal();
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  onEditInterview(interview: any) {
    this.interviewForm.patchValue(interview);
    this.showModal();
  }

  showModal() {
    this.modal?.show();
  }

  dismissModal() {
    this.modal?.hide();
  }
}
