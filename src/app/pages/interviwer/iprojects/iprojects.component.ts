import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from '../../../core/service/http/project/project.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../shared/reuseable-component/pagination/pagination.component';
import { SearchbarComponent } from '../../../shared/reuseable-component/searchbar/searchbar.component';
import {
  PaginationHelper,
  PaginationQueryParams,
} from '../../../core/models/Pagination.model';
import { ProjectModalComponent } from '../../../shared/reuseable-component/project-modal/project-modal.component';
import { Modal, initFlowbite } from 'flowbite';
import { NotificationService } from '../../../core/service/notification/notification.service';
@Component({
  selector: 'app-iprojects',
  imports: [
    CommonModule,
    PaginationComponent,
    SearchbarComponent,
    ProjectModalComponent,
  ],
  templateUrl: './iprojects.component.html',
  styleUrl: './iprojects.component.css',
})
export class IProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription!: Subscription;
  protected projects!: any;
  protected paginationHelper!: PaginationHelper;
  protected project!: any;

  private modal: Modal | null = null;

  protected pageQueryParams!: PaginationQueryParams;
  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeModal();
    this.paginationHelper = new PaginationHelper();
    this.paginationHelper.limit = [
      { value: 6 },
      { value: 9, selected: true },
      { value: 12 },
      { value: 18 },
    ];
  }

  initializeModal() {
    initFlowbite();
    const modalEl = document.getElementById('project-modal');
    if (modalEl) {
      this.modal = new Modal(modalEl);
    }
  }
  ngAfterViewInit(): void {
  }

  getProjects(search?: any): void {
    this.subscription = this.projectService
      .getProjects({ ...this.pageQueryParams, ...search })
      .subscribe((response: any) => {
        this.projects = response.projects;
        this.paginationHelper.currentPage = response.currentPage;
        this.paginationHelper.totalPages = response.totalPages;
        this.paginationHelper.totalDocuments = response.totalProjects;
      });
  }

  onSearchProject(search: String) {
    this.pageQueryParams.page = 1;
    this.getProjects({ title: search });
  }

  onDeleteProject(projectId: String) {
    this.notificationService
      .showConfirmation('Are you sure you want to delete this project?')
      .then((response: any) => {
        if(response){
          this.subscription = this.projectService
            .deleteProject(projectId)
            .subscribe((response: any) => {
              this.notificationService.showSuccess(
                'Project deleted successfully'
              );
              this.getProjects();
            });
        }

      });
  }

  onChangePageOrSize(queryParams: PaginationQueryParams) {
    this.pageQueryParams = queryParams;
    this.getProjects();
  }

  onNewProject() {
    this.project = '';
    this.showModelForm();
  }
  onEditProject(project: any) {
    this.project = project;
    this.showModelForm();
  }

  showModelForm() {
    this.modal?.show();
  }

  dismissModal() {
    this.modal?.hide();
  }

  onSubmitForm(project: any) {
    if (project._id) {
      this.subscription = this.projectService.updateProject(project).subscribe({
        next: (res: any) => {
          this.notificationService.showSuccess(res.message);
          this.dismissModal();
          this.getProjects();
        },
        error: (err: any) => {
          this.notificationService.showError(err.error.message);
        },
      });
    } else {
      this.subscription = this.projectService.newProject(project).subscribe({
        next: (res: any) => {
          this.notificationService.showSuccess(res.message);
          this.dismissModal();
          this.getProjects();
        },
        error: (err: any) => {
          this.notificationService.showError(err.error.message);
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
