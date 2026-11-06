import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CHAKRA_LIST } from '../../utils/chakras.data';
import { ChakraIdentifier, ChakraMetadata } from '../../models/manifestation.model';

@Component({
  selector: 'app-alignment-spine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alignment-spine.component.html',
  styleUrl: './alignment-spine.component.css'
})
export class AlignmentSpineComponent {
  @Input() public activeChakraKey: ChakraIdentifier = 'crown';
  @Output() public chakraSelected = new EventEmitter<ChakraIdentifier>();

  public readonly chakras: ChakraMetadata[] = CHAKRA_LIST;

  public handleNodeClick(chakraId: ChakraIdentifier): void {
    this.chakraSelected.emit(chakraId);
  }
}