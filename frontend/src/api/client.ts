import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Campaign Types
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

// Request Interceptor to add Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Campaign {
  name: string;
  tipo_campania: string;
  fecha_inicio: string;
  fecha_fin: string;
  universo_zona_metro: number;
  impactos_personas: number;
  impactos_vehiculos: number;
  frecuencia_calculada: number;
  frecuencia_promedio: number;
  alcance: number;
  nse_ab: number;
  nse_c: number;
  nse_cmas: number;
  nse_d: number;
  nse_dmas: number;
  nse_e: number;
  edad_0a14: number;
  edad_15a19: number;
  edad_20a24: number;
  edad_25a34: number;
  edad_35a44: number;
  edad_45a64: number;
  edad_65mas: number;
  hombres: number;
  mujeres: number;
}

export interface CampaignListResponse {
  data: Campaign[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CampaignPeriod {
  id: number;
  campaign_name: string;
  period: string;
  impactos_periodo_personas: number;
  impactos_periodo_vehiculos: number;
}

export interface CampaignSite {
    id: number;
    campaign_name: string;
    codigo_del_sitio: string;
    tipo_de_mueble: string;
    tipo_de_anuncio: string;
    estado: string;
    municipio: string;
    zm: string;
    frecuencia_catorcenal: number;
    frecuencia_mensual: number;
    impactos_catorcenal: number;
    impactos_mensuales: number;
    alcance_mensual: number;
}

export interface CampaignDetail extends Campaign {
    periods: CampaignPeriod[];
    sites: CampaignSite[];
}

// API Functions
export const getCampaigns = async (
  page: number = 0, 
  limit: number = 5, 
  tipo_campania?: string,
  start_date?: string,
  end_date?: string
): Promise<CampaignListResponse> => {
  const params: any = { skip: page * limit, limit };
  if (tipo_campania && tipo_campania !== 'all') params.tipo_campania = tipo_campania;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const response = await api.get<CampaignListResponse>('/campaigns/', { params });
  return response.data;
};

export const getCampaignDetail = async (id: string): Promise<CampaignDetail> => {
  const response = await api.get<CampaignDetail>(`/campaigns/${id}`);
  return response.data;
};

// Creation Types
export interface CampaignSiteCreate extends Omit<CampaignSite, 'id' | 'campaign_name'> {}
export interface CampaignPeriodCreate extends Omit<CampaignPeriod, 'id' | 'campaign_name'> {}

export interface CampaignCreate extends Campaign {
    sites: CampaignSiteCreate[];
    periods: CampaignPeriodCreate[];
}

export const createCampaign = async (data: CampaignCreate): Promise<Campaign> => {
    const response = await api.post<Campaign>('/campaigns', data);
    return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Send as x-www-form-urlencoded for OAuth2 standard
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    
    // Explicitly check for slash command or formatting issues
    const response = await api.post<LoginResponse>('/token', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data;
};

export default api;
