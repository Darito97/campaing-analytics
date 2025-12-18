import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { createCampaign, CampaignCreate } from '../api/client';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';

const CampaignCreatePage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { register, control, handleSubmit, formState: { errors, isValid } } = useForm<CampaignCreate>({
        mode: 'onChange',
        defaultValues: {
            // General defaults
            universo_zona_metro: 0,
            impactos_personas: 0,
            impactos_vehiculos: 0,
            frecuencia_calculada: 0,
            frecuencia_promedio: 0,
            alcance: 0,
            // Demographics defaults
            nse_ab: 0, nse_c: 0, nse_cmas: 0, nse_d: 0, nse_dmas: 0, nse_e: 0,
            edad_0a14: 0, edad_15a19: 0, edad_20a24: 0, edad_25a34: 0,
            edad_35a44: 0, edad_45a64: 0, edad_65mas: 0,
            hombres: 0, mujeres: 0,
            // Lists
            sites: [],
            periods: []
        }
    });

    const { fields: siteFields, append: appendSite, remove: removeSite } = useFieldArray({
        control,
        name: "sites"
    });

    const { fields: periodFields, append: appendPeriod, remove: removePeriod } = useFieldArray({
        control,
        name: "periods"
    });

    const onSubmit: SubmitHandler<CampaignCreate> = async (data) => {
        try {
            await createCampaign(data);
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError("Error al crear la campaña. Verifica que el nombre no exista.");
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/')} className="flex items-center text-white hover:text-white">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Cancelar
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Nueva Campaña</h1>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={!isValid}
                        className={`flex items-center px-4 py-2 rounded text-white ${!isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        <Save className="w-4 h-4 mr-2" /> Guardar Campaña
                    </button>
                </div>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        ¡Campaña creada exitosamente! Redirigiendo...
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Información General</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre de Campaña *</label>
                                <input {...register("name", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                                {errors.name && <span className="text-red-500 text-xs">Requerido</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo *</label>
                                <select {...register("tipo_campania", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                                    <option value="">Seleccionar...</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="catorcenal">Catorcenal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha Inicio *</label>
                                <input type="date" {...register("fecha_inicio", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha Fin *</label>
                                <input type="date" {...register("fecha_fin", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>

                            <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div><label className="text-xs">Impactos Personas</label><input type="number" {...register("impactos_personas", { valueAsNumber: true })} className="w-full border p-1 rounded" /></div>
                                <div><label className="text-xs">Impactos Vehículos</label><input type="number" {...register("impactos_vehiculos", { valueAsNumber: true })} className="w-full border p-1 rounded" /></div>
                                <div><label className="text-xs">Universo ZM</label><input type="number" {...register("universo_zona_metro", { valueAsNumber: true })} className="w-full border p-1 rounded" /></div>
                                <div><label className="text-xs">Alcance</label><input type="number" {...register("alcance", { valueAsNumber: true })} className="w-full border p-1 rounded" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Demografía (Distribución 0-1)</h2>

                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Género</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs">Hombres</label><input type="number" step="0.01" {...register("hombres", { valueAsNumber: true })} className="w-full border p-1 rounded" /></div>
                                <div><label className="text-xs">Mujeres</label><input type="number" step="0.01" {...register("mujeres", { valueAsNumber: true })} className="w-full border p-1 rounded" /></div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Edades</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['0a14', '15a19', '20a24', '25a34', '35a44', '45a64', '65mas'].map(age => (
                                    <div key={age}><label className="text-xs">{age.replace('a', '-')}</label><input type="number" step="0.01" {...register(`edad_${age}` as any, { valueAsNumber: true })} className="w-full border p-1 rounded" /></div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-medium text-gray-700 mb-2">Nivel Socioeconómico</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['ab', 'c', 'cmas', 'd', 'dmas', 'e'].map(nse => (
                                    <div key={nse}><label className="text-xs uppercase">{nse.replace('mas', '+')}</label><input type="number" step="0.01" {...register(`nse_${nse}` as any, { valueAsNumber: true })} className="w-full border p-1 rounded" /></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded shadow">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold">Sitios</h2>
                            <button type="button" onClick={() => appendSite({
                                codigo_del_sitio: '', tipo_de_mueble: '', tipo_de_anuncio: '', estado: '', município: '', zm: '',
                                frecuencia_mensual: 0, impactos_mensuales: 0, alcance_mensual: 0, frecuencia_catorcenal: 0, impactos_catorcenal: 0
                            } as any)} className="text-indigo-600 bg-white hover:bg-indigo-50 hover:text-white flex items-center text-sm font-medium">
                                <Plus className="w-4 h-4 mr-1" /> Agregar Sitio
                            </button>
                        </div>

                        {siteFields.map((field, index) => (
                            <div key={field.id} className="mb-4 p-4 border rounded bg-gray-50 relative">
                                <button type="button" onClick={() => removeSite(index)} className="absolute top-2 right-2 text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input {...register(`sites.${index}.codigo_del_sitio`)} placeholder="Código" className="border p-1 rounded" />
                                    <input {...register(`sites.${index}.tipo_de_mueble`)} placeholder="Tipo Mueble" className="border p-1 rounded" />
                                    <input {...register(`sites.${index}.municipio`)} placeholder="Municipio" className="border p-1 rounded" />
                                    <input type="number" {...register(`sites.${index}.impactos_mensuales`, { valueAsNumber: true })} placeholder="Impactos Mensuales" className="border p-1 rounded" />
                                    <input type="number" {...register(`sites.${index}.alcance_mensual`, { valueAsNumber: true })} placeholder="Alcance Mensual" className="border p-1 rounded" />
                                </div>
                            </div>
                        ))}
                        {siteFields.length === 0 && <p className="text-gray-400 text-sm text-center">No hay sitios agregados.</p>}
                    </div>

                    <div className="bg-white p-6 rounded shadow">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-semibold">Periodos</h2>
                            <button type="button" onClick={() => appendPeriod({
                                period: '', impactos_periodo_personas: 0, impactos_periodo_vehiculos: 0
                            } as any)} className="text-indigo-600 bg-white hover:bg-indigo-50 hover:text-white flex items-center text-sm font-medium">
                                <Plus className="w-4 h-4 mr-1" /> Agregar Periodo
                            </button>
                        </div>

                        {periodFields.map((field, index) => (
                            <div key={field.id} className="mb-4 p-4 border rounded bg-gray-50 relative">
                                <button type="button" onClick={() => removePeriod(index)} className="absolute top-2 right-2 text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input {...register(`periods.${index}.period`)} placeholder="Periodo (e.g. 2024-01)" className="border p-1 rounded" />
                                    <input type="number" {...register(`periods.${index}.impactos_periodo_personas`, { valueAsNumber: true })} placeholder="Imp. Personas" className="border p-1 rounded" />
                                    <input type="number" {...register(`periods.${index}.impactos_periodo_vehiculos`, { valueAsNumber: true })} placeholder="Imp. Vehículos" className="border p-1 rounded" />
                                </div>
                            </div>
                        ))}
                        {periodFields.length === 0 && <p className="text-gray-400 text-sm text-center">No hay periodos agregados.</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignCreatePage;
