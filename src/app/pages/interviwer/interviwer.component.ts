import { InterviwerRouteConstant } from './interviwer.routes';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LocalStorageService } from '../../core/service/storage/local-storage/local-storage.service';
import { authRouteConstant } from '../auth/auth.routes';

@Component({
  selector: 'app-interviwer',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './interviwer.component.html',
  styleUrl: './interviwer.component.css'
})
export class InterviwerComponent implements OnInit{
  protected interviwerRoute = InterviwerRouteConstant;
  constructor(private localStorageServ: LocalStorageService, private router: Router){

  }
  ngOnInit(): void {
  }

  onSignOut(): void {
    this.localStorageServ.clearToken();
    this.router.navigateByUrl(authRouteConstant.LOGIN);
  }

}
