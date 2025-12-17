import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    tipo_campania: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});

type FilterFormValues = z.infer<typeof schema>;

interface Props {
    onFilter: (values: FilterFormValues) => void;
}

const CampaignFilters = ({ onFilter }: Props) => {
    const { register, handleSubmit, reset, watch } = useForm<FilterFormValues>({
        resolver: zodResolver(schema),
    });

    const filters = watch();
    const hasActiveFilters = !!filters.tipo_campania || !!filters.start_date || !!filters.end_date;

    const handleReset = () => {
        reset();
        onFilter({});
    };

    return (
        <form onSubmit={handleSubmit(onFilter)} className="mb-4">
            <div className="flex gap-x-4 items-center flex-wrap">
                <div>
                    <label className="text-sm font-medium text-gray-700">Tipo Campaña</label>
                    <select {...register('tipo_campania')} className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                        <option value="">Todas</option>
                        <option value="mensual">Mensual</option>
                        <option value="catorcenal">Catorcenal</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Fecha Inicio</label>
                    <input type="date" {...register('start_date')} className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Fecha Fin</label>
                    <input type="date" {...register('end_date')} className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
            </div>
            <div className="flex gap-2">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Filtrar
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={!hasActiveFilters}
                    className={`px-4 py-2 rounded-md ${!hasActiveFilters ? 'bg-gray-100 text-gray-200 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:text-white hover:bg-gray-500'}`}
                >
                    Limpiar filtros
                </button>
            </div>
        </form>
    );
}

export default CampaignFilters;