"use client";
import React from "react";
import style from "./GenericChart.module.css";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,

  LineChart,
  Line,

  AreaChart,
  Area,

  PieChart,
  Pie,
  Cell,

  Bar,
  BarChart
} from 'recharts';

const LABEL_MAP = (locale) => ({
    monthIndex: locale === 'pt' ? "Mês" : "Month",
    capitalAmount: locale === 'pt' ? "Montante" : "Capital Amount",
    totalAmount: locale === 'pt' ? "Montante total" : "Total Amount",
    investedAmount: locale === 'pt' ? "Total investido" : "Total Invested",
    interestAmount: locale === 'pt' ? "Juros acumulados" : "Accumulated Interest",
    contributionAmount: locale === 'pt' ? "Aportes" : "Contributions"
});

const formatValue = (value, locale) => {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    return value.toLocaleString(locale === 'pt' ? "pt-BR" : "en-US", {
        style: "currency",
        currency: locale === 'pt' ? "BRL" : "USD",
        minimumFractionDigits: 2
    });
};

function GenericChart({ 
    children,
    chartType = "area",
    data=[], 
  }) {

    const { locale } = useParams();

    const t = useTranslations('GenericChart');
    
    if (!data || data.length === 0) return null; // Se não houver dados, não renderiza o gráfico

    const isAreaChart = chartType === "area";
    const isBarChart = chartType === "bar";
    const isPieChart = chartType === "pie";
    const isLineChart = chartType === "line";

    const firstItem = data[0] || {};
    const allKeys = Object.keys(firstItem);

    const COLORS = [
        "#00b947", // Green primary
        "#15803d", // Dark green
        "#0f766e", // Teal
        "#f59e0b", // Amber
        "#ea580c", // Deep orange
        "#a3a3a3"  // Neutral gray
    ];

    const AREA_COLORS = [
        "#00b947", // Green primary
        "#15803d", // Dark green
        "#0f766e", // Teal
        "#f59e0b", // Amber
        "#ea580c", // Deep orange
        "#64748b"  // Slate
    ];

    
    const xKey = allKeys[0]; // Assume que a primeira chave é para o eixo X

    const dataKeys = allKeys.slice(1); // As outras chaves são para os dados Y 

    // Lógica para PIE: Pegar apenas o último dado (o valor final acumulado)
    let pieData = [];

    if (isPieChart) {
        const lastItem = data[data.length - 1]; // Pega o último mês
        const keysToIgnore = [xKey];

        for (const key in lastItem) {
            if (!keysToIgnore.includes(key) && lastItem[key] > 0) {
                pieData.push({
                    name: LABEL_MAP(locale)[key] || key,
                    value: lastItem[key]
                });
            }
        }
    }

    const legendFormatter = (value) => LABEL_MAP(locale)[value] || value;
    const tooltipFormatter = (value, name) => [formatValue(value, locale), legendFormatter(name)];

    return (
        <div className={style.chartContainer}>
            {isAreaChart && (
                <ResponsiveContainer width="100%" height={360}>
                    <AreaChart width={600} height={360} data={data}>
                        {/* Eixo X: Usamos o seu "xKey" (tempo/categoria) */}
                        <XAxis 
                            dataKey={xKey}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(148,163,184,0.4)' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(148,163,184,0.4)' }}
                            tickLine={false}
                        />
                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.25)" vertical={false} />
                        <Tooltip 
                            formatter={tooltipFormatter} 
                            labelFormatter={(label) => `${LABEL_MAP(locale)[xKey] || t('periodLabel')}: ${label}`}
                            wrapperStyle={{ userSelect: 'none' }}
                        />
                        <Legend 
                            formatter={legendFormatter}
                            wrapperStyle={{ paddingTop: 12, color: '#F7F8F8' }}
                        />

                        {/* Por mais que a data seja algo do tipo:
                        data = (
                        {monthIndex: 0, capitalAmount: 1000, contributionAmount: 0, totalAmount: 1000},
                        {monthIndex: 1, capitalAmount: 1010, contributionAmount: 100, totalAmount: 1110},
                        ...
                        ) 
                         
                        Se passarmos apenas as chaves do primeiro item do array, ele 
                        já renderiza corretamente com os outros itens*/}

                        {dataKeys.map((key, index) => (
                            <Area 
                                key={key}
                                dataKey={key}
                                name={legendFormatter(key)}
                                stroke={AREA_COLORS[index % AREA_COLORS.length]}
                                strokeWidth={3} 
                                fill={AREA_COLORS[index % AREA_COLORS.length]} 
                                fillOpacity={0.25}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            )}

            {isBarChart && (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart width={600} height={300} data={data}>
                        {/* Eixo X: Usamos o seu "xKey" (tempo/categoria) */}
                        <XAxis dataKey={xKey} />
                        <CartesianGrid strokeDasharray="5 5" />
                        <Tooltip 
                            formatter={tooltipFormatter} 
                            labelFormatter={(label) => `${LABEL_MAP[xKey] || t('periodLabel')}: ${label}`}
                            wrapperStyle={{ userSelect: 'none' }}
                        />
                        <Legend formatter={legendFormatter} />
                        {dataKeys.map((key, index) => (
                            <Bar 
                                key={key}
                                dataKey={key}
                                name={legendFormatter(key)}
                                fill={COLORS[index % COLORS.length]} // Pega a cor de acordo com o index
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            )}

            {isLineChart && (
                <div className={style.chartSize}> {/* Container com altura fixa razoável */}
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 0, bottom: 20 }} // Margem para não cortar texto
                        >
                            {/* 1. Grid Suave */}
                            <CartesianGrid 
                                strokeDasharray="4 4" 
                                vertical={false} 
                                stroke="rgba(148,163,184,0.25)" 
                            />

                            {/* 2. Eixo X */}
                            <XAxis 
                               dataKey={xKey} 
    
                                // 1. Trata como régua matemática
                                type="number" 
                                
                                // 2. Ajusta o zoom automático (do menor ao maior X)
                                domain={['auto', 'auto']} 
                                
                                // 3. Formata para não aparecer números quebrados (ex: 3.000001)
                                tickFormatter={(value) => value.toFixed(1)}

                                axisLine={{ stroke: 'rgba(148,163,184,0.4)' }} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                dy={10}
                            />

                            {/* 3. Eixo Y */}
                            <YAxis 
                                axisLine={{ stroke: 'rgba(148,163,184,0.4)' }}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                width={40} // Espaço para os números não cortarem
                            />

                            {/* 4. Tooltip */}
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#020617', 
                                    borderRadius: '8px',
                                    color: '#F7F8F8', 
                                    border: '1px solid rgba(148,163,184,0.5)', 
                                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85)' 
                                }}
                                wrapperStyle={{ userSelect: 'none' }}
                                formatter={(value) => [Number(value).toFixed(2), "Y"]}
                                cursor={{ stroke: '#00b947', strokeWidth: 1 }} // Linha guia verde
                                labelFormatter={(value) => `X: ${Number(value).toFixed(2)}`} // Mostra o X formatado
                            />

                            {children}

                            <Legend 
                                wrapperStyle={{ paddingTop: '20px', color: '#F7F8F8' }} 
                                formatter={legendFormatter} 
                            />

                            {/* 5. Linhas de Referência */}
                            {/* Cruz preta no meio se tiver números negativos */}
                            <ReferenceLine y={0} stroke="#4b5563" strokeWidth={1} />
                            <ReferenceLine x={0} stroke="#4b5563" strokeWidth={1} />

                            {/* 6. As Linhas do Gráfico */}
                            {dataKeys.map((key, index) => (
                                <Line
                                    key={key}
                                    type="monotone"  
                                    dataKey={key}
                                    name={legendFormatter(key)}
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={2}      
                                    dot={false}         
                                    activeDot={{ r: 8, strokeWidth: 0 }} // Bolinha só aparece quando passa o mouse
                                    animationDuration={1500} // Animação mais lenta 
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {isPieChart && (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}      
                            dataKey="value"     
                            nameKey="name"      
                            cx="50%"            
                            cy="50%"            
                            innerRadius={60}    
                            outerRadius={80}
                            paddingAngle={5}
                        >
                            {/* Mapeia as cores para cada fatia */}
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={tooltipFormatter} 
                            wrapperStyle={{ userSelect: 'none' }}
                        />
                        <Legend formatter={legendFormatter} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}


export default GenericChart;