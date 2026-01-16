import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FaqDialogComponent } from '../faq-dialog/faq-dialog.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <footer class="survivor-footer">
      <div class="footer-container">
        <div class="footer-content">
          <!-- LOGO SURVIVOR -->
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-text">SURVIVOR</span>
              <span class="subtitle">WIN OR GO HOME</span>
            </div>
          </div>

          <!-- LINK NAVIGAZIONE -->
          <nav class="footer-nav">
            <a href="#" class="footer-link">Chi siamo</a>
            <a href="#" class="footer-link" (click)="openFaq($event)">FAQ</a>
            <a href="#" class="footer-link">Privacy</a>
          </nav>

          <!-- CONTATTI -->
          <div class="footer-contact">
            <a href="mailto:fantasurvivorddl&#64;gmail.com" class="footer-link">
              <mat-icon>email</mat-icon>
              <span>fantasurvivorddl&#64;gmail.com</span>
            </a>
          </div>

          <!-- COPYRIGHT -->
          <div class="footer-copyright">
            <span>© 2026 Survivor DDL</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* FOOTER COMPATTO ORIZZONTALE */
    .survivor-footer {
      background: linear-gradient(135deg, #0A3D91 0%, #4FC3F7 100%);
      color: #FFFFFF;
      margin-top: auto;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 -2px 8px rgba(10, 61, 145, 0.1);
      position: relative;
      overflow: hidden;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
    }

    .footer-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }

    /* LOGO COMPATTO */
    .footer-brand {
      .footer-logo {
        .logo-text {
          font-size: 1.2rem;
          font-weight: 800;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .subtitle {
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-left: 8px;
        }
      }
    }

    /* NAVIGAZIONE ORIZZONTALE */
    .footer-nav {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .footer-link {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        color: #FFFFFF;
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
      }
    }

    /* CONTATTI COMPATTI */
    .footer-contact {
      display: flex;
      align-items: center;

      .footer-link {
        display: flex;
        align-items: center;
        gap: 6px;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }

    /* COPYRIGHT */
    .footer-copyright {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 400;
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .footer-container {
        padding: 14px 20px;
      }

      .footer-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .footer-nav {
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
      }

      .footer-brand .footer-logo {
        .logo-text {
          font-size: 1.1rem;
        }

        .subtitle {
          font-size: 0.65rem;
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .footer-container {
        padding: 12px 16px;
      }

      .footer-content {
        gap: 12px;
      }

      .footer-nav {
        gap: 12px;

        .footer-link {
          font-size: 0.8rem;
          padding: 6px 10px;
        }
      }

      .footer-contact {
        .footer-link {
          font-size: 0.8rem;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      .footer-copyright {
        font-size: 0.75rem;
      }

      .footer-brand .footer-logo {
        .logo-text {
          font-size: 1rem;
        }

        .subtitle {
          font-size: 0.6rem;
        }
      }
    }
  `]
})
export class FooterComponent {
  constructor(private dialog: MatDialog) {}

  openFaq(event: Event) {
    event.preventDefault();
    this.dialog.open(FaqDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }
}

