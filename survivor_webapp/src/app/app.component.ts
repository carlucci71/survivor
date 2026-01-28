import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from './core/components/loading-overlay.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { environment } from '../environments/environment';
import { PushService } from './core/services/push.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlayComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'survivor_webapp';

  constructor(private pushService: PushService) {}

  ngOnInit() {
    // Applica il tema dall'environment
    document.documentElement.style.setProperty('--primary-color', environment.theme.primary);
    document.body.classList.add(`theme-${environment.theme.name}`);

    void this.pushService.initPush();
  }
}
