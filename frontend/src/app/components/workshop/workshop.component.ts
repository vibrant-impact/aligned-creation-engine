import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlignmentSpineComponent } from '../alignment-spine/alignment-spine.component';
import { SolarPlexusWorkshopComponent } from '../solar-plexus-workshop/solar-plexus-workshop.component';
import { SacralWorkshopComponent } from '../sacral-workshop/sacral-workshop.component';
import { ThirdEyeWorkshopComponent } from '../third-eye-workshop/third-eye-workshop.component';
import { ThroatWorkshopComponent } from '../throat-workshop/throat-workshop.component';
import { CrownWorkshopComponent } from '../crown-workshop/crown-workshop.component';
import { HeartWorkshopComponent } from '../heart-workshop/heart-workshop.component';
import { RootWorkshopComponent } from '../root-workshop/root-workshop.component';
import { IntentService, IntentionItem } from '../../services/intent.service';
import { AudioService } from '../../services/audio.service';
import { CHAKRA_LIST, CHAKRA_DICTIONARY } from '../../utils/chakras.data';
import { ChakraIdentifier, ChakraMetadata } from '../../models/manifestation.model';
import { ChakraMeditationTimerComponent } from '../chakra-meditation-timer/chakra-meditation-timer.component';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AlignmentSpineComponent,
    ChakraMeditationTimerComponent,
    SolarPlexusWorkshopComponent,
    SacralWorkshopComponent,
    ThirdEyeWorkshopComponent,
    ThroatWorkshopComponent,
    CrownWorkshopComponent,
    HeartWorkshopComponent,
    RootWorkshopComponent
  ],
  templateUrl: './workshop.component.html',
  styleUrl: './workshop.component.css'
})
export class WorkshopComponent implements OnInit {
  public intentId: string | null = null;
  public currentIntent: IntentionItem | undefined;

  public readonly chakraTabs: ChakraMetadata[] = CHAKRA_LIST;
  public readonly chakraDictionary = CHAKRA_DICTIONARY;
  public activeChakraId: ChakraIdentifier = 'solarPlexus';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly intentService: IntentService,
    private readonly audioService: AudioService
  ) {}

  public ngOnInit(): void {
    this.intentId = this.route.snapshot.paramMap.get('id');

    this.intentService.intentions$.subscribe((intentions) => {
      this.currentIntent = intentions.find(
        (item) => String(item.id) === String(this.intentId)
      );
    });
  }

  public selectChakra(id: ChakraIdentifier): void {
    this.activeChakraId = id;
    const chakra = this.chakraDictionary[id];
    if (chakra) {
      this.audioService.playAlignmentChime(chakra.frequencyHz);
    }
  }

  public get currentChakra(): ChakraMetadata {
    return this.chakraDictionary[this.activeChakraId];
  }
}