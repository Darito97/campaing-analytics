import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampaignDetail, CampaignDetail as CampaignDetailType } from '../api/client';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Megaphone, MapPin, TrendingUp, Users, PieChart as PieChartIcon, ArrowLeft, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CampaignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<CampaignDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [printing, setPrinting] = useState(false);

    useEffect(() => {
        if (!id) return;
        getCampaignDetail(id)
            .then(setCampaign)
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!campaign) return <div className="p-8 text-center text-red-600">Campaign not found</div>;

    // Transform data for demographics charts
    const ageData = [
        { name: '0-14', value: campaign.edad_0a14 },
        { name: '15-19', value: campaign.edad_15a19 },
        { name: '20-24', value: campaign.edad_20a24 },
        { name: '25-34', value: campaign.edad_25a34 },
        { name: '35-44', value: campaign.edad_35a44 },
        { name: '45-64', value: campaign.edad_45a64 },
        { name: '65+', value: campaign.edad_65mas },
    ];

    const nseData = [
        { name: 'AB', value: campaign.nse_ab },
        { name: 'C', value: campaign.nse_c },
        { name: 'C+', value: campaign.nse_cmas },
        { name: 'D', value: campaign.nse_d },
        { name: 'D+', value: campaign.nse_dmas },
        { name: 'E', value: campaign.nse_e },
    ];

    const hasSites = campaign.sites && campaign.sites.length > 0;
    const hasPeriods = campaign.periods && campaign.periods.length > 0;
    const hasAgeData = ageData.some(d => d.value > 0);
    const hasNseData = nseData.some(d => d.value > 0);

    const handleDownloadPDF = async () => {
        const element = document.getElementById('campaign-detail-content');
        if (!element) return;

        try {
            setPrinting(true);
            element.scrollIntoView({ behavior: 'auto' });
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const canvas = await html2canvas(element, {
                scale: 2,
                ignoreElements: (element) => element.classList.contains('no-print')
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 3, 3, pdfWidth, pdfHeight);
            pdf.save(`reporte_${campaign?.name || 'campana'}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setPrinting(false);
        }
    };


    return (
        <div className="min-h-screen p-4 md:p-8 bg-white rounded-md">
            <div className="max-w-7xl mx-auto" id="campaign-detail-content">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 no-print">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-white hover:text-white font-medium gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={printing}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" /> PDF
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Megaphone className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                        {campaign.name}
                    </h1>
                    <div className="grid grid-cols-1 gap-4 text-md md:text-lg text-gray-600">
                        <div><span className="font-semibold">Tipo:</span> {campaign.tipo_campania}</div>
                        <div><span className="font-semibold">Inicio:</span> {campaign.fecha_inicio}</div>
                        <div><span className="font-semibold">Fin:</span> {campaign.fecha_fin}</div>
                        <div><span className="font-semibold">Impactos Total:</span> {campaign.impactos_personas.toLocaleString()}</div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {hasSites && (
                        <div className="bg-white p-4 md:p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-600" />
                                Resumen de Sitios (Top 10)
                            </h2>
                            <div className="h-64 md:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={campaign.sites.slice(0, 10)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="codigo_del_sitio" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="impactos_mensuales" name="Impactos (Mes)" fill="#8884d8" />
                                        <Bar dataKey="alcance_mensual" name="Alcance (Mes)" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {hasPeriods && (
                        <div className="bg-white p-4 md:p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-gray-600" />
                                Desempeño por Periodo
                            </h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={campaign.periods} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="impactos_periodo_personas" name="Impactos Personas" stroke="#8884d8" strokeWidth={2} />
                                        <Line type="monotone" dataKey="impactos_periodo_vehiculos" name="Impactos Vehículos" stroke="#82ca9d" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {hasAgeData && (
                        <div className="bg-white p-4 md:p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-600" />
                                Demografía: Edades
                            </h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ageData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} />
                                        <YAxis dataKey="name" type="category" />
                                        <Tooltip formatter={(val: any) => `${(val * 100).toFixed(2)}%`} />
                                        <Bar dataKey="value" name="Distribución" fill="#0088FE" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {hasNseData && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                                <PieChartIcon className="w-5 h-5 text-gray-600" />
                                Nivel Socioeconómico
                            </h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={nseData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${(value * 100).toFixed(0)}%`}
                                        >
                                            {nseData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(val: any) => `${(val * 100).toFixed(2)}%`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default CampaignDetail;
