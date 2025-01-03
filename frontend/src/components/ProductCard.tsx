import React, { useState } from 'react';
import { TProduct } from '../types';
import ImageModal from './ImageModal';

interface ProductCardProps {
    product: TProduct;
    onEdit: (product: TProduct) => void;
    onDelete: (sku: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="product-card">
            <img 
                src={product?.images?.[0]} 
                alt={product.title} 
                className="product-image" 
                onClick={handleImageClick} 
                style={{ width: '20%', height: 'auto' }}
            />
            <h3>{product.title}</h3>
            <p>SKU: {product.sku}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => onEdit(product)}>Edit</button>
            <button onClick={() => onDelete(product.sku)}>Delete</button>
            {isModalOpen && (
                <ImageModal imageUrl={product?.images[0]} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default ProductCard;