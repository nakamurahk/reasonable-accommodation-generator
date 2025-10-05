// 利用ログの型定義
export interface UsageLog {
  id?: string;
  session_id: string;
  step: string;
  action: string;
  data?: any;
  timestamp: string;
  user_agent?: string;
  created_at?: string;
}

// ステップ別のアクション定義
export type StepAction = 
  | 'step_start'           // ステップ開始
  | 'step_complete'        // ステップ完了
  | 'characteristic_select' // 特性選択
  | 'domain_select'        // 環境選択
  | 'situation_select'    // シチュエーション選択
  | 'difficulty_select'    // 困りごと選択
  | 'difficulty_search'    // 困りごと検索
  | 'card_select'          // カード選択
  | 'final_select'         // 最終選択
  | 'prompt_generate'      // プロンプト生成
  | 'prompt_copy'          // プロンプトコピー
  | 'file_download';       // ファイルダウンロード

// ステップ定義
export type StepName = 
  | 'step1-1'  // 特性選択
  | 'step1-2'  // 環境選択
  | 'step1-3'  // シチュエーション選択
  | 'step2'    // 困りごと探索
  | 'step3'    // 困りごと選抜
  | 'step4'    // 最終決定
  | 'step5';   // 結果表示
