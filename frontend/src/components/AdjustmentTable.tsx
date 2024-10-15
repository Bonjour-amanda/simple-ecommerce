import React from 'react';
import { TAdjustment } from '../types';

interface AdjustmentTableProps {
    adjustments: TAdjustment[];
}

const AdjustmentTable: React.FC<AdjustmentTableProps> = ({ adjustments }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>SKU</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                {adjustments.map((adjustment, index) => (
                    <tr key={index}>
                        <td>{adjustment.sku}</td>
                        <td>{adjustment.qty}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AdjustmentTable;
