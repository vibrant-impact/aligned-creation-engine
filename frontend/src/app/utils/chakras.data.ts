import { ChakraIdentifier, ChakraMetadata } from '../models/manifestation.model';

export const CHAKRA_LIST: ChakraMetadata[] = [
  {
    id: 'crown',
    index: 7,
    name: 'Crown',
    sanskrit: 'Sahasrara',
    theme: 'Core Intent & Divine Purpose',
    title: 'The Divine Blueprint',
    colorHex: '#b388ff',
    glowColor: 'rgba(179, 136, 255, 0.4)',
    seedMantra: 'OM',
    frequencyHz: 963,
    element: 'Cosmic Consciousness'
  },
  {
    id: 'thirdEye',
    index: 6,
    name: 'Third Eye',
    sanskrit: 'Ajna',
    theme: 'Sensory Visualization',
    title: 'Multi-Sensory Reality Anchor',
    colorHex: '#536dfe',
    glowColor: 'rgba(83, 109, 254, 0.4)',
    seedMantra: 'KSHAM',
    frequencyHz: 852,
    element: 'Light & Perception'
  },
  {
    id: 'throat',
    index: 5,
    name: 'Throat',
    sanskrit: 'Vishuddha',
    theme: 'Vocal Truth & Declaration',
    title: 'Vibrational Proclamation',
    colorHex: '#00e5ff',
    glowColor: 'rgba(0, 229, 255, 0.4)',
    seedMantra: 'HAM',
    frequencyHz: 741,
    element: 'Ether & Sound'
  },
  {
    id: 'heart',
    index: 4,
    name: 'Heart',
    sanskrit: 'Anahata',
    theme: 'Emotional Resonance & Gratitude',
    title: 'Somatic Pre-Gratitude Bridge',
    colorHex: '#00e676',
    glowColor: 'rgba(0, 230, 118, 0.4)',
    seedMantra: 'YAM',
    frequencyHz: 639,
    element: 'Air & Love'
  },
  {
    id: 'solarPlexus',
    index: 3,
    name: 'Solar Plexus',
    sanskrit: 'Manipura',
    theme: 'Willpower & Sovereignty',
    title: 'The Alchemical Mindset Crucible',
    colorHex: '#ffd600',
    glowColor: 'rgba(255, 214, 0, 0.4)',
    seedMantra: 'RAM',
    frequencyHz: 528,
    element: 'Fire & Sovereignty'
  },
  {
    id: 'sacral',
    index: 2,
    name: 'Sacral',
    sanskrit: 'Svadhisthana',
    theme: 'Creative Flow & Sacred Sigil',
    title: 'Algorithmic Sacred Sigil',
    colorHex: '#ff9100',
    glowColor: 'rgba(255, 145, 0, 0.4)',
    seedMantra: 'VAM',
    frequencyHz: 417,
    element: 'Water & Creation'
  },
  {
    id: 'root',
    index: 1,
    name: 'Root',
    sanskrit: 'Muladhara',
    theme: 'Earth-Anchor Execution',
    title: '3D Physical Grounding',
    colorHex: '#ff1744',
    glowColor: 'rgba(255, 23, 68, 0.4)',
    seedMantra: 'LAM',
    frequencyHz: 396,
    element: 'Earth & Stability'
  }
];

export const CHAKRA_DICTIONARY: Record<ChakraIdentifier, ChakraMetadata> = CHAKRA_LIST.reduce(
  (accumulatedDictionary, currentChakra) => {
    accumulatedDictionary[currentChakra.id] = currentChakra;
    return accumulatedDictionary;
  },
  {} as Record<ChakraIdentifier, ChakraMetadata>
);