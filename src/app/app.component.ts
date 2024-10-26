import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadedFeature = 'recipe';
constructor(private a:AuthService){}
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
  ngOnInit(){
this.a.autoLogin();
  }
}
