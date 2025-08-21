import React, {useEffect, useRef} from "react";

type ModalProps = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({open, title, onClose, children}:Readonly<ModalProps>) {
    const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`);

    useEffect( () => {
        if (!open) return;
        const onKey = (e:KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        }, [open, onClose]);

    if (!open) return null;

    const onOverlayClick = () => onClose();
    const onCardClick: React.MouseEventHandler<HTMLDivElement> = (e) => e.stopPropagation();

    return (
        <div className="modal-overlay" onClick={onOverlayClick}>
            <div
                className="modal"
                onClick={onCardClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId.current : undefined}
            ><header className="modal-header">
                {title && <h3 id={titleId.current}>{title}</h3>}
                <button className="modal-close modal-close--icon" type="button" onClick={onClose} aria-label="Cancel">
                    x
                </button>
            </header>
            <div className="modal-content">{children}</div>
            </div>
        </div>
    );
}