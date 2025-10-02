import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CharacteristicType, Domain, Situation } from '../types';
import { ViewModel } from '../types/newDataStructure';
import InitialSelection from './pages/InitialSelection';
import DifficultyThinking from './pages/DifficultyThinking';
import DeckBuilding from './pages/DeckBuilding';
import FinalCardSelection from './pages/FinalCardSelection';
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

type Step = 'initial' | 'thinking' | 'deckbuilding' | 'finalselection' | 'display';

const AccommodationGenerator: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // URLから現在のステップを取得
  const getCurrentStep = (): Step => {
    const path = location.pathname;
    if (path === '/step1') return 'initial';
    if (path === '/step2') return 'thinking';
    if (path === '/step3') return 'deckbuilding';
    if (path === '/step4') return 'finalselection';
    if (path === '/step5') return 'display';
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
        originalDifficulties: savedData.originalDifficulties || [],
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
      originalDifficulties: [],
    };
  };

  const [currentStep, setCurrentStep] = useState<Step>(getCurrentStep());
  const [selection, setSelection] = useState<Selection>(loadSavedData().selection);
  const [selectedDifficulties, setSelectedDifficulties] = useState<any[]>(loadSavedData().selectedDifficulties);
  const [displayDifficulties, setDisplayDifficulties] = useState<any[]>(loadSavedData().displayDifficulties);
  const [originalDifficulties, setOriginalDifficulties] = useState<any[]>(loadSavedData().originalDifficulties || []);
  const [viewModel, setViewModel] = useState<ViewModel | null | undefined>(null);
  const viewModelRef = useRef<ViewModel | null | undefined>(null);
  
  // viewModelの状態を監視
  useEffect(() => {
    // console.log('viewModel state changed:', viewModel);
    viewModelRef.current = viewModel;
  }, [viewModel]);

  // URLの変更を監視してステップを更新
  useEffect(() => {
    const newStep = getCurrentStep();
    setCurrentStep(newStep);
    
    // ステップ③（deckbuilding）に直接アクセスした時は、元の全選択肢を復元
    if (newStep === 'deckbuilding') {
      const savedData = loadFromLocalStorage();
      if (savedData && savedData.originalDifficulties && savedData.originalDifficulties.length > 0) {
        setSelectedDifficulties(savedData.originalDifficulties);
      } else if (savedData && savedData.selectedDifficulties) {
        setSelectedDifficulties(savedData.selectedDifficulties);
      }
    }
    
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const updateStep = (newStep: Step) => {
    // console.log('updateStep called with:', newStep);
    setCurrentStep(newStep);
    // URLを更新
    const path = newStep === 'initial' ? '/step1' : 
                 newStep === 'thinking' ? '/step2' : 
                 newStep === 'deckbuilding' ? '/step3' :
                 newStep === 'finalselection' ? '/step4' : '/step5';
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
    updateStep('deckbuilding');
  };

  const handleDeckBuildingComplete = (data: any) => {
    // 新しいデータ構造に対応
    const selectedCards = data.selectedCards || data; // 後方互換性のため
    const originalCards = data.originalCards || data; // 後方互換性のため
    
    setSelectedDifficulties(selectedCards);
    setOriginalDifficulties(originalCards); // 元の全選択肢を保存
    
    // LocalStorageに保存
    saveToLocalStorage({
      selection,
      selectedDifficulties: selectedCards,
      displayDifficulties,
      originalDifficulties: originalCards, // 元の全選択肢を保存
    });
    
    updateStep('finalselection');
  };

  const handleFinalSelectionComplete = (difficulties: any[]) => {
    setDisplayDifficulties(difficulties);
    
    // LocalStorageに保存（originalDifficultiesは保持）
    saveToLocalStorage({
      selection,
      selectedDifficulties,
      displayDifficulties: difficulties,
      originalDifficulties, // 元の全選択肢を保持
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
    setOriginalDifficulties([]);
    
    // LocalStorageをクリア
    clearLocalStorage();
    
    // hasStartedもリセット
    localStorage.removeItem('hasStarted');
    
    // 配慮案の選択状態もクリア
    localStorage.removeItem('accommodation_selections');
    
    // URLをルートに変更してからページをリロード
    window.history.replaceState({}, '', '/');
    window.location.reload();
  };

  const handleBack = () => {
    // console.log('handleBack called, currentStep:', currentStep);
    if (currentStep === 'display') {
      // console.log('Moving from display to finalselection');
      updateStep('finalselection');
    } else if (currentStep === 'finalselection') {
      // console.log('Moving from finalselection to deckbuilding');
      // ステップ③に戻る時は、元の全選択肢を復元
      const savedData = loadFromLocalStorage();
      if (savedData && savedData.originalDifficulties && savedData.originalDifficulties.length > 0) {
        setSelectedDifficulties(savedData.originalDifficulties);
      } else if (savedData && savedData.selectedDifficulties) {
        setSelectedDifficulties(savedData.selectedDifficulties);
      }
      updateStep('deckbuilding');
    } else if (currentStep === 'deckbuilding') {
      // console.log('Moving from deckbuilding to thinking');
      updateStep('thinking');
    } else if (currentStep === 'thinking') {
      // console.log('Moving from thinking to initial');
      updateStep('initial');
    }
  };

  return (
    <div className="h-full bg-sand">
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
                className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-600 transition"
              >
                最初からやり直す
              </button>
            </div>
          </div>
        )
      )}
      {currentStep === 'deckbuilding' && (
        selectedDifficulties.length > 0 ? (
          <DeckBuilding
            selectedDifficulties={selectedDifficulties}
            onComplete={handleDeckBuildingComplete}
            onBack={handleBack}
            viewModel={viewModel}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 mb-4">データが見つかりません</p>
              <button
                onClick={() => updateStep('initial')}
                className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-600 transition"
              >
                最初からやり直す
              </button>
            </div>
          </div>
        )
      )}
      {currentStep === 'finalselection' && (
        selectedDifficulties.length > 0 ? (
          <FinalCardSelection
            selectedDifficulties={selectedDifficulties}
            onComplete={handleFinalSelectionComplete}
            onBack={handleBack}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 mb-4">データが見つかりません</p>
              <button
                onClick={() => updateStep('initial')}
                className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-600 transition"
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
            characteristics={selection.characteristics}
            situations={selection.situations}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 mb-4">データが見つかりません</p>
              <button
                onClick={() => updateStep('initial')}
                className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-600 transition"
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