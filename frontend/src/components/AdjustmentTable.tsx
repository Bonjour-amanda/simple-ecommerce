import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TAdjustment } from '../types';
import useStore from '../store/useStore';
import '../styles/adjustments-table.scss';

type TAdjusmentListProps = {
    onEditAdjustment: (adjustment: TAdjustment) => void;
};  

const AdjustmentTable = ({ onEditAdjustment }: TAdjusmentListProps) => {
    const adjustments = useStore((state) => state.adjustments);
    const fetchAdjustments = useStore((state) => state.fetchAdjustments);
    const deleteAdjustment = useStore((state) => state.deleteAdjustment);
    const currentPage = useStore((state) => state.currentPage);
    const hasMore = useStore((state) => state.hasMore);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadAdjustments = async () => {
            setLoading(true);
            await fetchAdjustments(1, 10); // Initial load with page 1 and limit 10
            setLoading(false);
        };
        loadAdjustments();
    }, [fetchAdjustments]);

    const handleEdit = (adjustment: TAdjustment) => {
        onEditAdjustment(adjustment);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteAdjustment(id);
        setLoading(false);
    };

    const fetchMoreAdjustments = async () => {
        setLoading(true);
        await fetchAdjustments(currentPage + 1, 10); // Fetch next page with limit 10
        setLoading(false);
    };

    return (
        <InfiniteScroll
            dataLength={adjustments.length}
            next={fetchMoreAdjustments}
            hasMore={hasMore}
            loader={loading && <h4>Loading...</h4>}
        >
            <table>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {adjustments.map((adjustment, index) => (
                        <tr key={index}>
                            <td>{adjustment.sku}</td>
                            <td>{adjustment.qty}</td>
                            <td>{adjustment.amount}</td>
                            <td>
                                <button onClick={() => handleEdit(adjustment)}>Edit</button>
                                <button onClick={() => handleDelete(adjustment.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </InfiniteScroll>
    );
};

export default AdjustmentTable;