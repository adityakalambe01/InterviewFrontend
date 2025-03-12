import { authRouteConstant } from './../auth.routes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/service/http/auth/auth.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../core/service/storage/local-storage/local-storage.service';
import { Router, RouterLink } from '@angular/router';
import { InterviwerRouteConstant } from '../../interviwer/interviwer.routes';
import { SpinnerComponent } from '../../../shared/reuseable-component/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/service/notification/notification.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, SpinnerComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends AuthService implements OnInit, OnDestroy {
  protected authRouteConst = authRouteConstant;
  protected loginForm!: FormGroup;
  private subscripton!: Subscription;
  private InterviwerRouteConstant = InterviwerRouteConstant;
  protected isLoading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private localStorageServ: LocalStorageService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    super();
  }
  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['demo@angularminds.com', Validators.required],
      password: ['Demo@123', Validators.required],
    });
  }

  onClickLogin() {
    this.isLoading = true;
    this.subscripton = super
      .authLogin({ ...this.loginForm.value, skipCaptcha: true })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.notificationService.showSuccess("Login successful!");
          this.localStorageServ.setToken(response.token);
          this.router.navigateByUrl(InterviwerRouteConstant.MAIN_PAGE);
        },
        error: (error: any) => {
          this.notificationService.showError(error.error.message);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subscripton) this.subscripton.unsubscribe();
  }
}
