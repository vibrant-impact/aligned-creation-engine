import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChakraNode {
  key: string;
  name: string;
  symbol: string;
  status: 'aligned' | 'active' | 'dormant';
}

@Component({
  selector: 'app-alignment-spine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alignment-spine.component.html',
  styleUrl: './alignment-spine.component.css'
})
export class AlignmentSpineComponent {
  @Input() public activeChakraKey: string = 'solar_plexus';

  public readonly chakraNodes: ChakraNode[] = [
    { key: 'crown', name: 'Crown', symbol: '👑', status: 'dormant' },
    { key: 'third_eye', name: 'Third Eye', symbol: '👁️', status: 'dormant' },
    { key: 'throat', name: 'Throat', symbol: '🗣️', status: 'dormant' },
    { key: 'heart', name: 'Heart', symbol: '💚', status: 'dormant' },
    { key: 'solar_plexus', name: 'Solar Plexus', symbol: '☀️', status: 'active' },
    { key: 'sacral', name: 'Sacral', symbol: '🎨', status: 'dormant' },
    { key: 'root', name: 'Root', symbol: '🌍', status: 'dormant' }
  ];
}