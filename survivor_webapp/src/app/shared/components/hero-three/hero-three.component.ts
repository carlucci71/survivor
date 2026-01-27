import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-three',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-container">
      <div class="fields-container">
        <!-- Sezione Calcio -->
        <div class="field-section soccer-section">
          <svg class="field-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 267 400">
            <g class="soccer-field">
              <rect x="10" y="25" width="247" height="350" />
              <line x1="133.5" y1="25" x2="133.5" y2="375" />
              <circle cx="133.5" cy="200" r="40" fill="none" />
              <rect x="10" y="100" width="60" height="200" />
              <rect x="197" y="100" width="60" height="200" />
              <rect x="10" y="150" width="30" height="100" />
              <rect x="227" y="150" width="30" height="100" />
            </g>
          </svg>
        </div>
        <!-- Sezione Basket -->
        <div class="field-section basketball-section">
          <svg class="field-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 267 400">
            <g class="basketball-court">
              <rect x="10" y="25" width="247" height="350" />
              <circle cx="133.5" cy="200" r="40" fill="none" />
              <path d="M 40 125 A 100 100 0 0 1 40 275" fill="none" />
              <path d="M 227 125 A 100 100 0 0 0 227 275" fill="none" />
              <rect x="10" y="140" width="70" height="120" />
              <rect x="187" y="140" width="70" height="120" />
            </g>
          </svg>
        </div>
        <!-- Sezione Tennis -->
        <div class="field-section tennis-section">
          <svg class="field-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 267 400">
            <g class="tennis-court">
              <rect x="10" y="25" width="247" height="350" />
              <line x1="133.5" y1="25" x2="133.5" y2="375" />
              <rect x="10" y="85" width="247" height="230" />
              <line x1="65" y1="85" x2="65" y2="315" />
              <line x1="202" y1="85" x2="202" y2="315" />
            </g>
          </svg>
        </div>
      </div>
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">{{ title }}</h1>
          <p class="hero-subtitle">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-container {
      position: relative;
      width: 100%;
      height: 250px;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      overflow: hidden;
      border-radius: 16px;
      margin-bottom: 24px;
      display: flex;
    }

    .fields-container {
      display: flex;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    .field-section {
      flex: 1;
      position: relative;
      overflow: hidden;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    .field-section:last-child {
      border-right: none;
    }

    .field-svg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .field-svg g {
      stroke: #FFFFFF;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.3;
    }

    .soccer-field path, .soccer-field rect, .soccer-field circle, .soccer-field line,
    .basketball-court path, .basketball-court rect, .basketball-court circle,
    .tennis-court path, .tennis-court rect, .tennis-court line {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: draw 4s linear infinite;
    }

    .soccer-section .field-svg g { animation-delay: 0s; }
    .basketball-section .field-svg g { animation-delay: 1s; }
    .tennis-section .field-svg g { animation-delay: 2s; }

    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg,
        rgba(10, 61, 145, 0.1) 0%,
        rgba(79, 195, 247, 0.0) 50%,
        rgba(10, 61, 145, 0.05) 100%);
    }

    .hero-content {
      text-align: center;
      color: white;
      z-index: 3;
      max-width: 600px;
      padding: 0 20px;
      position: relative;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin: 0 0 16px 0;
      text-shadow: 3px 5px 10px rgba(0, 0, 0, 0.5);
      letter-spacing: 0.05em;
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(45deg, #ffffff, #e3f2fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.3rem;
      font-weight: 400;
      margin: 0;
      opacity: 0.9;
      text-shadow: 2px 3px 6px rgba(0, 0, 0, 0.4);
      font-family: 'Poppins', sans-serif;
    }

    /* RESPONSIVE - TABLET */
    @media (max-width: 768px) {
      .hero-container {
        height: 200px;
        border-radius: 12px;
        margin-bottom: 20px;
      }

      .hero-title { font-size: 2.8rem; }
      .hero-subtitle { font-size: 1.1rem; }
      .hero-content { padding: 0 16px; }
    }

    /* RESPONSIVE - MOBILE */
    @media (max-width: 480px) {
      .hero-container {
        height: 180px;
        border-radius: 10px;
        margin-bottom: 16px;
      }

      .hero-title {
        font-size: 2.2rem;
        margin-bottom: 12px;
      }
      .hero-subtitle { font-size: 1rem; }
      .hero-content { padding: 0 12px; }
    }

    /* RESPONSIVE - MOBILE SMALL */
    @media (max-width: 360px) {
      .hero-container { height: 160px; }


      .hero-title {
        font-size: 1.8rem;
        margin-bottom: 8px;
      }
      .hero-subtitle { font-size: 0.9rem; }
    }
  `]
})
export class HeroThreeComponent implements OnInit {
  title = 'SURVIVOR';
  subtitle = 'WIN OR GO HOME';

  ngOnInit(): void {
    // Componente ora usa solo animazioni CSS
  }
}
