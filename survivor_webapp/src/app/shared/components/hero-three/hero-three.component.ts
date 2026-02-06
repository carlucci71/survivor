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
      <!-- Omini stilizzati -->
      <div class="stickmen-container">
        <svg class="stickman stickman-1" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-2" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-3" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-4" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-5" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-6" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-7" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-8" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-9" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-10" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-11" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-12" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-13" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-14" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-15" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-16" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-17" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-18" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-19" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-20" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-21" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-22" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-23" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-24" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-25" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-26" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-27" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-28" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-29" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-30" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-31" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-32" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-33" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-34" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-35" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-36" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-37" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-38" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-39" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-40" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-41" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-42" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-43" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-44" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-45" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-46" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-47" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-48" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-49" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
        <svg class="stickman stickman-50" viewBox="0 0 40 60">
          <circle cx="20" cy="10" r="6" fill="white" opacity="0.7"/>
          <line x1="20" y1="16" x2="20" y2="35" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="12" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="22" x2="28" y2="30" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="12" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
          <line x1="20" y1="35" x2="28" y2="50" stroke="white" stroke-width="2" opacity="0.7"/>
        </svg>
      </div>
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">{{ title }}</h1>
          <p class="hero-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <!-- Overlay oscuramento -->
      <div class="dark-overlay"></div>
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

    /* Nuova animazione di ingresso con scala */
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* Nuova animazione di luce scintillante */
    @keyframes shine {
      0% {
        background-position: -200% center;
      }
      100% {
        background-position: 200% center;
      }
    }

    /* Animazione di fluttuazione più lenta */
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-6px); /* Movimento ridotto */
      }
    }

    /* NUOVA animazione combinata per scrivere, attendere e scomparire */
    @keyframes type-and-vanish {
      0% { width: 0; opacity: 1; }
      30% { width: 100%; opacity: 1; }
      70% { width: 100%; opacity: 1; }
      100% { width: 100%; opacity: 0; }
    }

    /* NUOVA animazione per il cursore sincronizzato */
    @keyframes blink-caret-timed {
      from, to { border-color: transparent; }
      50% { border-color: white; }
      71%, 100% { border-color: transparent; }
    }

    /* Animazione di oscuramento che si schiarisce */
    @keyframes lighten {
      0% {
        opacity: 0.5;
      }
      100% {
        opacity: 0;
      }
    }

    .dark-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #2a80d5;
      z-index: 10;
      pointer-events: none;
      animation: lighten 18s ease-out 1 forwards;
    }

    /* Omini stilizzati */
    .stickmen-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    .stickman {
      position: absolute;
      width: 30px;
      height: 45px;
    }

    @keyframes stickmanDarkSync {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    .stickman-1 {
      top: 15%;
      left: 10%;
      animation: stickmanDarkSync 16s ease-in-out 1 forwards;
    }

    .stickman-2 {
      top: 65%;
      left: 25%;
      animation: stickmanDarkSync 4s ease-in-out 1 forwards;
    }

    .stickman-3 {
      top: 35%;
      left: 42%;
      animation: stickmanDarkSync 4s ease-in-out 1 forwards;
    }

    .stickman-4 {
      top: 70%;
      left: 55%;
      animation: stickmanDarkSync 8s ease-in-out 1 forwards;
    }

    .stickman-5 {
      top: 20%;
      left: 72%;
      animation: stickmanDarkSync 8s ease-in-out 1 forwards;
    }

    .stickman-6 {
      top: 50%;
      left: 88%;
      animation: stickmanDarkSync 8s ease-in-out 1 forwards;
    }

    .stickman-7 {
      top: 80%;
      left: 5%;
      animation: stickmanDarkSync 8s ease-in-out 1 forwards;
    }

    .stickman-8 {
      top: 25%;
      left: 18%;
      animation: stickmanDarkSync 8s ease-in-out 1 forwards;
    }

    .stickman-9 {
      top: 55%;
      left: 33%;
      animation: stickmanDarkSync 12s ease-in-out 1 forwards;
    }

    .stickman-10 {
      top: 10%;
      left: 50%;
      animation: stickmanDarkSync 11s ease-in-out 1 forwards;
    }

    .stickman-11 {
      top: 45%;
      left: 65%;
      animation: stickmanDarkSync 12s ease-in-out 1 forwards;
    }

    .stickman-12 {
      top: 75%;
      left: 78%;
      animation: stickmanDarkSync 12s ease-in-out 1 forwards;
    }

    .stickman-13 {
      top: 30%;
      left: 92%;
      animation: stickmanDarkSync 12s ease-in-out 1 forwards;
    }

    .stickman-14 {
      top: 60%;
      left: 8%;
      animation: stickmanDarkSync 8s ease-in-out 1 forwards;
    }

    .stickman-15 {
      top: 12%;
      left: 28%;
      animation: stickmanDarkSync 4s ease-in-out 1 forwards;
    }

    .stickman-16 {
      top: 85%;
      left: 45%;
      animation: stickmanDarkSync 8.5s ease-in-out 1 forwards;
    }

    .stickman-17 {
      top: 40%;
      left: 60%;
      animation: stickmanDarkSync 9.5s ease-in-out 1 forwards;
    }

    .stickman-18 {
      top: 68%;
      left: 82%;
      animation: stickmanDarkSync 10.5s ease-in-out 1 forwards;
    }

    .stickman-19 {
      top: 22%;
      left: 3%;
      animation: stickmanDarkSync 11.5s ease-in-out 1 forwards;
    }

    .stickman-20 {
      top: 50%;
      left: 15%;
      animation: stickmanDarkSync 14s ease-in-out 1 forwards;
    }

    .stickman-21 {
      top: 78%;
      left: 38%;
      //   width: 50px;
      //height: 65px;
      animation: stickmanDarkSync 30s ease-in-out 1 forwards;
    }

    .stickman-22 {
      top: 18%;
      left: 53%;
      animation: stickmanDarkSync 14s ease-in-out 1 forwards;
    }

    .stickman-23 {
      top: 42%;
      left: 70%;
        // width: 50px;
      //height: 65px;
      animation: stickmanDarkSync 6.2s ease-in-out 1 forwards;
    }

    .stickman-24 {
      top: 72%;
      left: 90%;
      animation: stickmanDarkSync 7.2s ease-in-out 1 forwards;
    }

    .stickman-25 {
      top: 33%;
      left: 12%;
      animation: stickmanDarkSync 8.2s ease-in-out 1 forwards;
    }

    .stickman-26 {
      top: 58%;
      left: 48%;
      animation: stickmanDarkSync 9.2s ease-in-out 1 forwards;
    }

    .stickman-27 {
      top: 88%;
      left: 63%;
      animation: stickmanDarkSync 10.2s ease-in-out 1 forwards;
    }

    .stickman-28 {
      top: 8%;
      left: 85%;
      animation: stickmanDarkSync 11.2s ease-in-out 1 forwards;
    }

    .stickman-29 {
      top: 52%;
      left: 20%;
      animation: stickmanDarkSync 4s ease-in-out 1 forwards;
    }

    .stickman-30 {
      top: 14%;
      left: 35%;
      animation: stickmanDarkSync 13s ease-in-out 1 forwards;
    }

    .stickman-31 {
      top: 66%;
      left: 52%;
      animation: stickmanDarkSync 7s ease-in-out 1 forwards;
    }

    .stickman-32 {
      top: 38%;
      left: 76%;
      animation: stickmanDarkSync 10s ease-in-out 1 forwards;
    }

    .stickman-33 {
      top: 82%;
      left: 18%;
      animation: stickmanDarkSync 5s ease-in-out 1 forwards;
    }

    .stickman-34 {
      top: 26%;
      left: 58%;
      animation: stickmanDarkSync 15s ease-in-out 1 forwards;
    }

    .stickman-35 {
      top: 54%;
      left: 8%;
      animation: stickmanDarkSync 9s ease-in-out 1 forwards;
    }

    .stickman-36 {
      top: 70%;
      left: 42%;
      animation: stickmanDarkSync 11s ease-in-out 1 forwards;
    }

    .stickman-37 {
      top: 18%;
      left: 68%;
      animation: stickmanDarkSync 6s ease-in-out 1 forwards;
    }

    .stickman-38 {
      top: 46%;
      left: 94%;
      animation: stickmanDarkSync 14s ease-in-out 1 forwards;
    }

    .stickman-39 {
      top: 90%;
      left: 28%;
      animation: stickmanDarkSync 8s ease-in-out 1 forwards;
    }

    .stickman-40 {
      top: 32%;
      left: 4%;
      animation: stickmanDarkSync 12s ease-in-out 1 forwards;
    }

    .stickman-41 {
      top: 62%;
      left: 62%;
      animation: stickmanDarkSync 16s ease-in-out 1 forwards;
    }

    .stickman-42 {
      top: 6%;
      left: 44%;
      animation: stickmanDarkSync 4.5s ease-in-out 1 forwards;
    }

    .stickman-43 {
      top: 74%;
      left: 84%;
      animation: stickmanDarkSync 11.5s ease-in-out 1 forwards;
    }

    .stickman-44 {
      top: 42%;
      left: 22%;
      animation: stickmanDarkSync 9.5s ease-in-out 1 forwards;
    }

    .stickman-45 {
      top: 86%;
      left: 56%;
      animation: stickmanDarkSync 13.5s ease-in-out 1 forwards;
    }

    .stickman-46 {
      top: 28%;
      left: 88%;
      animation: stickmanDarkSync 6.5s ease-in-out 1 forwards;
    }

    .stickman-47 {
      top: 64%;
      left: 14%;
      animation: stickmanDarkSync 15.5s ease-in-out 1 forwards;
    }

    .stickman-48 {
      top: 16%;
      left: 74%;
      animation: stickmanDarkSync 7.5s ease-in-out 1 forwards;
    }

    .stickman-49 {
      top: 50%;
      left: 36%;
      animation: stickmanDarkSync 10.5s ease-in-out 1 forwards;
    }

    .stickman-50 {
      top: 78%;
      left: 66%;
      animation: stickmanDarkSync 17s ease-in-out 1 forwards;
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
      animation: float 10s ease-in-out infinite; /* Rallentata a 10s */
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin: 0 0 16px 0;
      letter-spacing: 0.05em;
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(45deg, #ffffff, #e3f2fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      opacity: 0;

      /* Proprietà per l'effetto shine */
      background-size: 200% auto;

      /* Nuove animazioni applicate */
      animation: fadeInScale 1.5s ease-out forwards, shine 5s linear infinite;
      animation-delay: 12s, 13.5s; /* Ritardo di 12 secondi */
    }

    .hero-subtitle {
      font-size: 1.3rem;
      font-weight: 400;
      margin: 0;
      opacity: 0; /* Opacity iniziale a 0 */
      font-family: 'Poppins', sans-serif;

      /* Stili per l'effetto typewriter */
      overflow: hidden;
      white-space: nowrap;
      border-right: .15em solid white;
      width: 0;

      /* Nuove animazioni applicate - CICLO INFINITO 7s */
      animation:
        type-and-vanish 7s steps(15, end) infinite,
        blink-caret-timed 1s step-end infinite;
      animation-delay: 13.5s;
      animation-fill-mode: forwards, step-end;
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
