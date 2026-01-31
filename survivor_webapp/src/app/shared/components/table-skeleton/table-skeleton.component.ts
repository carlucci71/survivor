import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-skeleton">
      <div class="skeleton-header">
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
      </div>
      <div class="skeleton-row" *ngFor="let row of rows">
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
      </div>
    </div>
  `,
  styles: [`
    .table-skeleton {
      width: 100%;
      padding: 16px;
    }

    .skeleton-header,
    .skeleton-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin-bottom: 12px;
    }

    .skeleton-header .skeleton-cell {
      height: 36px;
      background: linear-gradient(
        90deg,
        #d0d0d0 0%,
        #c0c0c0 20%,
        #d0d0d0 40%,
        #d0d0d0 100%
      );
      border-radius: 6px;
    }

    .skeleton-row .skeleton-cell {
      height: 48px;
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

    @media (max-width: 768px) {
      .skeleton-header,
      .skeleton-row {
        grid-template-columns: repeat(3, 1fr);
      }

      .skeleton-cell:nth-child(4),
      .skeleton-cell:nth-child(5) {
        display: none;
      }
    }
  `]
})
export class TableSkeletonComponent {
  rows = Array(5).fill(0); // 5 righe di skeleton
}
