import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { ReasonableAccommodation } from '../../types';
import reasonableAccommodations from '../../data/user/ReasonableAccommodation.json';
import { useIsMobile } from '../../hooks/useIsMobile';

// 仮データ
const initialDifficulties = [
  {
    id: '1',
    title: 'タスクが多くて整理できない',
    icon: '📝',
    cares: [
      { label: '人的サポート', color: 'bg-blue-100 text-blue-700', text: '上司との優先順位確認(人的サポート)' },
      { label: 'ツール導入', color: 'bg-orange-100 text-orange-700', text: 'タスク管理ツールの導入（ツール導入）' },
      { label: '人的サポート', color: 'bg-yellow-100 text-yellow-700', text: '優先順位マトリクスの提供（人的サポート）' },
    ]
  },
  {
    id: '2',
    title: '周りに迷惑をかけてしまうことが怖い',
    icon: '😨',
    cares: [
      { label: '人的サポート', color: 'bg-blue-100 text-blue-700', text: '定期的なフィードバックの場を設ける' },
      { label: '環境調整', color: 'bg-green-100 text-green-700', text: '静かな作業環境の確保' },
      { label: '情報共有', color: 'bg-purple-100 text-purple-700', text: 'チーム内での情報共有の徹底' },
    ]
  },
  {
    id: '3',
    title: 'スケジュールの見直しが立てづらい',
    icon: '⚠️',
    cares: [
      { label: 'ツール導入', color: 'bg-orange-100 text-orange-700', text: 'スケジュール管理ツールの導入' },
      { label: '人的サポート', color: 'bg-blue-100 text-blue-700', text: '上司との定期的な面談' },
      { label: '情報共有', color: 'bg-purple-100 text-purple-700', text: '進捗共有の仕組み化' },
    ]
  },
  {
    id: '4',
    title: '仕事に集中できない',
    icon: '💬',
    cares: [
      { label: '環境調整', color: 'bg-green-100 text-green-700', text: 'ノイズキャンセリングヘッドホンの利用' },
      { label: '人的サポート', color: 'bg-blue-100 text-blue-700', text: '集中タイムの設定' },
      { label: '情報共有', color: 'bg-purple-100 text-purple-700', text: '業務分担の明確化' },
    ]
  },
  {
    id: '5',
    title: '午後に強い眠気が来て作業効率が大きく落ちる',
    icon: '😪',
    cares: [
      { label: '環境調整', color: 'bg-green-100 text-green-700', text: '昼寝タイムの導入' },
      { label: 'ツール導入', color: 'bg-orange-100 text-orange-700', text: '作業タイマーの活用' },
      { label: '人的サポート', color: 'bg-blue-100 text-blue-700', text: '業務量の調整' },
    ]
  },
  {
    id: '6',
    title: '注意されると強いストレス',
    icon: '💥',
    cares: [
      { label: '人的サポート', color: 'bg-blue-100 text-blue-700', text: '注意の伝え方の工夫' },
      { label: '情報共有', color: 'bg-purple-100 text-purple-700', text: '事前に注意点を共有' },
      { label: '環境調整', color: 'bg-green-100 text-green-700', text: 'リラックスできるスペースの提供' },
    ]
  },
  {
    id: '7',
    title: 'リモートワーク時の孤独感や不安',
    icon: '🧑‍💻',
    cares: [
      { label: '人的サポート', color: 'bg-blue-100 text-blue-700', text: '定期的な1on1の実施' },
      { label: '情報共有', color: 'bg-purple-100 text-purple-700', text: 'オンライン雑談の場を設ける' },
      { label: '環境調整', color: 'bg-green-100 text-green-700', text: 'コミュニケーションツールの活用' },
    ]
  },
];

type DifficultyItem = {
  id: string;
  title: string;
  icon: string;
  cares: any[];
};

type DifficultySelectionProps = {
  difficulties: DifficultyItem[];
  onComplete: (selectedDifficulties: DifficultyItem[]) => void;
  onBack: () => void;
};

