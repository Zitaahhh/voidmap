export type ContinentId =
  | 'north-america'
  | 'south-america'
  | 'europe'
  | 'africa'
  | 'asia'
  | 'australia'
  | 'antarctica';

export type ContinentDefinition = {
  id: ContinentId;
  name: string;
  polygon: Array<[number, number]>;
  mapLabel: string;
};

export const CONTINENTS: ContinentDefinition[] = [
  {
    id: 'north-america',
    name: 'North America',
    mapLabel: 'NORTH AMERICA',
    polygon: [
      [-168, 72], [-150, 68], [-130, 70], [-110, 72], [-90, 72], [-70, 68],
      [-52, 55], [-58, 45], [-75, 25], [-90, 15], [-105, 18], [-120, 30],
      [-135, 45], [-150, 55], [-168, 72],
    ],
  },
  {
    id: 'south-america',
    name: 'South America',
    mapLabel: 'SOUTH AMERICA',
    polygon: [
      [-82, 12], [-72, 8], [-64, -2], [-58, -12], [-54, -24], [-52, -36],
      [-58, -50], [-66, -54], [-72, -44], [-76, -28], [-78, -12], [-82, 12],
    ],
  },
  {
    id: 'europe',
    name: 'Europe',
    mapLabel: 'EUROPE',
    polygon: [
      [-12, 72], [2, 72], [18, 70], [28, 64], [34, 56], [28, 48], [16, 44],
      [4, 44], [-8, 48], [-14, 56], [-12, 72],
    ],
  },
  {
    id: 'africa',
    name: 'Africa',
    mapLabel: 'AFRICA',
    polygon: [
      [-18, 36], [2, 36], [20, 30], [30, 18], [34, 2], [30, -16], [24, -34],
      [12, -46], [-2, -48], [-14, -38], [-20, -18], [-18, 36],
    ],
  },
  {
    id: 'asia',
    name: 'Asia',
    mapLabel: 'ASIA',
    polygon: [
      [20, 76], [42, 76], [62, 72], [86, 70], [108, 68], [130, 58], [150, 48],
      [164, 38], [156, 20], [142, 16], [124, 20], [106, 24], [88, 18], [72, 20],
      [56, 28], [42, 38], [30, 48], [20, 60], [20, 76],
    ],
  },
  {
    id: 'australia',
    name: 'Australia',
    mapLabel: 'AUSTRALIA',
    polygon: [
      [112, -10], [126, -10], [142, -14], [152, -24], [146, -38], [130, -42],
      [114, -36], [108, -22], [112, -10],
    ],
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    mapLabel: 'ANTARCTICA',
    polygon: [
      [-180, -60], [-140, -64], [-90, -66], [-40, -68], [10, -70], [60, -68],
      [110, -66], [160, -64], [180, -60], [180, -86], [-180, -86], [-180, -60],
    ],
  },
];
