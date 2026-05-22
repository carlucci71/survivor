import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatCard, MatCardHeader } from "@angular/material/card";
import { MatFormField, MatLabel, MatFormFieldModule } from "@angular/material/form-field";
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { GiocatoreService } from '../../core/services/giocatore.service';
import { Giocatore } from '../../core/models/interfaces.model';
import { finalize } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-me',
  imports: [HeaderComponent, MatCard, MatCardHeader, MatFormField, MatLabel, FormsModule, MatFormFieldModule, MatInputModule, MatButton, MatIcon],
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnDestroy {
  me: Giocatore | null = null;
  nickname: string | null = null;
  isSaving = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  // Easter Egg
  showEasterEgg = false;
  easterLit = false;
  easterExtinguished = false;
  easterInstructionText = 'Swipe fast to strike';
  easterInstructionOpacity = '1';
  matchTransform = 'translate(0px) rotate(0deg)';
  private easterIsLit = false;
  private easterHeat = 0;
  private easterLastTime = 0;
  private easterLastX = 0;
  private easterLastY = 0;
  private easterLastStrikeTime = 0;
  private easterResetTimeout: ReturnType<typeof setTimeout> | null = null;
  private audioCtx: AudioContext | null = null;
  private fireNoiseSource: AudioBufferSourceNode | null = null;
  private fireGainNode: GainNode | null = null;

  constructor(
    private giocatoreService: GiocatoreService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.giocatoreService.me().subscribe({
      next: (giocatore) => {
        this.me = giocatore;
        this.nickname = giocatore.nickname;
      },
      error: (error) => {
        console.error('[MeComponent] Errore caricamento /me:', error);
        const status = error?.status;
        if (status === 401 || status === 403 || !status) {
          console.warn('[MeComponent] Token non valido, redirect a login');
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get nomeModificato(): boolean {
    const nomePulito = this.nickname?.trim() ?? '';
    if (nomePulito.toUpperCase() === 'ADMIN_FIRE') return true;
    if (!this.me) return false;
    return nomePulito !== '' && nomePulito !== this.me.nickname;
  }

  clearFeedback(): void {
    this.feedbackMessage = null;
    this.feedbackType = null;
  }

  confermaNome(): void {
    const nomePulito = this.nickname?.trim() ?? '';

    console.log('[MeComponent] confermaNome chiamato, nomePulito:', nomePulito);

    // Easter egg - prima di qualsiasi guard
    if (nomePulito.toUpperCase() === 'ADMIN_FIRE') {
      console.log('[MeComponent] 🔥 Easter egg triggered!');
      this.openEasterEgg();
      return;
    }

    if (!this.me) return;

    if (!nomePulito) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Inserisci un nome valido';
      return;
    }

    if (nomePulito === this.me.nickname) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Il nome non è cambiato';
      return;
    }

    const aggiornato: Giocatore = { ...this.me, nickname: nomePulito };
    this.isSaving = true;
    this.feedbackMessage = null;
    this.feedbackType = null;

    this.giocatoreService
      .aggiornaMe(aggiornato)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (giocatore) => {
          this.me = giocatore;
          this.nickname = giocatore.nickname;
          this.feedbackType = 'success';
          this.feedbackMessage = 'Nome aggiornato';
        },
        error: () => {
          this.feedbackType = 'error';
          this.feedbackMessage = 'Impossibile aggiornare il nome, riprova più tardi';
        }
      });
  }

  // --- Easter Egg ---

  openEasterEgg(): void {
    console.log('[MeComponent] openEasterEgg() chiamato, showEasterEgg sarà true');
    this.showEasterEgg = true;
    this.easterIsLit = false;
    this.easterHeat = 0;
    this.easterLit = false;
    this.easterExtinguished = false;
    this.easterInstructionText = 'Swipe fast to strike';
    this.easterInstructionOpacity = '1';
    this.matchTransform = 'translate(0px) rotate(0deg)';
    this.easterLastTime = 0;
  }

  closeEasterEgg(): void {
    this.showEasterEgg = false;
    this.easterIsLit = false;
    this.easterLit = false;
    this.easterExtinguished = false;
    this.easterHeat = 0;
    this.easterInstructionText = 'Swipe fast to strike';
    this.easterInstructionOpacity = '1';
    if (this.easterResetTimeout) { clearTimeout(this.easterResetTimeout); }
    this.stopFireSound();
    if (this.audioCtx) { this.audioCtx.close(); this.audioCtx = null; }
  }

  onCloseEaster(e: MouseEvent): void {
    e.stopPropagation();
    this.closeEasterEgg();
  }

  handleEasterMove(e: MouseEvent | TouchEvent): void {
    if (this.easterIsLit) return;
    if (this.easterExtinguished) {
      this.easterExtinguished = false;
      if (this.easterResetTimeout) { clearTimeout(this.easterResetTimeout); }
    }
    const pos = this.getEasterPos(e);
    const currentTime = Date.now();
    if (this.easterLastTime !== 0) {
      const deltaTime = currentTime - this.easterLastTime;
      if (deltaTime > 0) {
        const dx = pos.x - this.easterLastX;
        const dy = pos.y - this.easterLastY;
        const speed = Math.sqrt(dx * dx + dy * dy) / deltaTime;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const isOverMatch = Math.abs(pos.x - centerX) < 150 && Math.abs(pos.y - centerY) < 250;
        if (isOverMatch && speed > 0.5) {
          this.easterHeat += speed;
          if (currentTime - this.easterLastStrikeTime > 80) {
            this.playStrikeSound(speed);
            this.easterLastStrikeTime = currentTime;
          }
          const shakeX = (Math.random() - 0.5) * Math.min(speed * 2, 10);
          this.matchTransform = `translateX(${shakeX}px) rotate(${shakeX / 2}deg)`;
          if (this.easterHeat > 30) { this.igniteEaster(); }
        } else {
          this.easterHeat = Math.max(0, this.easterHeat - 2);
          if (this.easterHeat === 0) { this.matchTransform = 'translate(0px) rotate(0deg)'; }
        }
      }
    }
    this.easterLastX = pos.x;
    this.easterLastY = pos.y;
    this.easterLastTime = currentTime;
  }

  handleEasterClick(): void {
    this.initAudio();
    if (this.easterIsLit) {
      this.easterIsLit = false;
      this.easterHeat = 0;
      this.easterLit = false;
      this.easterExtinguished = true;
      this.easterInstructionText = 'Swipe fast to strike';
      this.easterInstructionOpacity = '1';
      this.stopFireSound();
      this.playHissSound();
      if (this.easterResetTimeout) { clearTimeout(this.easterResetTimeout); }
      this.easterResetTimeout = setTimeout(() => { this.easterExtinguished = false; }, 4000);
    }
  }

  private igniteEaster(): void {
    this.easterIsLit = true;
    this.easterExtinguished = false;
    this.easterLit = true;
    this.matchTransform = 'translate(0px) rotate(0deg)';
    this.easterInstructionOpacity = '0';
    this.playIgniteSound();
    setTimeout(() => {
      this.easterInstructionOpacity = '0.5';
      this.easterInstructionText = 'Tap to extinguish';
    }, 2000);
  }

  private getEasterPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  }

  private initAudio(): void {
    if (!this.audioCtx) {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') { this.audioCtx.resume(); }
  }

  private playStrikeSound(intensity: number): void {
    this.initAudio();
    if (!this.audioCtx) return;
    const sr = this.audioCtx.sampleRate;
    const buf = this.audioCtx.createBuffer(1, Math.floor(sr * 0.05), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) { data[i] = Math.random() * 2 - 1; }
    const src = this.audioCtx.createBufferSource();
    src.buffer = buf;
    const filt = this.audioCtx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 800 + Math.min(intensity, 5) * 400;
    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.04);
    src.connect(filt); filt.connect(gain); gain.connect(this.audioCtx.destination);
    src.start();
  }

  private playIgniteSound(): void {
    this.initAudio();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(1, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(oscGain); oscGain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.floor(sr * 2), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) { data[i] = Math.random() * 2 - 1; }
    this.fireNoiseSource = ctx.createBufferSource();
    this.fireNoiseSource.buffer = buf;
    this.fireNoiseSource.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 300;
    this.fireGainNode = ctx.createGain();
    this.fireGainNode.gain.setValueAtTime(0, ctx.currentTime);
    this.fireGainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1);
    this.fireNoiseSource.connect(filt); filt.connect(this.fireGainNode);
    this.fireGainNode.connect(ctx.destination);
    this.fireNoiseSource.start();
  }

  private playHissSound(): void {
    this.initAudio();
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.floor(sr * 0.3), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) { data[i] = Math.random() * 2 - 1; }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'highpass'; filt.frequency.value = 2000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
    src.start();
  }

  private stopFireSound(): void {
    if (this.fireNoiseSource && this.fireGainNode && this.audioCtx) {
      this.fireGainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.3);
      setTimeout(() => {
        if (this.fireNoiseSource) { this.fireNoiseSource.stop(); this.fireNoiseSource = null; }
      }, 300);
    }
  }

  ngOnDestroy(): void {
    if (this.easterResetTimeout) { clearTimeout(this.easterResetTimeout); }
    if (this.audioCtx) { this.audioCtx.close(); this.audioCtx = null; }
  }

}
