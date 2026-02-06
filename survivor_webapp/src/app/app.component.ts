import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from './core/components/loading-overlay.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PushService } from './core/services/push.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlayComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'survivor_webapp';

  constructor(
    private readonly pushService: PushService
  ) {}
}
