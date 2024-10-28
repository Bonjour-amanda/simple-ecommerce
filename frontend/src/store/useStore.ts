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
    fetchAdjustments: (page: number, limit: number) => Promise<void>;
    addAdjustment: (adjustment: TAdjustment) => Promise<void>;
    updateAdjustment: (id: number, updatedAdjustment: Partial<TAdjustment>) => Promise<void>;
    deleteAdjustment: (id: number) => Promise<void>;
    setCurrentEditingAdjustment: (adjustment: TAdjustment | null) => void;
    currentEditingAdjustment: TAdjustment | null;
};

const defaultState = {
    products: [],
    adjustments: [],
    currentEditingProduct: null,
    currentPage: 1,
    hasMore: true,
    currentEditingAdjustment: null,
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

    setCurrentEditingProduct: (product: TProduct | null) => set({ currentEditingProduct: product }),// Set current editing product

    fetchAdjustments: async (page, limit) => {
        try {
            const response = await axios.get(`http://localhost:3000/adjustments?page=${page}&limit=${limit}`); // Update API endpoint as needed
            set(state => ({
                adjustments: page === 1 ? response.data : [...state.adjustments, ...response.data],
                currentPage: page,
                hasMore: response.data.length === limit,
            }));
        } catch (error) {
            console.error('Failed to fetch adjustments:', error);
        }
    },

    addAdjustment: async (adjustment) => {
        try {
            const response = await axios.post('http://localhost:3000/adjustments', adjustment);
            set(state => ({
                adjustments: [...state.adjustments, response.data]
            }));
        } catch (error) {
            console.error('Failed to add adjustment:', error);
        }
    },

    updateAdjustment: async (id, updatedAdjustment) => {
        try {
            const response = await axios.put(`http://localhost:3000/adjustments/${id}`, updatedAdjustment);
            set(state => ({
                adjustments: state.adjustments.map(adjustment =>
                    adjustment.id === id ? { ...adjustment, ...response.data } : adjustment
                )
            }));
        } catch (error) {
            console.error('Failed to update adjustment:', error);
        }
    },

    deleteAdjustment: async (id) => {
        try {
            await axios.delete(`http://localhost:3000/adjustments/${id}`);
            set(state => ({
                adjustments: state.adjustments.filter(adj => adj.id !== id)
            }));
        } catch (error) {
            console.error('Failed to delete adjustment:', error);
        }
    },

    setCurrentEditingAdjustment: (adjustment: TAdjustment | null) => set({ currentEditingAdjustment: adjustment }),// Set current editing adjustment
   
}));

export default useStore;