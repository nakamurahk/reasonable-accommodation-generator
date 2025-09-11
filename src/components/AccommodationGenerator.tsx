import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CharacteristicType, Domain, Situation } from '../types';
import InitialSelection from './pages/InitialSelection';
import DifficultyThinking from './pages/DifficultyThinking';
import DifficultySelection from './pages/DifficultySelection';
import AccommodationDisplay from './pages/AccommodationDisplay';

// LocalStorage用のユーティリティ関数
const STORAGE_KEY = 'accommodation_generator_data';

const saveToLocalStorage = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

type Selection = {
  characteristics: CharacteristicType[];
  domain: Domain | null;
  situations: Situation[];
};

type Step = 'initial' | 'thinking' | 'selection' | 'display';

const AccommodationGenerator: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // URLから現在のステップを取得
  const getCurrentStep = (): Step => {
    const path = location.pathname;
    if (path === '/step1') return 'initial';
    if (path === '/step2') return 'thinking';
    if (path === '/step3') return 'selection';
    if (path === '/step4') return 'display';
    return 'initial';
  };
  
  // LocalStorageからデータを読み込む
  const loadSavedData = () => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      return {
        selection: savedData.selection || {
          characteristics: [],
          domain: null,
          situations: [],
        },
        selectedDifficulties: savedData.selectedDifficulties || [],
        displayDifficulties: savedData.displayDifficulties || [],
      };
    }
    return {
      selection: {
        characteristics: [],
        domain: null,
        situations: [],
      },
      selectedDifficulties: [],
      displayDifficulties: [],
    };
  };

  const [currentStep, setCurrentStep] = useState<Step>(getCurrentStep());
  const [selection, setSelection] = useState<Selection>(loadSavedData().selection);
  const [selectedDifficulties, setSelectedDifficulties] = useState<any[]>(loadSavedData().selectedDifficulties);
  const [displayDifficulties, setDisplayDifficulties] = useState<any[]>(loadSavedData().displayDifficulties);
  const [viewModel, setViewModel] = useState<any[] | null | undefined>(null);
  const viewModelRef = useRef<any[] | null | undefined>(null);
  
  // viewModelの状態を監視
  useEffect(() => {
    // console.log('viewModel state changed:', viewModel);
    viewModelRef.current = viewModel;
  }, [viewModel]);

  // URLの変更を監視してステップを更新
  useEffect(() => {
    const newStep = getCurrentStep();
    setCurrentStep(newStep);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const updateStep = (newStep: Step) => {
    // console.log('updateStep called with:', newStep);
    setCurrentStep(newStep);
    // URLを更新
    const path = newStep === 'initial' ? '/step1' : 
                 newStep === 'thinking' ? '/step2' : 
                 newStep === 'selection' ? '/step3' : '/step4';
    // console.log('Navigating to path:', path);
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleInitialSelectionComplete = (
    selectedCharacteristics: CharacteristicType[],
    selectedDomain: Domain,
    selectedSituations: Situation[]
  ) => {
    const newSelection = {
      characteristics: selectedCharacteristics,
      domain: selectedDomain,
      situations: selectedSituations,
    };
    setSelection(newSelection);
    
    // ①→②の遷移時は困りごと関連データをクリア
    setSelectedDifficulties([]);
    setDisplayDifficulties([]);
    setViewModel(null);
    
    // LocalStorageに保存（困りごと関連は空の状態で保存）
    saveToLocalStorage({
      selection: newSelection,
      selectedDifficulties: [],
      displayDifficulties: [],
    });
    
    updateStep('thinking');
  };

  const handleThinkingComplete = (difficulties: any[]) => {
    const newSelectedDifficulties = difficulties.map(difficulty => ({
      ...difficulty,
      cares: []
    }));
    setSelectedDifficulties(newSelectedDifficulties);
    
    // console.log('handleThinkingComplete - viewModel:', viewModel);
    // console.log('handleThinkingComplete - viewModelRef.current:', viewModelRef.current);
    
    // viewModelがnullの場合は、viewModelRefから取得
    if (!viewModel && viewModelRef.current) {
      setViewModel(viewModelRef.current);
    }
    
    // LocalStorageに保存（viewModelは保持）
    saveToLocalStorage({
      selection,
      selectedDifficulties: newSelectedDifficulties,
      displayDifficulties,
    });
    
    // viewModelを保持したままステップ3に遷移
    updateStep('selection');
  };

  const handleSelectionComplete = (difficulties: any[]) => {
    setDisplayDifficulties(difficulties);
    
    // LocalStorageに保存
    saveToLocalStorage({
      selection,
      selectedDifficulties,
      displayDifficulties: difficulties,
    });
    
    updateStep('display');
  };

  const handleRestart = () => {
    const emptySelection = {
      characteristics: [],
      domain: null,
      situations: [],
    };
    setSelection(emptySelection);
    setSelectedDifficulties([]);
    setDisplayDifficulties([]);
    
    // LocalStorageをクリア
    clearLocalStorage();
    
    updateStep('initial');
  };

  const handleBack = () => {
    // console.log('handleBack called, currentStep:', currentStep);
    if (currentStep === 'display') {
      // console.log('Moving from display to selection');
      updateStep('selection');
    } else if (currentStep === 'selection') {
      // console.log('Moving from selection to thinking');
      updateStep('thinking');
    } else if (currentStep === 'thinking') {
      // console.log('Moving from thinking to initial');
      updateStep('initial');
    }
  };

  return (
    <div className="h-full bg-gray-50">
      {currentStep === 'initial' && (
        <InitialSelection onComplete={handleInitialSelectionComplete} />
      )}
      {currentStep === 'thinking' && (
        selection.domain && selection.situations.length > 0 ? (
          <DifficultyThinking
            characteristics={selection.characteristics}
            domain={selection.domain}
            situations={selection.situations}
            onComplete={handleThinkingComplete}
            selectedDifficulties={selectedDifficulties}
            onBack={handleBack}
            onViewModelChange={setViewModel}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 mb-4">データが見つかりません</p>
              <button
                onClick={() => updateStep('initial')}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                最初からやり直す
              </button>
            </div>
          </div>
        )
      )}
      {currentStep === 'selection' && (
        selectedDifficulties.length > 0 ? (
          <>
            {/* console.log('Rendering DifficultySelection with viewModel:', viewModel) */}
            <DifficultySelection
              difficulties={selectedDifficulties}
              onComplete={handleSelectionComplete}
              onBack={handleBack}
              viewModel={viewModel}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 mb-4">データが見つかりません</p>
              <button
                onClick={() => updateStep('initial')}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                最初からやり直す
              </button>
            </div>
          </div>
        )
      )}
      {currentStep === 'display' && (
        selection.domain && selection.situations.length > 0 && displayDifficulties.length > 0 ? (
          <AccommodationDisplay
            selectedDifficulties={displayDifficulties}
            selectedDomain={selection.domain}
            onRestart={handleRestart}
            onBack={handleBack}
            viewModel={viewModel}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 mb-4">データが見つかりません</p>
              <button
                onClick={() => updateStep('initial')}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                最初からやり直す
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AccommodationGenerator; 