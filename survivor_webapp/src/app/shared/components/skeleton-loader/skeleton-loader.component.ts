import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [ngClass]="'skeleton-' + type">
      <div class="skeleton-item" [style.width]="width" [style.height]="height"></div>
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      padding: 8px 0;
    }

    .skeleton-item {
      background: linear-gradient(
        90deg,
        #f0f0f0 0%,
        #e0e0e0 20%,
        #f0f0f0 40%,
        #f0f0f0 100%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s ease-in-out infinite;
      border-radius: 4px;
    }

    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    /* Varianti */
    .skeleton-title .skeleton-item {
      height: 24px;
      border-radius: 6px;
    }

    .skeleton-text .skeleton-item {
      height: 16px;
      border-radius: 4px;
    }

    .skeleton-card .skeleton-item {
      height: 150px;
      border-radius: 12px;
    }

    .skeleton-avatar .skeleton-item {
      border-radius: 50%;
    }

    .skeleton-button .skeleton-item {
      height: 40px;
      border-radius: 20px;
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: 'text' | 'title' | 'card' | 'avatar' | 'button' | 'custom' = 'text';
  @Input() width: string = '100%';
  @Input() height: string = '16px';
}
