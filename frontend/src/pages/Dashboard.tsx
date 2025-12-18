import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCampaigns, Campaign } from '../api/client';
import CampaignFilters from '../components/CampaignFilters';
import CampaignTable from '../components/CampaignTable';
import { Megaphone, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = parseInt(searchParams.get('page') || '0', 10);

    const [data, setData] = useState<Campaign[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(true);

    interface FilterState {
        tipo_campania?: string;
        start_date?: string;
        end_date?: string;
    }
    const [filters, setFilters] = useState<FilterState>({});

    const pageSize = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getCampaigns(page, pageSize, filters.tipo_campania, filters.start_date, filters.end_date);
            setData(result.data);
            setTotal(result.total);
        } catch (error) {
            console.error("Error fetching campaigns", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Update URL when page changes
        setSearchParams(params => {
            params.set('page', page.toString());
            return params;
        });
    }, [page, filters]);

    const handleFilter = (newFilters: any) => {
        setFilters(newFilters);
        setPage(0);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen p-8 bg-white rounded-md">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Megaphone className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Campaign Analytics Dashboard</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/campaigns/new')}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Crear Campaña
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors shadow-sm"
                        >
                            <LogOut className="w-5 h-5" />
                            Salir
                        </button>
                    </div>
                </div>
                <CampaignFilters onFilter={handleFilter} />

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <CampaignTable
                        data={data}
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

export default Dashboard
