import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { TAdjustment } from '../types';
import '../styles/adjustment-modal.scss';

type TAdjustmentModalProps = {
    onClose: () => void;
    adjustment: TAdjustment | null;
};

const AdjustmentModal = ({ onClose, adjustment }: TAdjustmentModalProps) => {
    const addAdjustment = useStore(state => state.addAdjustment);
    const updateAdjustment = useStore(state => state.updateAdjustment);

    const [sku, setSku] = useState('');
    const [qty, setQty] = useState(0);

    useEffect(() => {
        if (adjustment) {
            setSku(adjustment.sku);
            setQty(adjustment.qty);
        } else {
            // Reset fields if there's no adjustment to edit
            setSku('');
            setQty(0);
        }
    }, [adjustment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newAdjustment = { sku, qty } as any;
        if (adjustment) {
            updateAdjustment(adjustment.id, newAdjustment);
        } else {
            addAdjustment(newAdjustment);
        }
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{adjustment ? 'Edit Adjustment' : 'Add Adjustment'}</h2>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" required />
                        <input className='ml-1' value={qty} onChange={(e) => setQty(Number(e.target.value))} type="number" placeholder="Quantity" required />
                        <div className="modal-footer">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit">{adjustment ? 'Update' : 'Add'} Adjustment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdjustmentModal;