
import React, { useState, useMemo } from 'react';
import { TripData, TransportMode, CalculationResult } from './types';
import { 
  EMISSION_FACTORS, 
  TRANSPORT_LABELS, 
  PREDEFINED_ROUTES, 
  CO2_PER_TREE_YEAR_KG, 
  SMARTPHONE_CHARGE_CO2_G, 
  PLASTIC_BOTTLE_CO2_G 
} from './constants';
import { getTravelInsights } from './services/geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

// --- Helper Components ---

const App: React.FC = () => {
  const [tripData, setTripData] = useState<TripData>({
    origin: '',
    destination: '',
    distance: 0,
    mode: TransportMode.CAR_PETROL,
    passengers: 1,
  });

  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Calculate CO2 and impact
  const result: CalculationResult | null = useMemo(() => {
    if (tripData.distance <= 0) return null;
    
    const factor = EMISSION_FACTORS[tripData.mode];
    const totalG = (factor * tripData.distance) / tripData.passengers;
    const totalKg = totalG / 1000;
    
    return {
      co2Kg: totalKg,
      treesNeeded: totalKg / CO2_PER_TREE_YEAR_KG,
      equivalents: {
        smartphonesCharged: Math.floor(totalG / SMARTPHONE_CHARGE_CO2_G),
        plasticBottles: Math.floor(totalG / PLASTIC_BOTTLE_CO2_G),
      }
    };
  }, [tripData]);

  // Fetch AI insights when a significant calculation is made
  const fetchInsights = async () => {
    if (!result || tripData.distance === 0) return;
    setLoadingAi(true);
    const insights = await getTravelInsights(tripData, result);
    setAiInsights(insights);
    setLoadingAi(false);
  };

  const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const route = PREDEFINED_ROUTES.find(r => r.id === e.target.value);
    if (route) {
      const [origin, destination] = route.name.split(' - ');
      setTripData(prev => ({
        ...prev,
        origin,
        destination,
        distance: route.distanceKm
      }));
    }
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    return Object.entries(EMISSION_FACTORS).map(([mode, factor]) => ({
      name: TRANSPORT_LABELS[mode as TransportMode],
      co2: (factor * tripData.distance / tripData.passengers) / 1000,
      isCurrent: mode === tripData.mode
    })).sort((a, b) => a.co2 - b.co2);
  }, [result, tripData.mode, tripData.distance, tripData.passengers]);

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      {/* Header */}
      <header className="bg-emerald-600 text-white py-8 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl">
               <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">EcoTrip</h1>
              <p className="text-emerald-100 text-sm opacity-90">Calculadora de Impacto Ambiental</p>
            </div>
          </div>
          <p className="text-right text-emerald-50 hidden md:block">Descubra sua pegada de carbono em viagens</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Section */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Dados da Viagem
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rotas Comuns</label>
                <select 
                  onChange={handleRouteChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="">Selecionar uma rota pré-definida...</option>
                  {PREDEFINED_ROUTES.map(route => (
                    <option key={route.id} value={route.id}>{route.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Origem</label>
                  <input 
                    type="text"
                    value={tripData.origin}
                    onChange={e => setTripData(p => ({ ...p, origin: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: São Paulo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destino</label>
                  <input 
                    type="text"
                    value={tripData.destination}
                    onChange={e => setTripData(p => ({ ...p, destination: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: Rio de Janeiro"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Distância Total (km)</label>
                <input 
                  type="number"
                  min="0"
                  value={tripData.distance || ''}
                  onChange={e => setTripData(p => ({ ...p, distance: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meio de Transporte</label>
                <select 
                  value={tripData.mode}
                  onChange={e => setTripData(p => ({ ...p, mode: e.target.value as TransportMode }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.entries(TRANSPORT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número de Passageiros</label>
                <input 
                  type="number"
                  min="1"
                  value={tripData.passengers}
                  onChange={e => setTripData(p => ({ ...p, passengers: Number(e.target.value) }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button 
                onClick={fetchInsights}
                disabled={tripData.distance <= 0 || loadingAi}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md disabled:bg-emerald-300 disabled:cursor-not-allowed mt-2"
              >
                {loadingAi ? 'Analisando Impacto...' : 'Gerar Relatório Completo'}
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Pronto para começar?</h3>
              <p className="text-slate-500 max-w-xs mt-2">Insira a distância e o meio de transporte para ver os cálculos de emissão em tempo real.</p>
            </div>
          ) : (
            <>
              {/* Primary Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Emissão Total</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-800">{result.co2Kg.toFixed(2)}</span>
                    <span className="text-lg text-slate-500 font-medium">kg de CO2</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Pegada de carbono individual para esta jornada.</p>
                </div>

                <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100">
                  <p className="text-sm font-medium text-emerald-700 uppercase tracking-wider">Compensação</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-emerald-700">{result.treesNeeded.toFixed(1)}</span>
                    <span className="text-lg text-emerald-600 font-medium">árvores</span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-2">Árvores necessárias por 1 ano para neutralizar a viagem.</p>
                </div>
              </div>

              {/* Fun Comparisons */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Isso equivale a...</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/></svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{result.equivalents.smartphonesCharged.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Cargas de celular</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-1.1 0-2 .9-2 2v1h4V4c0-1.1-.9-2-2-2zM9 7v1h6V7H9zm8 3H7c-1.1 0-2 .9-2 2v7c0 1.65 1.35 3 3 3h8c1.65 0 3-1.35 3-3v-7c0-1.1-.9-2-2-2z"/></svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{result.equivalents.plasticBottles.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Garrafas plásticas (PET)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-6 text-slate-800">Como você se compara?</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={120} 
                        axisLine={false} 
                        tickLine={false} 
                        fontSize={11}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value.toFixed(2)} kg CO2`, 'Emissão']}
                      />
                      <Bar dataKey="co2" radius={[0, 4, 4, 0]} barSize={20}>
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isCurrent ? '#059669' : '#94a3b8'} 
                            fillOpacity={entry.isCurrent ? 1 : 0.4}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insights Section */}
              {aiInsights && (
                <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-emerald-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Dicas e Insights de IA</h3>
                  </div>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                    {aiInsights}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="max-w-5xl mx-auto mt-16 px-4 border-t border-slate-200 pt-8 text-center text-slate-400 text-sm">
        <p>© 2024 EcoTrip - Conscientização através da tecnologia.</p>
        <p className="mt-2">Dados baseados em fatores de emissão médios globais.</p>
      </footer>
    </div>
  );
};

export default App;
