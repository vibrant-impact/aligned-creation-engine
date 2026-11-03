export type ChakraIdentifier =
  | 'crown'
  | 'thirdEye'
  | 'throat'
  | 'heart'
  | 'solarPlexus'
  | 'sacral'
  | 'root';

export interface ChakraMetadata {
  id: ChakraIdentifier;
  index: number;
  name: string;
  sanskrit: string;
  theme: string;
  title: string;
  colorHex: string;
  glowColor: string;
  seedMantra: string;
  frequencyHz: number;
  element: string;
}

export interface GroundingTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface CrownData {
  missionStatement: string;
  higherWhy: string;
  cosmicAnchorPhrase: string;
}

export interface ThirdEyeData {
  sightNotes: string;
  soundNotes: string;
  feelingNotes: string;
  smellTasteNotes: string;
  visionAnchorPhrase: string;
  moodImages: Array<{ id: string; url: string; caption: string }>;
}

export interface ThroatData {
  spokenDeclaration: string;
  seedMantra: string;
  dailyAffirmation: string;
  selectedFrequency: number;
}

export interface PreGratitudeEntry {
  id: string;
  text: string;
  feelingTone: string;
  date: string;
}

export interface HeartData {
  preGratitudeEntries: PreGratitudeEntry[];
  somaticResonanceNotes: string;
  opennessToReceiveScore: number;
}

export interface LimitingBeliefItem {
  id: string;
  belief: string;
  incinerated: boolean;
  rootInsight?: string;
  reframedStances?: Array<{ stance: string; energeticShift: string }>;
  sovereignActionStep?: string;
  createdAt: string;
}

export interface SolarPlexusData {
  limitingBeliefs: LimitingBeliefItem[];
  willpowerPact: string;
  disciplineScore: number;
}

export interface SigilConfig {
  symmetry: number;
  ringCount: number;
  strokeWidth: number;
  glow: boolean;
  geometryType: 'flower' | 'star' | 'circle';
}

export interface SacralData {
  seedPhrase: string;
  sigilConfig: SigilConfig;
  creativeSprintMinutes: number;
  flowStateNotes: string;
}

export interface MilestoneItem {
  id: string;
  stage: string;
  task: string;
  targetDate?: string;
  completed: boolean;
}

export interface DailyHabitItem {
  id: string;
  habit: string;
  streak: number;
  completedToday: boolean;
}

export interface RootData {
  milestones: MilestoneItem[];
  dailyHabits: DailyHabitItem[];
  earthFrictionNotes: string;
  groundingScore: number;
}

export interface ChakraNodeState {
  isAligned: boolean;
  diagnosticScore: number;
  groundingTasks: GroundingTask[];
}

export interface ProjectIntent {
  id: string | number;
  title: string;
  significance: string;
  category?: string;
  createdAt: string;
  currentFocusNode: ChakraIdentifier;
  nodeStates: Record<ChakraIdentifier, ChakraNodeState>;
  crown: CrownData;
  thirdEye: ThirdEyeData;
  throat: ThroatData;
  heart: HeartData;
  solarPlexus: SolarPlexusData;
  sacral: SacralData;
  root: RootData;
}