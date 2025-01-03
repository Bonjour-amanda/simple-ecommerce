import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductModal from './ProductModal';
import useStore from '../store/useStore';
import { TProduct } from '../types';

const ProductView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
    const setCurrentEditingProduct = useStore((state) => state.setCurrentEditingProduct);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: TProduct) => {
        setEditingProduct(product);
        setCurrentEditingProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div>
            <button onClick={handleAddProduct}>Add Product</button>
            <ProductList onEditProduct={handleEditProduct} />
            {isModalOpen && <ProductModal product={editingProduct} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default ProductView;