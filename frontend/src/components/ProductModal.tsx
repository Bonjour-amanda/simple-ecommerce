import React, { useEffect, useState, useRef } from 'react';
import useStore from '../store/useStore';
import { TProduct } from '../types';
import '../styles/product-modal.scss';

type TProductModalProps = {
    onClose: () => void;
    product: TProduct | null;
};

const ProductModal = ({ onClose, product }: TProductModalProps) => {
    const addProduct = useStore(state => state.addProduct);
    const updateProduct = useStore(state => state.updateProduct);

    const [title, setTitle] = useState('');
    const [sku, setSku] = useState('');
    const [image, setImage] = useState<string[]>([]);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [dragging, setDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (product) {
            setTitle(product.title);
            setSku(product.sku);
            setImage([...product.images]);
            setPrice(product.price);
            setDescription(product.description || '');
        } else {
            // Reset fields if there's no product to edit
            setTitle('');
            setSku('');
            setImage([]);
            setPrice(0);
            setDescription('');
        }
    }, [product]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage([reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage([reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDropAreaClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct = { title, sku, images: image, price, description };
        if (product) {
            updateProduct(product.sku, newProduct);
        } else {
            addProduct(newProduct);
        }
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                        <input className='ml-1' value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" required />
                        <div
                            className={`drop-area ml-1 ${dragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleDropAreaClick}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} />
                            {image?.length > 0 ? (
                                <img src={image[0]} alt="Product" className="preview-image" />
                            ) : (
                                <p>Drag & drop an image here, or click to select one</p>
                            )}
                        </div>
                        <input value={price} onChange={(e) => setPrice(Number(e.target.value))} type="number" placeholder="Price" required />
                        <input className='ml-1' value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                        <div className="modal-footer">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit">{product ? 'Update' : 'Add'} Product</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;