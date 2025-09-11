import { CharacteristicType, Domain } from '../types';

export const CHARACTERISTICS: CharacteristicType[] = [
  // 発達障害系
  {
    id: 'ADHD',
    name: 'ADHD',
    description: '注意・実行機能・衝動性の困難'
  },
  {
    id: 'ASD',
    name: 'ASD',
    description: '感覚過敏・曖昧の苦手さ・対人のズレ'
  },
  {
    id: 'LD',
    name: '学習障害（LD）',
    description: '読み書き・計算・記憶の特定領域で困難'
  },
  // 精神障害系
  {
    id: 'depression',
    name: 'うつ・抑うつ',
    description: '意欲低下・思考停止・自己否定など、持続的な気分の落ち込み'
  },
  {
    id: 'bipolar',
    name: '双極性障害',
    description: '気分の波が激しく、層状態と抑うつ状態が交互に現れる'
  },
  {
    id: 'anxiety',
    name: '不安・パニック',
    description: '強い予期不安／発作／身体症状を伴い回避傾向'
  },
  {
    id: 'schizophrenia',
    name: '統合失調症',
    description: '統合失調症'
  },
  {
    id: 'ptsd',
    name: 'PTSD・トラウマ',
    description: 'フラッシュバック／過覚醒／過去体験による行動制限'
  },
  // 身体・慢性疾患系
  {
    id: 'epilepsy',
    name: 'てんかん',
    description: 'てんかん'
  },
  {
    id: 'physical',
    name: '身体・慢性疾患',
    description: '体調変動／疲労蓄積／通院や副作用などによる業務影響'
  },
  // 感覚・感受性特性系
  {
    id: 'hsp',
    name: 'HSP・高感受性',
    description: '刺激への強い反応／感情の深さ／疲れやすさ'
  }
];

export const DOMAINS: Domain[] = [
  {
    id: 'workplace',
    name: '企業',
    situations: [
      { id: 'meetings', name: '会議・打ち合わせ', domainId: 'workplace', difficulties: [] },
      { id: 'deskwork', name: 'デスクワーク', domainId: 'workplace', difficulties: [] },
      { id: 'phone_email', name: '電話・メール対応', domainId: 'workplace', difficulties: [] },
      { id: 'teamwork', name: 'チームワーク・連携', domainId: 'workplace', difficulties: [] },
      { id: 'customer_service', name: '顧客対応', domainId: 'workplace', difficulties: [] },
      { id: 'reporting', name: '報告・相談', domainId: 'workplace', difficulties: [] },
      { id: 'training', name: '研修・スキルアップ', domainId: 'workplace', difficulties: [] },
      { id: 'evaluation', name: '評価・人事制度', domainId: 'workplace', difficulties: [] },
      { id: 'workplace_relationships', name: '職場の人間関係', domainId: 'workplace', difficulties: [] },
      { id: 'company_events', name: '社内イベント', domainId: 'workplace', difficulties: [] },
      { id: 'commute', name: '通勤・移動', domainId: 'workplace', difficulties: [] },
      { id: 'remote_work', name: 'リモート環境', domainId: 'workplace', difficulties: [] }
    ]
  },
  {
    id: 'education',
    name: '教育機関',
    situations: [
      { id: 'classes', name: '授業・講義', domainId: 'education', difficulties: [] },
      { id: 'exams', name: '試験・評価', domainId: 'education', difficulties: [] },
      { id: 'assignments', name: '課題・レポート作成', domainId: 'education', difficulties: [] },
      { id: 'groupwork', name: 'グループワーク', domainId: 'education', difficulties: [] },
      { id: 'practical', name: '実習・実技', domainId: 'education', difficulties: [] },
      { id: 'library_study', name: '図書館・自習', domainId: 'education', difficulties: [] },
      { id: 'friendships', name: '友人関係・社交', domainId: 'education', difficulties: [] },
      { id: 'teacher_relationships', name: '教員との関係', domainId: 'education', difficulties: [] },
      { id: 'school_events', name: '学校行事・イベント', domainId: 'education', difficulties: [] },
      { id: 'commute_campus', name: '通学・校内移動', domainId: 'education', difficulties: [] },
      { id: 'career_guidance', name: '進路・就職活動', domainId: 'education', difficulties: [] },
      { id: 'remote_learning', name: 'リモート環境', domainId: 'education', difficulties: [] }
    ]
  },
  {
    id: 'support',
    name: '支援機関',
    situations: [
      { id: 'consultation', name: '面談・相談', domainId: 'support', difficulties: [] },
      { id: 'group_activities', name: 'グループ活動', domainId: 'support', difficulties: [] },
      { id: 'training_programs', name: '訓練プログラム', domainId: 'support', difficulties: [] },
      { id: 'peer_relationships', name: '他の利用者との関係', domainId: 'support', difficulties: [] },
      { id: 'supporter_relationships', name: '支援者との関係', domainId: 'support', difficulties: [] },
      { id: 'employment_preparation', name: '就労準備・移行', domainId: 'support', difficulties: [] },
      { id: 'life_skills', name: '生活スキル', domainId: 'support', difficulties: [] },
      { id: 'assessment', name: 'アセスメント・検査', domainId: 'support', difficulties: [] },
      { id: 'procedures', name: '手続き・申請', domainId: 'support', difficulties: [] },
      { id: 'attendance_transport', name: '通所・移動', domainId: 'support', difficulties: [] },
      { id: 'family_coordination', name: '家族・関係機関連携', domainId: 'support', difficulties: [] },
      { id: 'remote_support', name: 'リモート環境', domainId: 'support', difficulties: [] }
    ]
  }
];
