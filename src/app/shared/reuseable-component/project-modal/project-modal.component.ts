import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-modal',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css'],
})
export class ProjectModalComponent implements OnInit, OnChanges {
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSubmitForm: EventEmitter<any> = new EventEmitter<any>();
  @Input() project: any;
  protected projectForm!: FormGroup;
  protected skillsVisible: boolean = false;
  protected newSkill: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.initProjectForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initProjectForm();

    if (changes['project'] && changes['project'].currentValue) {
      const currentProject = changes['project'].currentValue;

      if (this.projectForm) {
        this.projectForm.patchValue({
          _id: currentProject._id,
          title: currentProject.title,
          stackBlitzUrl: currentProject.stackBlitzUrl,
        });

        const skillsArray = this.projectForm.get('skills') as FormArray;
        skillsArray.clear();

        if (currentProject.skills && currentProject.skills.length > 0) {
          currentProject.skills.forEach((skill: string) => {
            skillsArray.push(new FormControl(skill));
          });
        }
      }
    }
  }

  initProjectForm() {
    this.projectForm = new FormGroup({
      _id: new FormControl(''),
      title: new FormControl('', [Validators.required, Validators.min(5)]),
      stackBlitzUrl: new FormControl('', [Validators.required]),
      skills: new FormArray([]), // Ensure the FormArray is initialized here
    });
  }

  get skills(): FormArray {
    return this.projectForm.get('skills') as FormArray;
  }

  addSkill() {
    if (this.newSkill.trim()) {
      this.skills.push(
        new FormControl(this.newSkill.trim(), [Validators.required])
      );
      this.newSkill = '';
      // this.skillsVisible = false;
    }
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  toggleSkillInput() {
    this.skillsVisible = !this.skillsVisible;
  }

  onClickCancel() {
    this.onCancel.emit();
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.onSubmitForm.emit(this.projectForm.value);
    }
  }
}
