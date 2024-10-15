import { create } from 'zustand';
import axios from 'axios';
import type { TProduct, TAdjustment } from '../types';

type TUseStore = {
    products: TProduct[];
    adjustments: TAdjustment[];
    currentEditingProduct: TProduct | null;
    setCurrentEditingProduct: (product: TProduct | null) => void;
    fetchProducts: () => Promise<void>;
    fetchAdjustments: () => Promise<void>;
    addProduct: (product: TProduct) => void;
    updateProduct: (sku: string, updatedProduct: Partial<TProduct>) => void;
    deleteProduct: (sku: string) => void;
    addAdjustment: (adjustment: TAdjustment) => void;
};

const defaultState = {
    products: [],
    adjustments: [],
    currentEditingProduct: null,
};

const useStore = create<TUseStore>(set => ({
    ...defaultState,
    
    fetchProducts: async () => {
        try {
            const response = await axios.get('/products'); // Update API endpoint as needed
            set({ products: response.data });
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    },

    fetchAdjustments: async () => {
        try {
            const response = await axios.get('/adjustments'); // Update API endpoint as needed
            set({ adjustments: response.data });
        } catch (error) {
            console.error('Failed to fetch adjustments:', error);
        }
    },

    addProduct: (product) => set(state => ({
        products: [...state.products, product]
    })),

    updateProduct: (sku, updatedProduct) => set(state => ({
        products: state.products.map(product =>
            product.sku === sku ? { ...product, ...updatedProduct } : product
        )
    })),

    deleteProduct: (sku) => set(state => ({
        products: state.products.filter(product => product.sku !== sku)
    })),

    addAdjustment: (adjustment) => set(state => ({
        adjustments: [...state.adjustments, adjustment]
    })),
    setCurrentEditingProduct: (product: TProduct | null) => set({ currentEditingProduct: product }),// Set current editing product
}));

export default useStore;
