import { supabase } from './supabase';
import { UsageLog, StepAction, StepName } from '../types/analytics';

// セッションIDの生成
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ログ送信可能なドメインかチェック
const isLoggingAllowed = (): boolean => {
  const currentDomain = window.location.hostname;
  const allowedDomain = 'fitbridge.net';
  
  // fitbridge.netからの操作のみログ送信
  return currentDomain === allowedDomain;
};

// セッション状態を管理
let sessionData: any = {
  traits: [],
  scenes: [],
  selected_issues: [],
  final_issue: [],
  selected_aids: [],
  selected_mode: null,
  selected_method: null
};

// 既存テーブル構造に合わせた利用ログの送信
export const logUsage = async (
  step: StepName,
  action: StepAction,
  data?: any
): Promise<void> => {
  try {
    // fitbridge.netからの操作のみログ送信
    if (!isLoggingAllowed()) {
      return;
    }

    const sessionId = sessionStorage.getItem('session_id') || generateSessionId();
    if (!sessionStorage.getItem('session_id')) {
      sessionStorage.setItem('session_id', sessionId);
    }

    // セッション状態を更新（最小単位のID情報のみ）
    
    if (step === 'step1-1' && action === 'characteristic_select' && data) {
      if (data.action === 'select' && data.characteristics) {
        // 特性選択完了時：全選択特性を一括で設定
        sessionData.traits = data.characteristics;
      }
    } else if (step === 'step1-2' && action === 'domain_select' && data) {
      sessionData.domain = data.domain_id; // ドメインIDのみ
    } else if (step === 'step1-3' && action === 'situation_select' && data) {
      if (data.action === 'select' && data.situations) {
        // シチュエーション選択完了時：全選択シチュエーションを一括で設定
        sessionData.scenes = data.situations;
      } else if (data.action === 'select') {
        sessionData.scenes.push(data.situation_id);
      } else if (data.action === 'deselect') {
        sessionData.scenes = sessionData.scenes.filter((s: any) => s !== data.situation_id);
      }
    } else if (step === 'step2' && action === 'difficulty_select' && data) {
      if (data.action === 'select') {
        // 重複チェック：既に存在しない場合のみ追加
        if (!sessionData.selected_issues.includes(data.difficulty_id)) {
          sessionData.selected_issues.push(data.difficulty_id); // conc_1～conc_123形式
        }
      } else if (data.action === 'deselect') {
        sessionData.selected_issues = sessionData.selected_issues.filter((i: any) => i !== data.difficulty_id);
      }
    } else if (step === 'step4' && action === 'final_select' && data) {
      if (data.action === 'select') {
        // 重複チェック：既に存在しない場合のみ追加
        if (!sessionData.final_issue.includes(data.difficulty_id)) {
          sessionData.final_issue.push(data.difficulty_id); // conc_1～conc_123形式
        }
      } else if (data.action === 'deselect') {
        sessionData.final_issue = sessionData.final_issue.filter((f: any) => f !== data.difficulty_id);
      } else if (data.action === 'clear_all') {
        // 最終選択完了時：既存データをクリアして新しい選択を設定
        sessionData.final_issue = data.final_issue || [];
        // Step4で困りごとを選び直した際に、selected_aidsをリセット
        sessionData.selected_aids = [];
      }
    } else if (step === 'step5' && action === 'accommodation_select' && data) {
      // Step5に戻って来た際は、全てのselected_aidsをリセットしてから新しい選択を追加
      if (data.action === 'select' && data.difficulty_id) {
        // 同じ困りごとに対する既存の選択を削除
        sessionData.selected_aids = sessionData.selected_aids.filter((aid: any) => 
          aid.difficulty_id !== data.difficulty_id
        );
        
        // 新しい選択を追加
        sessionData.selected_aids.push({
          difficulty_id: data.difficulty_id, // conc_1～conc_123形式
          accommodation_id: data.accommodation_id // care_1000～care_1368形式
        });
        
      }
    } else if (step === 'display' && action === 'prompt_generate' && data) {
      // プロンプト生成時のモードと手段を記録
      sessionData.selected_mode = data.prompt_mode; // 'colleague' or 'supervisor'
      sessionData.selected_method = data.communication_method; // 'email', 'oral', 'chat', 'document'
    }

    // 3段階で送信：特性選択完了、Step5表示、プロンプト生成（全てINSERT）
    let shouldSend = false;
    let sendReason = '';

    // 1. 特性選択完了（Step1-1完了時）
    if (step === 'step1-1' && action === 'characteristic_select' && data?.action === 'select') {
      shouldSend = true;
      sendReason = 'start';
    }
    // 2. Step5表示（ゴール到達）
    else if (step === 'display' && action === 'step_start') {
      shouldSend = true;
      sendReason = 'goal';
    }
    // 3. プロンプト生成（オプション付きゴール）
    else if (step === 'display' && action === 'prompt_generate') {
      shouldSend = true;
      sendReason = 'goal_with_options';
    }

    if (shouldSend) {
      console.log(`[Analytics] Sending log: ${sendReason}, step: ${step}, action: ${action}`);
      
      const logData = {
        session_id: sessionId,
        created_at: new Date().toISOString(),
        device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        traits: sessionData.traits.length > 0 ? sessionData.traits : null,
        domain: sessionData.domain || null,
        scenes: sessionData.scenes.length > 0 ? sessionData.scenes : null,
        selected_issues: sessionData.selected_issues.length > 0 ? sessionData.selected_issues : null,
        final_issue: sessionData.final_issue.length > 0 ? sessionData.final_issue : null,
        selected_aids: sessionData.selected_aids.length > 0 ? sessionData.selected_aids : null,
        selected_mode: sessionData.selected_mode,
        selected_method: sessionData.selected_method,
        completion_stage: sendReason // 完走率追跡用
      };

      // 全てINSERT操作（セキュリティ上UPDATE禁止）
      console.log(`[Analytics] INSERT operation for session: ${sessionId}, reason: ${sendReason}`);
      console.log(`[Analytics] INSERT data:`, logData);
      console.log(`[Analytics] Session data state:`, sessionData);
      console.log(`[Analytics] Selected issues details:`, sessionData.selected_issues);
      console.log(`[Analytics] Selected aids details:`, sessionData.selected_aids);
      console.log(`[Analytics] Selected mode: "${sessionData.selected_mode}", method: "${sessionData.selected_method}"`);
      console.log(`[Analytics] LogData mode: "${logData.selected_mode}", method: "${logData.selected_method}"`);
      
      const result = await supabase
        .from('issue_selection')
        .insert([logData]);

      if (result.error) {
        console.warn('Analytics logging failed:', result.error);
        console.warn('Error details:', result.error);
      } else {
        console.log(`Log sent successfully: ${sendReason}`);
        console.log('Result:', result);
        
        // セッション終了時のみ状態をリセット（データ送信後）
        // 注意：前に戻るボタンでデータが失われないよう、リセット処理を削除
        // セッション終了は新しいセッションIDが生成された時のみ
        if (sendReason === 'goal_with_options') {
        }
      }
    }
  } catch (error) {
    console.warn('Analytics logging failed:', error);
  }
};

// ステップ開始ログ
export const logStepStart = (step: StepName): void => {
  logUsage(step, 'step_start');
};

// ステップ完了ログ
export const logStepComplete = (step: StepName, data?: any): void => {
  logUsage(step, 'step_complete', data);
};

// 選択ログ
export const logSelection = (step: StepName, action: StepAction, data?: any): void => {
  logUsage(step, action, data);
};

// 検索ログ
export const logSearch = (searchTerm: string, resultsCount: number): void => {
  logUsage('step2', 'difficulty_search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

// プロンプト生成ログ
export const logPromptGeneration = (promptMode: string, communicationMethod: string): void => {
  logUsage('display', 'prompt_generate', {
    prompt_mode: promptMode,
    communication_method: communicationMethod,
  });
};
