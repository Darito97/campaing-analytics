import { useState, useEffect } from 'react';
import { getCampaigns, Campaign } from '../api/client';
import CampaignFilters from '../components/CampaignFilters';
import CampaignTable from '../components/CampaignTable';
import { Megaphone } from 'lucide-react';

const Dashboard = () => {
    const [data, setData] = useState<Campaign[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
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
    }, [page, filters]);

    const handleFilter = (newFilters: any) => {
        setFilters(newFilters);
        setPage(0);
    };

    return (
        <div className="min-h-screen p-8 bg-white rounded-md">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-8">
                    <Megaphone className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Campaign Analytics Dashboard</h1>
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
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );
}

export default Dashboard
