import { CharacteristicType, Domain, Situation, Difficulty, Accommodation } from '../types';

export const characteristicTypes: CharacteristicType[] = [
  {
    id: 'adhd',
    name: 'ADHD',
    description: '注意欠如・多動性障害'
  },
  {
    id: 'asd',
    name: 'ASD',
    description: '自閉スペクトラム症'
  },
  {
    id: 'ld',
    name: 'LD',
    description: '学習障害'
  }
];

export const domains: Domain[] = [
  {
    id: 'workplace',
    name: '職場',
    situations: [
      {
        id: 'meeting',
        name: '会議',
        domainId: 'workplace',
        difficulties: [
          {
            id: 'meeting-1',
            name: '長時間の会議に集中できない',
            description: '会議が長引くと集中力が続かず、重要な情報を見落とすことがある',
            situationId: 'meeting',
            situations: ['会議'],
            accommodations: [
              {
                id: 'acc-1',
                name: '会議時間を短くする',
                difficultyId: 'meeting-1',
                implementationDifficulty: '低',
                cost: '低',
                methodType: '環境調整',
                rippleEffect: '高',
                tags: ['時間管理', '集中力']
              }
            ],
            tags: ['集中力', '時間管理']
          }
        ]
      }
    ]
  },
  {
    id: 'education',
    name: '教育',
    situations: [
      {
        id: 'class',
        name: '授業',
        domainId: 'education',
        difficulties: [
          {
            id: 'class-1',
            name: '板書を写すのが遅い',
            description: '黒板の文字を写すのに時間がかかり、授業の内容を聞き逃すことがある',
            situationId: 'class',
            situations: ['授業'],
            accommodations: [
              {
                id: 'acc-2',
                name: '板書のプリントを事前に配布する',
                difficultyId: 'class-1',
                implementationDifficulty: '低',
                cost: '低',
                methodType: '教材調整',
                rippleEffect: '中',
                tags: ['教材', '学習支援']
              }
            ],
            tags: ['学習支援', '教材']
          }
        ]
      }
    ]
  }
]; 