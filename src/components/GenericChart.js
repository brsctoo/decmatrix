"use client";
import React from "react";
import style from "./GenericChart.module.css";
import { useTranslations } from 'next-intl';

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

const LABEL_MAP = {
    monthIndex: "Período",
    capitalAmount: "Montante",
    totalAmount: "Montante total",
    investedAmount: "Total investido",
    interestAmount: "Juros acumulados",
    contributionAmount: "Aportes"
};

const formatCurrency = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    });
};

function GenericChart({ 
    children,
    chartType = "area",
    data=[], 
  }) {

    const t = useTranslations('GenericChart');
    
    if (!data || data.length === 0) return null; // Se não houver dados, não renderiza o gráfico

    const isAreaChart = chartType === "area";
    const isBarChart = chartType === "bar";
    const isPieChart = chartType === "pie";
    const isLineChart = chartType === "line";

    const firstItem = data[0] || {};
    const allKeys = Object.keys(firstItem);

    const COLORS = [
        "#4f46e5", // Indigo
        "#10b981", // Emerald
        "#f59e0b", // Amber
        "#ef4444", // Red
        "#3b82f6", // Blue
        "#8b5cf6"  // Violet
    ];

    const AREA_COLORS = [
        "#0F766E", // Teal
        "#F59E0B", // Amber
        "#38BDF8", // Cyan
        "#E879F9", // Magenta
        "#F97316", // Orange
        "#94A3B8"  // Slate
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
                    name: LABEL_MAP[key] || key,
                    value: lastItem[key]
                });
            }
        }
    }

    const legendFormatter = (value) => LABEL_MAP[value] || value;
    const tooltipFormatter = (value, name) => [formatCurrency(value), legendFormatter(name)];

    return (
        <div className={style.chartContainer}>
            {isAreaChart && (
                <ResponsiveContainer width="100%" height={360}>
                    <AreaChart width={600} height={360} data={data}>
                        {/* Eixo X: Usamos o seu "xKey" (tempo/categoria) */}
                        <XAxis dataKey={xKey} />
                        <CartesianGrid strokeDasharray="5 5" />
                        <Tooltip formatter={tooltipFormatter} labelFormatter={(label) => `${LABEL_MAP[xKey] || t('periodLabel')}: ${label}`} />
                        <Legend formatter={legendFormatter} />

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
                        <Tooltip formatter={tooltipFormatter} labelFormatter={(label) => `${LABEL_MAP[xKey] || t('periodLabel')}: ${label}`} />
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
                <div style={{ width: '100%', height: 800  }}> {/* Container com altura fixa razoável */}
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 0, bottom: 20 }} // Margem para não cortar texto
                        >
                            {/* 1. Grid Suave (Só horizontal fica mais limpo) */}
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />

                            {/* 2. Eixo X (Minimalista) */}
                            <XAxis 
                               dataKey={xKey} 
    
                                // 1. Trata como régua matemática
                                type="number" 
                                
                                // 2. Ajusta o zoom automático (do menor ao maior X)
                                domain={['auto', 'auto']} 
                                
                            
                                
                                // 4. Formata para não aparecer números quebrados feios (ex: 3.000001)
                                tickFormatter={(value) => value.toFixed(1)}

                                // Estilos visuais que você já tinha
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6b7280', fontSize: 12 }} 
                                dy={10}
                            />

                            {/* 3. Eixo Y (Adicionado!) */}
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                width={40} // Espaço para os números não cortarem
                            />

                            {/* 4. Tooltip Estilizado (Fundo branco, sombra) */}
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '8px',
                                    color: '#000', 
                                    border: 'none', 
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                                }}
                                formatter={(value) => [Number(value).toFixed(2), "Y"]}
                                cursor={{ stroke: 'red', strokeWidth: 1 }} // Cria uma linha guia vermelha
                                labelFormatter={(value) => `X: ${Number(value).toFixed(2)}`} // Mostra o X formatado
                            />

                            {children}

                            <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={legendFormatter} />

                            {/* 5. Linhas de Referência (O Cruzamento Zero do Plano Cartesiano) */}
                            {/* Isso desenha a cruz preta no meio se tiver números negativos */}
                            <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
                            <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={1} />

                            {/* 6. As Linhas do Gráfico */}
                            {dataKeys.map((key, index) => (
                                <Line
                                    key={key}
                                    type="monotone"      // Deixa a curva SUAVE (Bézier)
                                    dataKey={key}
                                    name={legendFormatter(key)}
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={2}      // Linha mais grossa (mais visível)
                                    dot={false}          // REMOVE as bolinhas (poluição visual)
                                    activeDot={{ r: 8, strokeWidth: 0 }} // Bolinha só aparece quando passa o mouse
                                    animationDuration={1500} // Animação mais lenta e elegante
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
                            data={pieData}      // Usa os dados transformados do último mês
                            dataKey="value"     // Onde está o número? na chave 'value'
                            nameKey="name"      // Onde está o nome? na chave 'name'
                            cx="50%"            // Centro X
                            cy="50%"            // Centro Y
                            innerRadius={60}    // Buraco no meio (Donut)
                            outerRadius={80}
                            paddingAngle={5}
                        >
                            {/* Mapeia as cores para cada fatia */}
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={tooltipFormatter} />
                        <Legend formatter={legendFormatter} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}


export default GenericChart;