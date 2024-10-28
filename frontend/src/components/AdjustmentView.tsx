import React, { useState } from 'react';
import AdjustmentTable from './AdjustmentTable';
import { TAdjustment } from '../types';
import useStore from '../store/useStore';
import AdjustmentModal from './AdjustmentModal';

const AdjustmentView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdjustment, setEditingAdjustment] = useState<TAdjustment | null>(null);
    const setCurrentEditingAdjustment = useStore((state) => state.setCurrentEditingAdjustment);

    const handleAddAdjustment = () => {
        setEditingAdjustment(null);
        setIsModalOpen(true);
    };

    const handleEditAdjustment = (adjustments: TAdjustment) => {
        setEditingAdjustment(adjustments);
        setCurrentEditingAdjustment(adjustments);
        setIsModalOpen(true);
    };


    return (
        <div>
            <button onClick={handleAddAdjustment}>Add Adjustment</button>
            <AdjustmentTable onEditAdjustment={handleEditAdjustment} />
            {isModalOpen && <AdjustmentModal adjustment={editingAdjustment} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default AdjustmentView;