function SortableItem({ item, idx, openId, handleAccordion, isMobile, isDragging: isGlobalDragging, openModal }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  
  // ドラッグ中のスタイルを分離して競合を避ける
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 50 : 1,
    // ドラッグ中の安定性を向上
    willChange: isDragging ? 'transform' : 'auto',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
    // モバイルでのドラッグ操作を改善
    touchAction: 'none' as const,
  };
  
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl shadow flex flex-col border ${
        idx < 3 ? 'border-yellow-400' : 'border-transparent'
      } ${
        isDragging 
          ? 'ring-4 ring-indigo-400 shadow-2xl opacity-90 transform-gpu bg-indigo-50 scale-105 rotate-1' 
          : 'transition-all duration-200 hover:shadow-lg'
      }`}
    >
      <div className={`flex items-center ${isMobile ? 'px-2 py-1' : 'px-4 py-2'}`}>
        <div className="flex-1 cursor-pointer" onClick={() => !isGlobalDragging && handleAccordion(item.id)}>
          <span className="font-medium text-gray-800">
            {idx < 3 && <span className="text-yellow-400 text-lg mr-2">★</span>}
            {item.title || item.name || ''}
          </span>
        </div>
        <div 
          {...attributes}
          {...listeners}
          className={`${isMobile ? 'mr-0.5' : 'mr-1'} rounded-lg ${isMobile ? 'min-w-[64px] min-h-[32px]' : 'min-w-[48px] min-h-[32px]'} flex items-center justify-center cursor-grab active:cursor-grabbing ${isMobile ? 'p-2' : 'p-3'}`}
        >
          <span className={`${isMobile ? 'text-3xl' : 'text-2xl'} text-gray-400`}>☰</span>
        </div>
      </div>
      {openId === item.id && (
        <div className="bg-indigo-50 px-4 py-4 rounded-b-xl border-t">
          <ul className="space-y-2">
            {getAccommodations(item.title).map((acc: any, i: number) => {
              const domain = '企業'; // デフォルトは企業、実際のドメインに応じて変更
              const content = acc[`${domain}の具体的配慮例`] || acc['企業の具体的配慮例'] || '具体的な配慮例がありません';
              
              return (
                <li key={i} className="flex items-start mb-2">
                  <span className="font-bold text-gray-700 mr-1 flex-shrink-0 whitespace-nowrap">配慮案{ACC_LABELS[i % ACC_LABELS.length]}:</span>
                  <div className="flex items-center flex-1">
                    <span className="text-gray-700">{acc['配慮内容']}</span>
                    <button
                      onClick={() => openModal(`${acc['配慮内容']}の具体的な配慮案`, content)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800 text-lg transition-colors"
                      title="具体的な配慮案を表示"
                    >
                      ▶
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}

const ACC_ICONS = [
  '★', // A
  '★', // B
  '★', // C
  '★', // D
];
const ACC_LABELS = ['A', 'B', 'C', 'D'];

// 配慮案抽出関数
const getAccommodations = (title: string): any[] => {
  return (reasonableAccommodations as any[])
    .filter(item => item['困りごと内容'] === title)
    .slice(0, 4); // 最大4件
};

const DifficultySelection: React.FC<DifficultySelectionProps> = ({ onComplete, difficulties, onBack }) => {
  const [difficultiesState, setDifficultiesState] = useState<DifficultyItem[]>(difficulties);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);
  const isMobile = useIsMobile();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleAccordion = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    // ドラッグ開始時の処理
    console.log('Drag started:', event.active.id);
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = difficultiesState.findIndex((item) => item.id === active.id);
      const newIndex = difficultiesState.findIndex((item) => item.id === over?.id);
      setDifficultiesState((items) => arrayMove(items, oldIndex, newIndex));
    }
    setIsDragging(false);
  };

  const handleNext = () => {
    // 上位3つの困りごと情報のみを渡す
    const topThreeDifficulties = difficultiesState.slice(0, 3);
    onComplete(topThreeDifficulties);
  };

  // モーダルを開く関数
  const openModal = (title: string, content: string) => {
    setModalContent({ title, content });
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setModalContent(null);
  };

  // モバイル用UI
  if (isMobile) {
    return (
      <div className="max-w-none mx-auto p-4 space-y-6">
        {/* 説明文 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                       <p className="text-gray-700 text-base leading-relaxed">
          <strong>困りごとに優先順位を付けましょう。</strong><br />
ドラッグ＆ドロップで<strong>上位<span className="text-red-500 font-bold">3</span>つ</strong>に絞ります。クリックで配慮案を確認できます。<span className="text-indigo-600">▶</span>で詳細を確認できます。
        </p>
        </div>
        
        <div className="space-y-4">
          
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={difficultiesState.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                          <div className="bg-gray-100 p-4 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500 text-sm mb-3">
                📋 ドラッグ＆ドロップで順序を変更できます
              </div>
              <ul className="space-y-2">
                  {difficultiesState.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      <SortableItem item={item} idx={idx} openId={openId} handleAccordion={handleAccordion} isMobile={isMobile} isDragging={isDragging} openModal={openModal} />
                      {idx === 2 && idx !== difficultiesState.length - 1 && (
                        <li>
                          <div className="border-t border-gray-300 my-2" />
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </SortableContext>
          </DndContext>
          
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleNext}
              className="w-full px-8 py-4 rounded-full bg-indigo-500 text-white font-semibold text-lg shadow hover:bg-indigo-600 transition"
            >
              次へ進む
            </button>
            <button
              onClick={onBack}
              className="w-full px-8 py-4 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold text-lg shadow hover:bg-gray-100 transition"
            >
              前のページに戻る
            </button>
          </div>
        </div>
        
        {/* モーダル */}
        {modalContent && (
          <Modal
            isOpen={!!modalContent}
            onClose={closeModal}
            title={modalContent.title}
            content={modalContent.content}
          />
        )}
      </div>
    );
  }

  // PC版UI（既存のまま）
  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* 説明文 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                           <p className="text-gray-700 text-lg leading-relaxed">
          <strong>困りごとに優先順位を付けましょう。</strong><br />
ドラッグ＆ドロップで<strong>上位<span className="text-red-500 font-bold">3</span>つ</strong>に絞ります。クリックで配慮案を確認できます。<span className="text-indigo-600">▶</span>で詳細を確認できます。
        </p>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={difficultiesState.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                  <div className="bg-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500 text-sm mb-4">
            📋 ドラッグ＆ドロップで順序を変更できます
          </div>
          <ul className="space-y-2">
              {difficultiesState.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <SortableItem item={item} idx={idx} openId={openId} handleAccordion={handleAccordion} isMobile={isMobile} isDragging={isDragging} openModal={openModal} />
                  {idx === 2 && idx !== difficultiesState.length - 1 && (
                    <li>
                      <div className="border-t border-gray-300 my-2" />
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold text-lg shadow hover:bg-gray-100 transition"
        >
          前のページに戻る
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-indigo-500 text-white font-semibold text-lg shadow hover:bg-indigo-600 transition"
        >
          次へ進む
        </button>
      </div>
      
      {/* モーダル */}
      {modalContent && (
        <Modal
          isOpen={!!modalContent}
          onClose={closeModal}
          title={modalContent.title}
          content={modalContent.content}
        />
      )}
    </div>
  );
};

// モーダルコンポーネント
const Modal = ({ isOpen, onClose, title, content }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  content: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelection;

 