import React from 'react';
import '../styles/image-modal.scss';

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    return (
        <div className="image-modal">
            <div className="image-modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <img src={imageUrl} alt="Product" />
            </div>
        </div>
    );
};

export default ImageModal;