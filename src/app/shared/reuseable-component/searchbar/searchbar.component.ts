import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  imports: [],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
  @Input() search!:String;
  @Output() searchButton:EventEmitter<any> = new EventEmitter<any>();

  searchInputChange(event: any) {
    this.searchButton.emit(event.target.value);
  }
}
