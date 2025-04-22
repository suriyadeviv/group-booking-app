import React from 'react';

interface OverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const OverlayModal: React.FC<OverlayModalProps> = ({ 
  isOpen, 
  onClose,
  theme = 'light'
}) => {
  if (!isOpen) return null;

  // Theme-based styles
  const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const buttonBg = theme === 'dark' 
    ? 'bg-teal-600 hover:bg-teal-700' 
    : 'bg-blue-600 hover:bg-blue-700';
  const overlayBg = theme === 'dark' ? 'bg-black/60' : 'bg-black/40';

  return (
    <div className={`fixed inset-0 ${overlayBg} z-50 flex items-center justify-center`} role="dialog"
    aria-modal="true">
      <div className={`${modalBg} ${textColor} p-6 rounded-2xl shadow-xl w-full max-w-sm text-center`}>
        <h2 className="text-xl font-semibold mb-4">Form Submitted!</h2>
        <p className="mb-6">Your request has been successfully submitted.</p>
        <button
          onClick={onClose}
          className={`${buttonBg} text-white px-4 py-2 rounded transition`}
        >
          Close
        </button>
      </div>
    </div>
  );
};