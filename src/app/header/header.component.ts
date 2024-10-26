import { Component } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  userSub:Subscription;
  isAuthenticated=false;
  constructor(private dataStorageService: DataStorageService,private authService:AuthService) {}
  ngOnInit(){
    this.userSub=this.authService.user.subscribe((user)=>{
this.isAuthenticated=!!user;
    });
    console.log("initial header");
  }
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.userSub.unsubscribe();
    console.log("destroy header");
  }
}
