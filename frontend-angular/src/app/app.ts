import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { I18nService } from './i18n/i18n.service';
import { AppLanguage } from './i18n/translations';
import { TranslatePipe } from './i18n/translate.pipe';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly i18n = inject(I18nService);

  ngOnInit(): void {
    document.documentElement.lang = this.i18n.language();
  }

  protected setLanguage(language: AppLanguage): void {
    this.i18n.setLanguage(language);
  }
}
