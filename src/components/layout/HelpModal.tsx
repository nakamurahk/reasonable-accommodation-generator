import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-auto">
        <div className="relative p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800 text-center">❓ {title}</h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {content}
        </div>
        <div className="flex justify-center p-4 border-t">
          <button
            onClick={onClose}
            className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
