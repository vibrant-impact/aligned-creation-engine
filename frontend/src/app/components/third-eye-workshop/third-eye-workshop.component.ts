import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';
import { ThirdEyeData } from '../../models/manifestation.model';

export interface VisualAnchorImage {
  id: string;
  url: string;
  caption: string;
}

@Component({
  selector: 'app-third-eye-workshop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './third-eye-workshop.component.html',
  styleUrl: './third-eye-workshop.component.css'
})
export class ThirdEyeWorkshopComponent implements OnInit {
  @Input() public intentionTitle: string = 'Current Intention';

  public sensoryData: ThirdEyeData = {
    sightNotes: '',
    soundNotes: '',
    feelingNotes: '',
    smellTasteNotes: '',
    visionAnchorPhrase: '',
    moodImages: []
  };

  public diagnosticScore: number = 7;
  public newImageUrlInput: string = '';
  public newImageCaptionInput: string = '';

  public readonly curatedPresets: VisualAnchorImage[] = [
    {
      id: 'preset_studio_arch',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
      caption: 'Digital Architecture & Workstation'
    },
    {
      id: 'preset_sunlit_loft',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      caption: 'Luminous Creative Studio'
    },
    {
      id: 'preset_golden_geo',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      caption: 'Cosmic Golden Geometry'
    },
    {
      id: 'preset_hardcover_book',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      caption: 'Physical Mastercraft Creation'
    }
  ];

  constructor(private readonly audioService: AudioService) {}

  public ngOnInit(): void {
    this.sensoryData.visionAnchorPhrase = `I am standing in the fulfilled physical reality of "${this.intentionTitle}".`;
    this.sensoryData.sightNotes = 'Sunlit workspace, high-resolution curved displays, clean lines, and completed project milestones.';
    this.sensoryData.soundNotes = 'Rhythmic keystrokes, ambient downtempo audio, congratulatory voices, and calm breathing.';
    this.sensoryData.feelingNotes = 'Steady gravity through the feet, weightless buoyancy in the chest, and profound sovereign peace.';
    this.sensoryData.smellTasteNotes = 'Fresh cedar, roasted espresso, and crisp morning air.';
    
    // Default initial image anchor
    this.sensoryData.moodImages = [this.curatedPresets[0]];
  }

  public handleAddCustomImage(): void {
    const trimmedUrl = this.newImageUrlInput.trim();
    if (!trimmedUrl) return;

    const newAnchorImage: VisualAnchorImage = {
      id: 'img_' + Date.now(),
      url: trimmedUrl,
      caption: this.newImageCaptionInput.trim() || 'Visual Anchor'
    };

    this.sensoryData.moodImages.push(newAnchorImage);
    this.newImageUrlInput = '';
    this.newImageCaptionInput = '';
    this.audioService.playAlignmentChime(852); // Ajna 852Hz feedback
  }

  public handleApplyPreset(preset: VisualAnchorImage): void {
    const isAlreadyAdded = this.sensoryData.moodImages.some(img => img.url === preset.url);
    if (!isAlreadyAdded) {
      this.sensoryData.moodImages.push({
        id: 'img_' + Date.now(),
        url: preset.url,
        caption: preset.caption
      });
      this.audioService.playAlignmentChime(852);
    }
  }

  public handleRemoveImage(imageId: string): void {
    this.sensoryData.moodImages = this.sensoryData.moodImages.filter(img => img.id !== imageId);
  }
}