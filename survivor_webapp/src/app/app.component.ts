import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'survivor_webapp';

  ngOnInit() {
    // Applica il tema dall'environment
    document.documentElement.style.setProperty('--primary-color', environment.theme.primary);
    document.body.classList.add(`theme-${environment.theme.name}`);
  }
}
