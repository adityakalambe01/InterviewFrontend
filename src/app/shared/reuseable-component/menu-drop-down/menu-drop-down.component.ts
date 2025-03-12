import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {initFlowbite, Dropdown} from 'flowbite'

@Component({
  selector: 'app-menu-drop-down',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-drop-down.component.html',
  styleUrl: './menu-drop-down.component.css',
})
export class MenuDropDownComponent implements OnInit, AfterViewInit {
  @Input() dropdownMenuIconButton!: string;
  @Input() dropdownDots!: string;
  @Input() menuItems!: { title: string; link?: string; fun?: Function }[];
  dropdownInstances: Map<string, Dropdown> = new Map();
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  toggleDropDown(id: string, dot: string) {
    const dropdownElement = document.getElementById(id);
    const dropdownButton = document.getElementById(dot);

    if (dropdownElement && dropdownButton) {
      let dropdown = this.dropdownInstances.get(id);

      if (!dropdown) {
        // Initialize dropdown once and store it in the map
        dropdown = new Dropdown(dropdownElement, dropdownButton);
        this.dropdownInstances.set(id, dropdown);
      }

      // Toggle dropdown
      dropdown.toggle();
    }
  }
}
