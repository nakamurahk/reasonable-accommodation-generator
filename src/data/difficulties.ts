import { Difficulty } from '../types';

export const DIFFICULTIES: Difficulty[] = [
  // 会議関連
  {
    id: 'meeting-1',
    name: '長時間の会議に集中できない',
    description: '会議が長引くと集中力が続かず、重要な情報を見落とすことがある',
    tags: ['集中力', '時間管理'],
    situations: ['会議'],
    situationId: 'meeting',
    accommodations: []
  },
  {
    id: 'meeting-2',
    name: '複数の人が同時に話すと聞き取れない',
    description: '複数の人が同時に話すと、誰が何を言っているのか理解できない',
    tags: ['聴覚処理', '情報処理'],
    situations: ['会議'],
    situationId: 'meeting',
    accommodations: []
  },
  {
    id: 'meeting-3',
    name: '自分の意見を言うタイミングが分からない',
    description: '会議での発言のタイミングが掴めず、意見を言い損ねることがある',
    tags: ['コミュニケーション', '社会性'],
    situations: ['会議'],
    situationId: 'meeting',
    accommodations: []
  },

  // デスクワーク関連
  {
    id: 'desk-1',
    name: '作業の優先順位付けが難しい',
    description: '複数のタスクがある場合、どの作業から始めるべきか判断できない',
    tags: ['実行機能', '計画性'],
    situations: ['デスクワーク'],
    situationId: 'desk',
    accommodations: []
  },
  {
    id: 'desk-2',
    name: '長時間のPC作業で目が疲れる',
    description: 'PC作業が続くと目が疲れ、作業効率が下がる',
    tags: ['感覚過敏', '身体症状'],
    situations: ['デスクワーク'],
    situationId: 'desk',
    accommodations: []
  },
  {
    id: 'desk-3',
    name: '作業の切り替えが苦手',
    description: '一つの作業に集中しすぎて、他の作業への切り替えが難しい',
    tags: ['実行機能', '切り替え'],
    situations: ['デスクワーク'],
    situationId: 'desk',
    accommodations: []
  },

  // 授業関連
  {
    id: 'class-1',
    name: '板書を写すのが遅い',
    description: '黒板の文字を写すのに時間がかかり、授業の内容を聞き逃すことがある',
    tags: ['書字', '情報処理'],
    situations: ['授業'],
    situationId: 'class',
    accommodations: []
  },
  {
    id: 'class-2',
    name: '授業中の質問ができない',
    description: '分からないことがあっても、授業中に質問するのが難しい',
    tags: ['コミュニケーション', '社会性'],
    situations: ['授業'],
    situationId: 'class',
    accommodations: []
  },
  {
    id: 'class-3',
    name: 'グループワークで自分の役割が分からない',
    description: 'グループ活動で自分が何をすべきか理解するのに時間がかかる',
    tags: ['社会性', '実行機能'],
    situations: ['授業', 'グループワーク'],
    situationId: 'class',
    accommodations: []
  },
]; 