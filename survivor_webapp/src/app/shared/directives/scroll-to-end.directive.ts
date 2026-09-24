import { AfterViewInit, Directive, ElementRef } from '@angular/core';

/**
 * Apre l'elemento già scrollato al massimo orizzontale (contenuto più recente a destra).
 * Se il contenuto entra tutto (nessun overflow) non ha alcun effetto.
 */
@Directive({
  selector: '[appScrollToEnd]',
  standalone: true,
})
export class ScrollToEndDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    node.scrollLeft = node.scrollWidth;
  }
}
