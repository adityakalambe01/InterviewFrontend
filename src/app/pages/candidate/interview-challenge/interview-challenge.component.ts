import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InterviewService } from '../../../core/service/http/interview/interview.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeDifferencePipe } from '../../../core/pipe/time-difference/time-difference.pipe';
import { candidateRoutesConstant } from '../candidate.routes';
import { PagesRouteConstants } from '../../pages.routes';
import { NotificationService } from '../../../core/service/notification/notification.service';
import { DomUtil } from '../../../core/util/Dom.util';
import sdk from '@stackblitz/sdk';
import { ChallengeInstructionsComponent } from '../challenge-instructions/challenge-instructions.component';
import { CameraComponent } from '../../../shared/reuseable-component/camera/camera.component';
@Component({
  selector: 'app-interview-challenge',
  templateUrl: './interview-challenge.component.html',
  styleUrls: ['./interview-challenge.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    TimeDifferencePipe,
    ChallengeInstructionsComponent,
    CameraComponent
  ],
})
export class InterviewChallengeComponent implements OnInit, OnDestroy {
  private routeSubscription!: Subscription;
  private challengeSubscription!: Subscription;
  protected challengeSession: any = {
    startTime: Date.now(),
    endTime: Date.now(),
  };
  protected forkedStackBlitzUrl: SafeResourceUrl = '';
  private _ids!: any;

  stackblitzData: any = {};
  deviceHeight: number = 0;

  // Store the reference of the bound event listener
  private visibilityChangeHandler: (() => void) | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private interviewService: InterviewService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe({
      next: (res: any) => {
        this._ids = res;
      },
      error: (err: any) => {
        console.warn('Error fetching route params:', err);
      },
    });
    this.getChallengeSession();

