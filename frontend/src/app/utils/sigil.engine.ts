export interface SigilCoordinatePoint {
  x: number;
  y: number;
  numericalValue: number;
  character: string;
}

export interface GeneratedSigilGeometry {
  canvasSize: number;
  centerCoordinate: number;
  coordinatePoints: SigilCoordinatePoint[];
  primarySvgPath: string;
  symmetryAngles: number[];
  concentricRings: number[];
  geometryType: 'flower' | 'star' | 'circle';
}

const PYTHAGOREAN_NUMEROLOGY_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

export function reduceAffirmationToCharacters(inputPhrase: string): { uniqueCharacters: string[]; seedWord: string } {
  const sanitizedPhrase = inputPhrase.toUpperCase().replace(/[^A-Z]/g, '');
  if (!sanitizedPhrase) {
    return { uniqueCharacters: ['A', 'C', 'E'], seedWord: 'ACE' };
  }

  const seenCharacters = new Set<string>();
  const uniqueCharacters: string[] = [];

  for (const character of sanitizedPhrase) {
    if (!seenCharacters.has(character)) {
      seenCharacters.add(character);
      uniqueCharacters.push(character);
    }
  }

  return {
    uniqueCharacters,
    seedWord: uniqueCharacters.slice(0, 10).join('')
  };
}

export function generateSigilGeometry(
  phrase: string,
  symmetrySegments: number = 8,
  ringCount: number = 3,
  geometryType: 'flower' | 'star' | 'circle' = 'flower',
  canvasSize: number = 340
): GeneratedSigilGeometry {
  const centerCoordinate = canvasSize / 2;
  const maximumRadius = centerCoordinate * 0.78;
  const { uniqueCharacters } = reduceAffirmationToCharacters(phrase);

  const coordinatePoints: SigilCoordinatePoint[] = uniqueCharacters.map((character, characterIndex) => {
    const numericalValue = PYTHAGOREAN_NUMEROLOGY_MAP[character] || ((characterIndex % 9) + 1);
    const angleInRadians = ((numericalValue - 1) * (360 / 9) - 90) * (Math.PI / 180);
    const ringIndex = (characterIndex % ringCount) + 1;
    const radialDistance = (maximumRadius / (ringCount + 0.5)) * (ringIndex + (numericalValue % 3) * 0.2);

    return {
      x: centerCoordinate + radialDistance * Math.cos(angleInRadians),
      y: centerCoordinate + radialDistance * Math.sin(angleInRadians),
      numericalValue,
      character
    };
  });

  let primarySvgPath = '';
  if (coordinatePoints.length > 0) {
    primarySvgPath = `M ${coordinatePoints[0].x.toFixed(1)},${coordinatePoints[0].y.toFixed(1)}`;
    for (let pointIndex = 1; pointIndex < coordinatePoints.length; pointIndex++) {
      const previousPoint = coordinatePoints[pointIndex - 1];
      const currentPoint = coordinatePoints[pointIndex];
      const midpointX = (previousPoint.x + currentPoint.x) / 2;
      const midpointY = (previousPoint.y + currentPoint.y) / 2;
      primarySvgPath += ` Q ${previousPoint.x.toFixed(1)},${previousPoint.y.toFixed(1)} ${midpointX.toFixed(1)},${midpointY.toFixed(1)}`;
    }
    const lastPoint = coordinatePoints[coordinatePoints.length - 1];
    primarySvgPath += ` L ${lastPoint.x.toFixed(1)},${lastPoint.y.toFixed(1)}`;
  }

  const symmetryAngles: number[] = [];
  const degreeStep = 360 / Math.max(symmetrySegments, 1);
  for (let currentDegree = 0; currentDegree < 360; currentDegree += degreeStep) {
    symmetryAngles.push(currentDegree);
  }

  const concentricRings: number[] = [];
  for (let ringIndex = 1; ringIndex <= ringCount; ringIndex++) {
    concentricRings.push((maximumRadius / ringCount) * ringIndex);
  }

  return {
    canvasSize,
    centerCoordinate,
    coordinatePoints,
    primarySvgPath,
    symmetryAngles,
    concentricRings,
    geometryType
  };
}