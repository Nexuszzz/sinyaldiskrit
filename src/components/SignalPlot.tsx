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
        
        // Subplot 1: First signal x₁(n)
        allTraces.push({
            x: inputSamples.map(s => s.n),
            y: inputSamples.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: 'x₁(n)',
            marker: { color: '#3b82f6', size: 10, symbol: 'circle' },
            hovertemplate: `x₁(n)<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
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
        
        // Subplot 2: Second signal x₂(n)
        allTraces.push({
            x: secondSignal.map(s => s.n),
            y: secondSignal.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: 'x₂(n)',
            marker: { color: '#22c55e', size: 10, symbol: 'diamond' },
            hovertemplate: `x₂(n)<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x2',
            yaxis: 'y2',
        });
        secondSignal.forEach(s => {
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
        
        // Subplot 3: Output signal y(n)
        allTraces.push({
            x: outputSamples.map(s => s.n),
            y: outputSamples.map(s => s.value),
            mode: 'markers',
            type: 'scatter',
            name: 'y(n)',
            marker: { color: '#f97316', size: 10, symbol: 'square' },
            hovertemplate: `y(n)<br>n: %{x}<br>value: %{y:.3f}<extra></extra>`,
            xaxis: 'x3',
            yaxis: 'y3',
        });
        outputSamples.forEach(s => {
            allTraces.push({
                x: [s.n, s.n],
                y: [0, s.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: '#f97316', width: 2 },
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
                        title: { text: 'Arithmetic Signal Operation', font: { color: '#f1f5f9', size: 16 } },
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
                            title: 'x₁(n)',
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
                            title: 'x₂(n)',
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
                            title: 'y(n)',
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
                            { text: 'Signal Pertama x₁(n)', x: 0.5, y: 1.02, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#3b82f6', size: 12 } },
                            { text: 'Signal Kedua x₂(n)', x: 0.5, y: 0.65, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#22c55e', size: 12 } },
                            { text: 'Hasil y(n)', x: 0.5, y: 0.28, xref: 'paper', yref: 'paper', showarrow: false, font: { color: '#f97316', size: 12 } },
                        ],
                    }}
                    config={{ displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'] }}
                    style={{ width: '100%', height: '700px' }}
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