    this.updateHeight();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.challengeSubscription) {
      this.challengeSubscription.unsubscribe();
    }
    this.disableEventListener();
  }

  @HostListener('window:resize', ['$event'])
  updateHeight() {
    this.deviceHeight = window.innerHeight;
  }

  onVisibilityChange(): void {
    if (DomUtil.onVisibilityChange()) {
    } else {
      this.onWarning();
    }
  }

  sanitizeUrl() {
    if (this.challengeSession?.forkedStackBlitzUrl) {
      this.forkedStackBlitzUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.challengeSession.forkedStackBlitzUrl
      );
    } else {
      console.warn('No forkedStackBlitzUrl available');
    }
  }

  getChallengeSession(): void {
    this.challengeSubscription = this.interviewService
      .getCandidateInterviewChallenge(this._ids)
      .subscribe({
        next: (response: any) => {
          if (!response.challengeSession.endTime) {
            this.challengeSession = response.challengeSession;
            this.sanitizeUrl();
            if (response.challengeSession.startTime) {
              DomUtil.enableFullScreen();
              DomUtil.blockBackButton();
              this.enableEventListener();
            }
            if (this.challengeSession.warningsIssued >= 2) {
              this.onEndChallengeSession();
            }
            if (response?.challengeSession?.stackblitzData) {
              this.loadProject(response.challengeSession.stackblitzData);
            } else {
              setTimeout(() => this.createNewProject(), 500);
            }
          } else {
            this.router.navigateByUrl(PagesRouteConstants.notFound);
          }
        },
        error: (err: any) => {
          this.router.navigateByUrl(PagesRouteConstants.notFound);
        },
      });
  }

  onStartChallengeSession(): void {
    this.challengeSubscription = this.interviewService
      .startInterviewChallenge(this._ids)
      .subscribe({
        next: (response: any) => {
          this.challengeSession = response.challengeSession;
          DomUtil.preventExit();
          DomUtil.enableFullScreen();
          DomUtil.blockBackButton();
          this.sanitizeUrl();
          this.enableEventListener();
          setTimeout(() => this.createNewProject(), 500);
        },
        error: (err: any) => {
          console.warn('Error fetching challenge session:', err);
        },
      });
  }

  enableEventListener() {
    this.visibilityChangeHandler = this.onVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  onEndChallengeSession() {
    this.challengeSubscription = this.interviewService
      .endInterviewChallenge(this._ids)
      .subscribe({
        next: (response: any) => {
          this.challengeSession = response.challengeSession;
          this.router.navigateByUrl(
            `${this.router.url}${candidateRoutesConstant.submitResponse}`
          );
          this.sanitizeUrl();
          this.disableEventListener();
          DomUtil.disableFullScreen();
        },
        error: (err: any) => {
          console.warn('Error fetching challenge session:', err);
        },
      });
  }

  disableEventListener() {
    if (this.visibilityChangeHandler) {
      document.removeEventListener(
        'visibilitychange',
        this.visibilityChangeHandler
      );
      this.visibilityChangeHandler = null;
    }

    setTimeout(() => {
      window.close();
    }, 500);
  }

  onWarning() {
    const { interviewSessionId, challengeSessionId: challengeId } = this._ids;
    this.challengeSubscription = this.interviewService
      .updateChallenge({
        interviewSessionId,
        challengeId,
        challenge: { warningsIssued: this.challengeSession.warningsIssued + 1 },
      })
      .subscribe({
        next: (response: any) => {
          console.log('Warning updated');
          this.challengeSession.warningsIssued =
            response.challengeSession.warningsIssued;
          this.notificationService.showWarning(
            'Warning switching tab is not allowed'
          );
        },
        error: (err: any) => {
          console.warn('Error updating warning:', err);
        },
      });
    if (this.challengeSession.warningsIssued >= 2) {
      this.onEndChallengeSession();
    }
  }

  loadProject(stackblitzData?: any) {
    if (stackblitzData?.files) {
      console.log(stackblitzData);

      this.stackblitzData = stackblitzData;

      console.log('Loading saved project:', this.stackblitzData.files); // Debugging
      setTimeout(() => {
        sdk.embedProject(
          'editor-container',
          { ...this.stackblitzData, template: 'node' },
          {
            forceEmbedLayout: true,
            height: this.deviceHeight,
            openFile: 'package.json',
          }
        );
      }, 2000);
    } else {
      console.log('files not found');
      console.warn('No saved project found, creating a new one.');
      this.createNewProject();
    }
  }

  // Create a new StackBlitz project
  createNewProject() {
    sdk
      .embedProjectId(
        'editor-container',
        InterviewService.getProjectId(this.forkedStackBlitzUrl as string),
        {
          forceEmbedLayout: true,
          height: this.deviceHeight,
          openFile: 'package.json',
        }
      )
      .then((editor) => {
        editor.getFsSnapshot().then((files) => {
          const detectedTemplate =
            InterviewService.detectProjectTemplate(files);

          this.stackblitzData = {
            files,
            title: 'Forked StackBlitz Project',
            description: 'Dynamically forked from StackBlitz',
            template: detectedTemplate,
          };
        });
      })
      .catch((error) => console.error('Error embedding project:', error));
  }

  saveProject() {
    const { interviewSessionId, challengeSessionId: challengeId } = this._ids;
    sdk
      .connect(document.getElementById('editor-container') as HTMLIFrameElement)
      .then((editor) => {
        return editor.getFsSnapshot();
      })
      .then((files) => {
        this.stackblitzData = {
          files,
          title: 'Updated StackBlitz Project',
          description: 'Project with latest changes',
          template: InterviewService.detectProjectTemplate(files),
        };

        this.interviewService
          .updateStackblitzData(
            interviewSessionId,
            challengeId,
            this.stackblitzData
          )
          .subscribe(
            (response: any) => {
              console.log(response);
            },
            (error) => {
              console.error('Error saving updated files:', error);
            }
          );
      })
      .catch((error) =>
        console.error('Error retrieving StackBlitz files:', error)
      );
  }
}
