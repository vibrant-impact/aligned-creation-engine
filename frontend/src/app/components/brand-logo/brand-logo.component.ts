import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brand-logo.component.html',
  styleUrl: './brand-logo.component.css'
})
export class BrandLogoComponent {
  @Input() public showText: boolean = true;
  @Input() public size: number = 36;
}