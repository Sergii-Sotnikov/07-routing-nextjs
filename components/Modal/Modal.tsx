import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { useEffect, useState } from "react";

interface ModalProps {
  closeModal: () => void;
  children: React.ReactNode;
}

export default function Modal({ closeModal,  children}: ModalProps) {

const [mounted, setMounted] = useState<boolean>(false)

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

useEffect(() => {
  setMounted(true)
	const handleKeyDown = (e: KeyboardEvent) => {
	  if (e.key === "Escape") {
	    closeModal();
	  }
	};
	
	document.addEventListener("keydown", handleKeyDown);
	document.body.style.overflow = "hidden";

	return () => {
	  document.removeEventListener("keydown", handleKeyDown);
	  document.body.style.overflow = "";
	};
}, [closeModal]);

if (!mounted) return null;
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;


  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
