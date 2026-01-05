import Plot from 'react-plotly.js';
import { SignalValue, DecompositionResult } from '../types/signal';

interface SignalPlotProps {
    inputSamples: SignalValue[];
    outputSamples: SignalValue[];
    inputLabel?: string;
    outputLabel?: string;
    showBoth?: boolean;
    decompositionResult?: DecompositionResult | null;
    secondSignal?: SignalValue[];
}

export function SignalPlot({
    inputSamples,
    outputSamples,
    inputLabel = 'x(n)',
    outputLabel = 'y(n)',
    showBoth = true,
    decompositionResult = null,
    secondSignal,
}: SignalPlotProps) {
    
    // Special rendering for arithmetic operations (3 subplots: x1, x2, y)
    if (secondSignal && secondSignal.length > 0 && outputSamples.length > 0) {
        const allTraces: any[] = [];
        
        // Filter to only show relevant data with non-zero values or within the n range
        const x1NonZero = inputSamples.filter(s => s.value !== 0);
        const x2NonZero = secondSignal.filter(s => s.value !== 0);
        const yNonZero = outputSamples.filter(s => s.value !== 0);
        
        // Determine display range from all signals
        const allNValues = [
            ...x1NonZero.map(s => s.n),
            ...x2NonZero.map(s => s.n),
            ...yNonZero.map(s => s.n),
        ];
        const displayMin = allNValues.length > 0 ? Math.min(...allNValues) - 1 : -5;
        const displayMax = allNValues.length > 0 ? Math.max(...allNValues) + 1 : 5;
        
        // Filter samples to display range
        const displayInput = inputSamples.filter(s => s.n >= displayMin && s.n <= displayMax);
        const displaySecond = secondSignal.filter(s => s.n >= displayMin && s.n <= displayMax);
        const displayOutput = outputSamples.filter(s => s.n >= displayMin && s.n <= displayMax);
        
        // Subplot 1: First signal x₁(n)
        allTraces.push({
            x: displayInput.map(s => s.n),
            y: displayInput.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: 'x₁(n)',
            marker: { color: '#3b82f6', size: 12, symbol: 'circle' },
            hovertemplate: `x₁(n)<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x',
            yaxis: 'y',
        });
        displayInput.forEach(s => {
            allTraces.push({
                x: [s.n, s.n],
                y: [0, s.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: '#3b82f6', width: 3 },
                showlegend: false,
                hoverinfo: 'skip',
                xaxis: 'x',
                yaxis: 'y',
            });
        });
        
        // Subplot 2: Second signal x₂(n)
        allTraces.push({
            x: displaySecond.map(s => s.n),
            y: displaySecond.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: 'x₂(n)',
            marker: { color: '#22c55e', size: 12, symbol: 'diamond' },
            hovertemplate: `x₂(n)<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x2',
            yaxis: 'y2',
        });
        displaySecond.forEach(s => {
            allTraces.push({
                x: [s.n, s.n],
                y: [0, s.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: '#22c55e', width: 3 },
                showlegend: false,
                hoverinfo: 'skip',
                xaxis: 'x2',
                yaxis: 'y2',
            });
        });
        
        // Subplot 3: Output signal y(n)
        allTraces.push({
            x: displayOutput.map(s => s.n),
            y: displayOutput.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: 'y(n)',
            marker: { color: '#f97316', size: 12, symbol: 'square' },
            hovertemplate: `y(n)<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x3',
            yaxis: 'y3',
        });
        displayOutput.forEach(s => {
            allTraces.push({
                x: [s.n, s.n],
                y: [0, s.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: '#f97316', width: 3 },
                showlegend: false,
                hoverinfo: 'skip',
                xaxis: 'x3',
                yaxis: 'y3',
            });
        });
        
        // Calculate max y value for proper scaling
        const allYValues = [
            ...displayInput.map(s => Math.abs(s.value)),
            ...displaySecond.map(s => Math.abs(s.value)),
            ...displayOutput.map(s => Math.abs(s.value)),
        ];
        const maxY = Math.max(...allYValues, 1) * 1.2;
        
        return (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <Plot
                    data={allTraces}
                    layout={{
                        title: { text: 'Operasi Aritmatika Signal', font: { color: '#f1f5f9', size: 18 } },
                        grid: { rows: 3, columns: 1, pattern: 'independent', roworder: 'top to bottom' },
                        xaxis: {
                            title: { text: 'n', font: { size: 12 } },
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            zerolinewidth: 2,
                            color: '#cbd5e1',
                            dtick: 1,
                            domain: [0, 1],
                            range: [displayMin - 0.5, displayMax + 0.5],
                        },
                        yaxis: {
                            title: { text: 'x₁(n)', font: { size: 14, color: '#3b82f6' } },
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            zerolinewidth: 2,
                            color: '#cbd5e1',
                            domain: [0.72, 1],
                            range: [-maxY, maxY],
                        },
                        xaxis2: {
                            title: { text: 'n', font: { size: 12 } },
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            zerolinewidth: 2,
                            color: '#cbd5e1',
                            dtick: 1,
                            domain: [0, 1],
                            anchor: 'y2',
                            range: [displayMin - 0.5, displayMax + 0.5],
                        },
                        yaxis2: {
                            title: { text: 'x₂(n)', font: { size: 14, color: '#22c55e' } },
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            zerolinewidth: 2,
                            color: '#cbd5e1',
                            domain: [0.38, 0.66],
                            anchor: 'x2',
                            range: [-maxY, maxY],
                        },
                        xaxis3: {
                            title: { text: 'n', font: { size: 12 } },
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            zerolinewidth: 2,
                            color: '#cbd5e1',
                            dtick: 1,
                            domain: [0, 1],
                            anchor: 'y3',
                            range: [displayMin - 0.5, displayMax + 0.5],
                        },
                        yaxis3: {
                            title: { text: 'y(n)', font: { size: 14, color: '#f97316' } },
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            zerolinewidth: 2,
                            color: '#cbd5e1',
                            domain: [0, 0.28],
                            anchor: 'x3',
                        },
                        plot_bgcolor: '#1e293b',
                        paper_bgcolor: '#1e293b',
                        font: { family: 'Inter, sans-serif' },
                        legend: { font: { color: '#cbd5e1', size: 12 }, bgcolor: 'rgba(30, 41, 59, 0.9)', x: 1.02, y: 1, bordercolor: '#475569', borderwidth: 1 },
                        margin: { l: 70, r: 100, t: 60, b: 50 },
                        hovermode: 'closest',
                        annotations: [
                            { text: '📊 Signal Pertama', x: 0.02, y: 0.98, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#3b82f6', size: 13 }, xanchor: 'left' },
                            { text: '📊 Signal Kedua', x: 0.02, y: 0.64, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#22c55e', size: 13 }, xanchor: 'left' },
                            { text: '📈 Hasil Operasi', x: 0.02, y: 0.26, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#f97316', size: 13 }, xanchor: 'left' },
                        ],
                    }}
                    config={{ displayModeBar: true, displaylogo: false, responsive: true, modeBarButtonsToRemove: ['lasso2d', 'select2d'] }}
                    style={{ width: '100%', height: '750px' }}
                />
            </div>
        );
    }
    
    // Special rendering for decomposition (3 subplots)
    if (decompositionResult) {
        const { even, odd } = decompositionResult;
        const allTraces: any[] = [];
        
        // Subplot 1: Original signal x(n)
        allTraces.push({
            x: inputSamples.map(s => s.n),
            y: inputSamples.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: 'x(n)',
            marker: { color: '#3b82f6', size: 10, symbol: 'circle' },
            hovertemplate: `x(n)<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x',
            yaxis: 'y',
        });
        inputSamples.forEach(s => {
            allTraces.push({
                x: [s.n, s.n],
                y: [0, s.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: '#3b82f6', width: 2 },
                showlegend: false,
                hoverinfo: 'skip',
                xaxis: 'x',
                yaxis: 'y',
            });
        });
        
        // Subplot 2: Even component xe(n)
        allTraces.push({
            x: even.map(s => s.n),
            y: even.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: 'xₑ(n)',
            marker: { color: '#22c55e', size: 10, symbol: 'diamond' },
            hovertemplate: `xₑ(n)<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x2',
            yaxis: 'y2',
        });
        even.forEach(s => {
            allTraces.push({
                x: [s.n, s.n],
                y: [0, s.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: '#22c55e', width: 2 },
                showlegend: false,
                hoverinfo: 'skip',
                xaxis: 'x2',
                yaxis: 'y2',
            });
        });
        
        // Subplot 3: Odd component xo(n)
        allTraces.push({
            x: odd.map(s => s.n),
            y: odd.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: 'xₒ(n)',
            marker: { color: '#a855f7', size: 10, symbol: 'square' },
            hovertemplate: `xₒ(n)<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x3',
            yaxis: 'y3',
        });
        odd.forEach(s => {
            allTraces.push({
                x: [s.n, s.n],
                y: [0, s.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: '#a855f7', width: 2 },
                showlegend: false,
                hoverinfo: 'skip',
                xaxis: 'x3',
                yaxis: 'y3',
            });
        });
        
        return (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <Plot
                    data={allTraces}
                    layout={{
                        title: { text: 'Even/Odd Signal Decomposition', font: { color: '#f1f5f9', size: 16 } },
                        grid: { rows: 3, columns: 1, pattern: 'independent', roworder: 'top to bottom' },
                        xaxis: {
                            title: 'n',
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            dtick: 1,
                            domain: [0, 1],
                        },
                        yaxis: {
                            title: 'x(n)',
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            domain: [0.7, 1],
                        },
                        xaxis2: {
                            title: 'n',
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            dtick: 1,
                            domain: [0, 1],
                            anchor: 'y2',
                        },
                        yaxis2: {
                            title: 'xₑ(n)',
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            domain: [0.37, 0.63],
                            anchor: 'x2',
                        },
                        xaxis3: {
                            title: 'n',
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            dtick: 1,
                            domain: [0, 1],
                            anchor: 'y3',
                        },
                        yaxis3: {
                            title: 'xₒ(n)',
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            domain: [0, 0.26],
                            anchor: 'x3',
                        },
                        plot_bgcolor: '#1e293b',
                        paper_bgcolor: '#1e293b',
                        font: { family: 'Inter, sans-serif' },
                        legend: { font: { color: '#cbd5e1' }, bgcolor: 'rgba(30, 41, 59, 0.8)', x: 1, y: 1 },
                        margin: { l: 60, r: 40, t: 60, b: 60 },
                        hovermode: 'closest',
                        annotations: [
                            { text: 'Signal Asli x(n)', x: 0.5, y: 1.02, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#3b82f6', size: 12 } },
                            { text: 'Komponen Genap xₑ(n) = [x(n)+x(-n)]/2', x: 0.5, y: 0.65, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#22c55e', size: 12 } },
                            { text: 'Komponen Ganjil xₒ(n) = [x(n)-x(-n)]/2', x: 0.5, y: 0.28, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#a855f7', size: 12 } },
                        ],
                    }}
                    config={{ displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'] }}
                    style={{ width: '100%', height: '700px' }}
                />
            </div>
        );
    }
    
    // If showing both, use subplots for clarity
    if (showBoth && outputSamples.length > 0) {
        // Create traces for subplot 1 (input signal)
        const inputTraces: any[] = [];
        
        // Main input scatter
        inputTraces.push({
            x: inputSamples.map(s => s.n),
            y: inputSamples.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: inputLabel,
            marker: { color: '#3b82f6', size: 10, symbol: 'circle' },
            hovertemplate: `${inputLabel}<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x',
            yaxis: 'y',
        });
        
        // Stems for input
        inputSamples.forEach(s => {
            inputTraces.push({
                x: [s.n, s.n],
                y: [0, s.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: '#3b82f6', width: 2 },
                showlegend: false,
                hoverinfo: 'skip',
                xaxis: 'x',
                yaxis: 'y',
            });
        });
        
        // Create traces for subplot 2 (output signal)
        const outputTraces: any[] = [];
        
        // Main output scatter
        outputTraces.push({
            x: outputSamples.map(s => s.n),
            y: outputSamples.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: outputLabel,
            marker: { color: '#f97316', size: 10, symbol: 'diamond' },
            hovertemplate: `${outputLabel}<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x2',
            yaxis: 'y2',
        });
        
        // Stems for output
        outputSamples.forEach(s => {
            outputTraces.push({
                x: [s.n, s.n],
                y: [0, s.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: '#f97316', width: 2 },
                showlegend: false,
                hoverinfo: 'skip',
                xaxis: 'x2',
                yaxis: 'y2',
            });
        });
        
        const allTraces = [...inputTraces, ...outputTraces];
        
        return (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <Plot
                    data={allTraces}
                    layout={{
                        title: { text: 'Signal Transformation', font: { color: '#f1f5f9', size: 16 } },
                        grid: { rows: 2, columns: 1, pattern: 'independent', roworder: 'top to bottom' },
                        xaxis: {
                            title: 'n',
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            dtick: 1,
                            domain: [0, 1],
                        },
                        yaxis: {
                            title: inputLabel,
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            domain: [0.55, 1],
                        },
                        xaxis2: {
                            title: 'n',
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            dtick: 1,
                            domain: [0, 1],
                            anchor: 'y2',
                        },
                        yaxis2: {
                            title: outputLabel,
                            gridcolor: '#334155',
                            zerolinecolor: '#64748b',
                            color: '#cbd5e1',
                            domain: [0, 0.42],
                            anchor: 'x2',
                        },
                        plot_bgcolor: '#1e293b',
                        paper_bgcolor: '#1e293b',
                        font: { family: 'Inter, sans-serif' },
                        legend: { font: { color: '#cbd5e1' }, bgcolor: 'rgba(30, 41, 59, 0.8)', x: 1, y: 1 },
                        margin: { l: 60, r: 40, t: 60, b: 60 },
                        hovermode: 'closest',
                        annotations: [
                            { text: `Signal Asli ${inputLabel}`, x: 0.5, y: 1.02, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#3b82f6', size: 14 } },
                            { text: `Hasil Transformasi ${outputLabel}`, x: 0.5, y: 0.45, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#f97316', size: 14 } },
                        ],
                    }}
                    config={{ displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'] }}
                    style={{ width: '100%', height: '600px' }}
                />
            </div>
        );
    }
    
    // Single plot mode (no transformation or showBoth=false)
    const traces: any[] = [];
    const samples = outputSamples.length > 0 ? outputSamples : inputSamples;
    const label = outputSamples.length > 0 ? outputLabel : inputLabel;
    const color = outputSamples.length > 0 ? '#f97316' : '#3b82f6';

    traces.push({
        x: samples.map(s => s.n),
        y: samples.map(s => s.value),
        mode: 'markers',
        type: 'scatter',
        name: label,
        marker: { color, size: 10, symbol: 'circle' },
        hovertemplate: `${label}<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
    });

    // Add vertical stems
    samples.forEach(s => {
        traces.push({
            x: [s.n, s.n],
            y: [0, s.value],
            mode: 'lines',
            type: 'scatter',
            line: { color, width: 2 },
            showlegend: false,
            hoverinfo: 'skip',
        });
    });

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <Plot
                data={traces}
                layout={{
                    title: { text: 'Discrete-Time Signal Plot', font: { color: '#f1f5f9', size: 16 } },
                    xaxis: {
                        title: 'n (sample index)',
                        gridcolor: '#334155',
                        zerolinecolor: '#64748b',
                        color: '#cbd5e1',
                        dtick: 1,
                    },
                    yaxis: {
                        title: 'Signal Value',
                        gridcolor: '#334155',
                        zerolinecolor: '#64748b',
                        color: '#cbd5e1',
                    },
                    plot_bgcolor: '#1e293b',
                    paper_bgcolor: '#1e293b',
                    font: { family: 'Inter, sans-serif' },
                    legend: { font: { color: '#cbd5e1' }, bgcolor: 'rgba(30, 41, 59, 0.8)' },
                    margin: { l: 60, r: 40, t: 60, b: 60 },
                    hovermode: 'closest',
                }}
                config={{ displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'] }}
                style={{ width: '100%', height: '500px' }}
            />
        </div>
    );
}
