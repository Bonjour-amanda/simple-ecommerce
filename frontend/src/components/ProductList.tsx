import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useStore from '../store/useStore';
import ProductCard from './ProductCard';
import { TProduct } from '../types';

type TProductListProps = {
    onEditProduct: (product: TProduct) => void;
};  

const ProductList = ({ onEditProduct }: TProductListProps) => {
    const products = useStore((state) => state.products);
    const fetchProducts = useStore((state) => state.fetchProducts);
    const deleteProduct = useStore((state) => state.deleteProduct);
    const hasMore = products.length < 100;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            await fetchProducts();
            setLoading(false);
        };
        loadProducts();
    }, [fetchProducts]);

    const handleEdit = (product: TProduct) => {
        onEditProduct(product);
    };

    const handleDelete = (sku: string) => {
        deleteProduct(sku);
    };

    const fetchMoreProducts = async () => {
        setLoading(true);
        await fetchProducts();
        setLoading(false);
    };

    return (
        <InfiniteScroll
            dataLength={products.length}
            next={fetchMoreProducts} 
            hasMore={hasMore}
            loader={loading && <h4>Loading...</h4>}
        >
            <div className="product-list">
                {products.map((product) => (
                    <ProductCard 
                        key={product.sku} 
                        product={product} 
                        onEdit={() => handleEdit(product)} 
                        onDelete={() => handleDelete(product.sku)} 
                    />
                ))}
            </div>
        </InfiniteScroll>
    );
};

export default ProductList;