

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CampaignDetail from './pages/CampaignDetail';
import CampaignCreatePage from './pages/CampaignCreate';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/campaigns/new" element={<CampaignCreatePage />} />
                <Route path="/campanias/:id" element={<CampaignDetail />} />
            </Routes>
        </BrowserRouter>
    );

}

export default App;
