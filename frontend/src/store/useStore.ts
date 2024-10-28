import { create } from 'zustand';
import axios from 'axios';
import type { TProduct, TAdjustment } from '../types';

type TUseStore = {
    products: TProduct[];
    adjustments: TAdjustment[];
    currentEditingProduct: TProduct | null;
    currentPage: number;
    hasMore: boolean;
    setCurrentEditingProduct: (product: TProduct | null) => void;
    fetchProducts: (page: number, limit: number) => Promise<void>;
    addProduct: (product: TProduct) => Promise<void>;
    updateProduct: (sku: string, updatedProduct: Partial<TProduct>) => Promise<void>;
    deleteProduct: (sku: string) => Promise<void>;
    fetchAdjustments: (params: any) => Promise<void>;
    addAdjustment: (adjustment: TAdjustment) => void;
};

const defaultState = {
    products: [],
    adjustments: [],
    currentEditingProduct: null,
    currentPage: 1,
    hasMore: true,
};

const useStore = create<TUseStore>(set => ({
    ...defaultState,
    
    fetchProducts: async (page, limit) => {
        try {
            const response = await axios.get(`http://localhost:3000/products?page=${page}&limit=${limit}`);
            set(state => ({
                products: page === 1 ? response.data : [...state.products, ...response.data],
                currentPage: page,
                hasMore: response.data.length === limit,
            }));
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    },

    fetchAdjustments: async (params) => {
        try {
            const response = await axios.get(`http://localhost:3000/adjustments?${params}`); // Update API endpoint as needed
            set({ adjustments: response.data });
        } catch (error) {
            console.error('Failed to fetch adjustments:', error);
        }
    },

    addProduct: async (product) => {
        try {
            const response = await axios.post('http://localhost:3000/products', product);
            set(state => ({
                products: [...state.products, response.data]
            }));
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    },

    updateProduct: async (sku, updatedProduct) => {
        try {
            const response = await axios.put(`http://localhost:3000/products/${sku}`, updatedProduct);
            set(state => ({
                products: state.products.map(product =>
                    product.sku === sku ? { ...product, ...response.data } : product
                )
            }));
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    },

    deleteProduct: async (sku) => {
        try {
            await axios.delete(`http://localhost:3000/products/${sku}`);
            set(state => ({
                products: state.products.filter(product => product.sku !== sku)
            }));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    },

    addAdjustment: (adjustment) => set(state => ({
        adjustments: [...state.adjustments, adjustment]
    })),
    setCurrentEditingProduct: (product: TProduct | null) => set({ currentEditingProduct: product }),// Set current editing product
}));

export default useStore;