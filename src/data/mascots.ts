export type MascotKind =
  | 'bunny'
  | 'bear'
  | 'chick'
  | 'puppy'
  | 'cat'
  | 'fox'
  | 'panda'
  | 'squirrel'
  | 'duck'
  | 'penguin'
  | 'koala'
  | 'frog'
  | 'hamster'
  | 'alpaca'
  | 'seal'
  | 'raccoon'
  | 'lion'
  | 'owl'
  | 'sheep'
  | 'tiger';

export interface MascotTheme {
  kind: MascotKind;
  animalName: string;
  bodyColor: string;
  earInner: string;
  capsuleTop: string;
  capsuleText: string;
  cheekColor: string;
}

export interface TeamItem {
  id: number;
  name: string;
  mascot: MascotTheme;
}

export const MASCOT_CATALOG: MascotTheme[] = [
  {
    kind: 'bunny',
    animalName: '토끼',
    bodyColor: '#FFF5F7',
    earInner: '#FFADC6',
    capsuleTop: '#FF758F',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF9EB5',
  },
  {
    kind: 'bear',
    animalName: '곰돌이',
    bodyColor: '#E8B88A',
    earInner: '#C98A55',
    capsuleTop: '#E76F51',
    capsuleText: '#FFFFFF',
    cheekColor: '#F29479',
  },
  {
    kind: 'chick',
    animalName: '병아리',
    bodyColor: '#FFE169',
    earInner: '#F4A261',
    capsuleTop: '#FFB703',
    capsuleText: '#2B2118',
    cheekColor: '#FF8FA3',
  },
  {
    kind: 'puppy',
    animalName: '강아지',
    bodyColor: '#F5E1C8',
    earInner: '#B07D56',
    capsuleTop: '#3A86FF',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF9E9E',
  },
  {
    kind: 'cat',
    animalName: '고양이',
    bodyColor: '#F4F1EE',
    earInner: '#FFB3C1',
    capsuleTop: '#9B5DE5',
    capsuleText: '#FFFFFF',
    cheekColor: '#FFA6B8',
  },
  {
    kind: 'fox',
    animalName: '여우',
    bodyColor: '#FF9F68',
    earInner: '#FFF3E6',
    capsuleTop: '#F25C3B',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF758F',
  },
  {
    kind: 'panda',
    animalName: '판다',
    bodyColor: '#FFFFFF',
    earInner: '#363230',
    capsuleTop: '#2A9D8F',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF9EB5',
  },
  {
    kind: 'squirrel',
    animalName: '다람쥐',
    bodyColor: '#DDA15E',
    earInner: '#FEFAE0',
    capsuleTop: '#BC6C25',
    capsuleText: '#FFFFFF',
    cheekColor: '#F28482',
  },
  {
    kind: 'duck',
    animalName: '오리',
    bodyColor: '#FFF3B0',
    earInner: '#FF9F1C',
    capsuleTop: '#00BBF9',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF9E9E',
  },
  {
    kind: 'penguin',
    animalName: '펭귄',
    bodyColor: '#4A5759',
    earInner: '#FFFFFF',
    capsuleTop: '#4361EE',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF9EB5',
  },
  {
    kind: 'koala',
    animalName: '코알라',
    bodyColor: '#CED4DA',
    earInner: '#FFF0F3',
    capsuleTop: '#6C757D',
    capsuleText: '#FFFFFF',
    cheekColor: '#FFA6B8',
  },
  {
    kind: 'frog',
    animalName: '개구리',
    bodyColor: '#A7E896',
    earInner: '#70C15F',
    capsuleTop: '#38B000',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF99AC',
  },
  {
    kind: 'hamster',
    animalName: '햄스터',
    bodyColor: '#F8D49D',
    earInner: '#FFF6E8',
    capsuleTop: '#F77F00',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF85A1',
  },
  {
    kind: 'alpaca',
    animalName: '알파카',
    bodyColor: '#FAF3E0',
    earInner: '#E9C46A',
    capsuleTop: '#E07A5F',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF9E9E',
  },
  {
    kind: 'seal',
    animalName: '물개',
    bodyColor: '#E2ECE9',
    earInner: '#A9BCD0',
    capsuleTop: '#0096C7',
    capsuleText: '#FFFFFF',
    cheekColor: '#FFA6B8',
  },
  {
    kind: 'raccoon',
    animalName: '너구리',
    bodyColor: '#D8D2CB',
    earInner: '#5C5552',
    capsuleTop: '#6D597A',
    capsuleText: '#FFFFFF',
    cheekColor: '#F28482',
  },
  {
    kind: 'lion',
    animalName: '아기사자',
    bodyColor: '#FFD166',
    earInner: '#E07A5F',
    capsuleTop: '#D97706',
    capsuleText: '#FFFFFF',
    cheekColor: '#F28482',
  },
  {
    kind: 'owl',
    animalName: '부엉이',
    bodyColor: '#B5838D',
    earInner: '#FFE5D9',
    capsuleTop: '#8338EC',
    capsuleText: '#FFFFFF',
    cheekColor: '#FFB3C1',
  },
  {
    kind: 'sheep',
    animalName: '아기양',
    bodyColor: '#FFFDF7',
    earInner: '#F4A261',
    capsuleTop: '#EC4899',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF9EB5',
  },
  {
    kind: 'tiger',
    animalName: '호랑이',
    bodyColor: '#FFB74D',
    earInner: '#FFF3E0',
    capsuleTop: '#EA580C',
    capsuleText: '#FFFFFF',
    cheekColor: '#FF85A1',
  },
];

export function buildTeams(count: number, customNames: Record<number, string>): TeamItem[] {
  const safeCount = Math.max(2, Math.min(20, count));
  return Array.from({ length: safeCount }, (_, idx) => {
    const id = idx + 1;
    const mascot = MASCOT_CATALOG[idx % MASCOT_CATALOG.length];
    const custom = customNames[id]?.trim();
    return {
      id,
      name: custom || `${id}팀`,
      mascot,
    };
  });
}
