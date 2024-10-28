import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductView from './components/ProductView';
import AdjustmentView from './components/AdjustmentView';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <nav>
                    <ul>
                        <li>
                            <Link to="/products">Products</Link>
                        </li>
                        <li>
                            <Link to="/adjustments">Adjustments</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/products" element={<ProductView />} />
                    <Route path="/adjustments" element={<AdjustmentView />} />
                    <Route path="/" element={<ProductView />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;