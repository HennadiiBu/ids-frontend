import { createPortal } from 'react-dom';
import { useEffect } from 'react';

import { ModalBackdrop, ModalClose, ModalContent } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!modalRoot) {
    console.error('Modal root not found');
  }
  

  const handleBackdropClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose();
  };

  return createPortal(
    <ModalBackdrop onClick={handleBackdropClick}>
      <ModalContent>
        <ModalClose onClick={handleCloseClick}>x</ModalClose>
        {children}
      </ModalContent>
    </ModalBackdrop>,
    modalRoot
  );
};
