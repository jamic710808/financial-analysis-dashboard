// ---------------- Page 5: 獲利能力分析 ----------------
function renderProfitability() {
    const lastIdx = State.metrics.revenue.length - 1;
    if (lastIdx < 0) return;

    const opMargin = (State.metrics.operatingIncome[lastIdx] / State.metrics.revenue[lastIdx]) * 100;
    const prevOpMargin = lastIdx > 0 ? (State.metrics.operatingIncome[lastIdx - 1] / State.metrics.revenue[lastIdx - 1]) * 100 : opMargin;

    const gpMargin = (State.metrics.grossProfit[lastIdx] / State.metrics.revenue[lastIdx]) * 100;
    const prevGpMargin = lastIdx > 0 ? (State.metrics.grossProfit[lastIdx - 1] / State.metrics.revenue[lastIdx - 1]) * 100 : gpMargin;

    // Cost to Income Ratio (CIR)
    const cir = (State.metrics.operatingExpense[lastIdx] / State.metrics.grossProfit[lastIdx]) * 100;
    const prevCir = lastIdx > 0 ? (State.metrics.operatingExpense[lastIdx - 1] / State.metrics.grossProfit[lastIdx - 1]) * 100 : cir;

    // Effective Tax Rate
    const taxRate = (State.metrics.tax[lastIdx] / State.metrics.operatingIncome[lastIdx]) * 100;

    const svgPercent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>`;

    document.getElementById('profit-kpis').innerHTML = `
        ${createKPICard('毛利率', formatPercent(gpMargin / 100), (gpMargin - prevGpMargin).toFixed(1), gpMargin >= prevGpMargin, svgPercent)}
        ${createKPICard('營業利益率', formatPercent(opMargin / 100), (opMargin - prevOpMargin).toFixed(1), opMargin >= prevOpMargin, svgPercent)}
        ${createKPICard('費用佔毛利比 (CIR)', formatPercent(cir / 100), (cir - prevCir).toFixed(1), cir <= prevCir, svgPercent)}
        ${createKPICard('有效稅率', formatPercent(taxRate / 100), 0, true, svgPercent)}
    `;

    if (charts.profitTrend) charts.profitTrend.destroy();
    charts.profitTrend = new Chart(document.getElementById('profitTrendChart'), {
        type: 'bar',
        data: {
            labels: State.months,
            datasets: [
                {
                    type: 'line',
                    label: '毛利',
                    data: State.metrics.grossProfit,
                    borderColor: '#10b981',
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    type: 'line',
                    label: '營業利益',
                    data: State.metrics.operatingIncome,
                    borderColor: '#8b5cf6',
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    type: 'bar',
                    label: '營業收入',
                    data: State.metrics.revenue,
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    borderColor: '#06b6d4',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: '#f8fafc' } },
                datalabels: { display: false }
            }
        }
    });

    if (charts.profitRadar) charts.profitRadar.destroy();
    charts.profitRadar = new Chart(document.getElementById('profitRadarChart'), {
        type: 'radar',
        data: {
            labels: ['毛利率', '營業利益率', '淨利率', 'ROA', 'ROE'],
            datasets: [{
                label: '本企業 (最新)',
                data: [
                    gpMargin,
                    opMargin,
                    (State.metrics.netIncome[lastIdx] / State.metrics.revenue[lastIdx]) * 100,
                    (State.metrics.netIncome[lastIdx] / State.metrics.assets[lastIdx]) * 100 * 12, // Annualized roughly
                    (State.metrics.netIncome[lastIdx] / State.metrics.equity[lastIdx]) * 100 * 12
                ],
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                borderColor: '#06b6d4',
                pointBackgroundColor: '#06b6d4'
            },
            {
                label: '產業平均 (模擬)',
                data: [
                    gpMargin * 0.9,
                    opMargin * 0.85,
                    ((State.metrics.netIncome[lastIdx] / State.metrics.revenue[lastIdx]) * 100) * 0.9,
                    ((State.metrics.netIncome[lastIdx] / State.metrics.assets[lastIdx]) * 100 * 12) * 1.1,
                    ((State.metrics.netIncome[lastIdx] / State.metrics.equity[lastIdx]) * 100 * 12) * 1.05
                ],
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderColor: '#8b5cf6',
                pointBackgroundColor: '#8b5cf6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#f8fafc', font: { size: 12 } },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { color: '#f8fafc' } },
                datalabels: { display: false }
            }
        }
    });
}

// ---------------- Page 6: 營運與流動性 ----------------
function renderLiquidity() {
    const lastIdx = State.metrics.revenue.length - 1;
    if (lastIdx < 0) return;

    const currentRatio = State.metrics.currentAssets[lastIdx] / State.metrics.currentLiabilities[lastIdx];
    const prevCR = lastIdx > 0 ? State.metrics.currentAssets[lastIdx - 1] / State.metrics.currentLiabilities[lastIdx - 1] : currentRatio;

    const quickRatio = (State.metrics.currentAssets[lastIdx] - State.metrics.inventory[lastIdx]) / State.metrics.currentLiabilities[lastIdx];
    const prevQR = lastIdx > 0 ? (State.metrics.currentAssets[lastIdx - 1] - State.metrics.inventory[lastIdx - 1]) / State.metrics.currentLiabilities[lastIdx - 1] : quickRatio;

    const cashRatio = State.metrics.cash[lastIdx] / State.metrics.currentLiabilities[lastIdx];
    const prevCashR = lastIdx > 0 ? State.metrics.cash[lastIdx - 1] / State.metrics.currentLiabilities[lastIdx - 1] : cashRatio;

    const wc = State.metrics.currentAssets[lastIdx] - State.metrics.currentLiabilities[lastIdx];
    const prevWC = lastIdx > 0 ? State.metrics.currentAssets[lastIdx - 1] - State.metrics.currentLiabilities[lastIdx - 1] : wc;
    const wcChange = prevWC ? ((wc - prevWC) / prevWC * 100).toFixed(1) : 0;

    const svgDrop = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;

    document.getElementById('liq-kpis').innerHTML = `
        ${createKPICard('流動比率', currentRatio.toFixed(2), ((currentRatio - prevCR) * 100).toFixed(1), currentRatio >= prevCR, svgDrop)}
        ${createKPICard('速動比率', quickRatio.toFixed(2), ((quickRatio - prevQR) * 100).toFixed(1), quickRatio >= prevQR, svgDrop)}
        ${createKPICard('現金比率', cashRatio.toFixed(2), ((cashRatio - prevCashR) * 100).toFixed(1), cashRatio >= prevCashR, svgDrop)}
        ${createKPICard('營運資本', formatCurrency(wc), wcChange, wcChange >= 0, svgDrop)}
    `;

    if (charts.liqRatio) charts.liqRatio.destroy();
    charts.liqRatio = new Chart(document.getElementById('liqRatioChart'), {
        type: 'line',
        data: {
            labels: State.months,
            datasets: [
                {
                    label: '流動比率',
                    data: State.metrics.currentAssets.map((v, i) => v / State.metrics.currentLiabilities[i]),
                    borderColor: '#06b6d4',
                    tension: 0.3
                },
                {
                    label: '速動比率',
                    data: State.metrics.currentAssets.map((v, i) => (v - State.metrics.inventory[i]) / State.metrics.currentLiabilities[i]),
                    borderColor: '#8b5cf6',
                    tension: 0.3
                },
                {
                    label: '現金比率',
                    data: State.metrics.cash.map((v, i) => v / State.metrics.currentLiabilities[i]),
                    borderColor: '#10b981',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: '#f8fafc' } },
                datalabels: { display: false }
            }
        }
    });

    if (charts.liqWC) charts.liqWC.destroy();
    charts.liqWC = new Chart(document.getElementById('liqWorkingCapitalChart'), {
        type: 'bar',
        data: {
            labels: State.months,
            datasets: [{
                label: '營運資本 (Current Assets - Current Liabilities)',
                data: State.metrics.currentAssets.map((v, i) => v - State.metrics.currentLiabilities[i]),
                backgroundColor: 'rgba(6, 182, 212, 0.4)',
                borderColor: '#06b6d4',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: false }
            }
        }
    });
}

// ---------------- Page 7: 杜邦分析 ----------------
function renderDuPont() {
    const lastIdx = State.metrics.revenue.length - 1;
    if (lastIdx < 0) return;

    // DuPont Metrics (Annualized for proper interpretation, but we show monthly trend here)
    const roe = (State.metrics.netIncome[lastIdx] / State.metrics.equity[lastIdx]) * 100;
    const prevRoe = lastIdx > 0 ? (State.metrics.netIncome[lastIdx - 1] / State.metrics.equity[lastIdx - 1]) * 100 : roe;

    const netMargin = (State.metrics.netIncome[lastIdx] / State.metrics.revenue[lastIdx]) * 100;
    const assetTurnover = State.metrics.revenue[lastIdx] / State.metrics.assets[lastIdx];
    const equityMultiplier = State.metrics.assets[lastIdx] / State.metrics.equity[lastIdx];

    const svgNetwork = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;

    document.getElementById('dupont-kpis').innerHTML = `
        ${createKPICard('ROE (淨資產收益率)', formatPercent(roe / 100), ((roe - prevRoe) / Math.abs(prevRoe) * 100).toFixed(1), roe >= prevRoe, svgNetwork)}
        ${createKPICard('杜邦組件 1: 淨利率', formatPercent(netMargin / 100), 0, true, svgNetwork)}
        ${createKPICard('杜邦組件 2: 總資產周轉率', assetTurnover.toFixed(3), 0, true, svgNetwork)}
        ${createKPICard('杜邦組件 3: 權益乘數', equityMultiplier.toFixed(3), 0, true, svgNetwork)}
    `;

    // Trend Chart with multiple axes
    if (charts.dupontTrend) charts.dupontTrend.destroy();
    charts.dupontTrend = new Chart(document.getElementById('dupontTrendChart'), {
        type: 'line',
        data: {
            labels: State.months,
            datasets: [
                {
                    label: 'ROE (%)',
                    data: State.metrics.netIncome.map((v, i) => (v / State.metrics.equity[i]) * 100),
                    borderColor: '#06b6d4',
                    borderWidth: 3,
                    yAxisID: 'y1'
                },
                {
                    label: '淨利率 (%)',
                    data: State.metrics.netIncome.map((v, i) => (v / State.metrics.revenue[i]) * 100),
                    borderColor: '#10b981',
                    borderDash: [5, 5],
                    yAxisID: 'y1'
                },
                {
                    label: '資產周轉率 (倍)',
                    data: State.metrics.revenue.map((v, i) => v / State.metrics.assets[i]),
                    borderColor: '#f59e0b',
                    yAxisID: 'y2'
                },
                {
                    label: '權益乘數 (倍)',
                    data: State.metrics.assets.map((v, i) => v / State.metrics.equity[i]),
                    borderColor: '#8b5cf6',
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: '百分比 (%)', color: '#94a3b8' }
                },
                y2: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: '倍數 (x)', color: '#94a3b8' },
                    grid: { drawOnChartArea: false }
                }
            },
            plugins: {
                legend: { position: 'top', labels: { color: '#f8fafc' } },
                datalabels: { display: false }
            }
        }
    });
}

// ---------------- Page 8: Z-Score 預警 ----------------
function renderZScore() {
    const lastIdx = State.metrics.revenue.length - 1;
    if (lastIdx < 0) return;

    // Simple Z-Score Approximation
    // Z = 1.2*T1 + 1.4*T2 + 3.3*T3 + 0.6*T4 + 1.0*T5
    // T1 = Working Capital / Total Assets
    // T2 = Retained Earnings / Total Assets (Simulated as Equity*0.5 / Assets)
    // T3 = EBIT / Total Assets
    // T4 = Equity / Total Liabilities
    // T5 = Sales / Total Assets

    const zScores = State.months.map((_, i) => {
        const t1 = (State.metrics.currentAssets[i] - State.metrics.currentLiabilities[i]) / State.metrics.assets[i];
        const t2 = (State.metrics.equity[i] * 0.5) / State.metrics.assets[i];
        const t3 = State.metrics.operatingIncome[i] / State.metrics.assets[i];
        const t4 = State.metrics.equity[i] / State.metrics.liabilities[i];
        const t5 = State.metrics.revenue[i] / State.metrics.assets[i];
        return (1.2 * t1 + 1.4 * t2 + 3.3 * t3 + 0.6 * t4 + 1.0 * t5).toFixed(2);
    });

    const currZ = parseFloat(zScores[lastIdx]);
    const prevZ = lastIdx > 0 ? parseFloat(zScores[lastIdx - 1]) : currZ;

    let statusText = '安全區間';
    let statusColor = '#10b981';
    if (currZ < 1.8) {
        statusText = '破產風險區';
        statusColor = '#f43f5e';
    } else if (currZ < 2.9) {
        statusText = '灰色警戒區';
        statusColor = '#f59e0b';
    }

    const svgAlert = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

    document.getElementById('zscore-kpis').innerHTML = `
        ${createKPICard('最新 Z-Score', currZ, ((currZ - prevZ) / Math.abs(prevZ) * 100).toFixed(1), currZ >= prevZ, svgAlert)}
        
        <div class="glass-panel kpi-card" style="border-bottom: 4px solid ${statusColor}">
            <div class="kpi-header">
                <span>風險狀態評估</span>
                <div class="kpi-icon" style="color:${statusColor}">${svgAlert}</div>
            </div>
            <div class="kpi-value" style="color:${statusColor}">${statusText}</div>
            <div class="kpi-change">Z-Score 臨界點: 1.8 與 2.9</div>
        </div>

        ${createKPICard('營運資金/總資產 (T1)', ((State.metrics.currentAssets[lastIdx] - State.metrics.currentLiabilities[lastIdx]) / State.metrics.assets[lastIdx]).toFixed(3), 0, true, svgAlert)}
        ${createKPICard('資產周轉率 (T5)', (State.metrics.revenue[lastIdx] / State.metrics.assets[lastIdx]).toFixed(3), 0, true, svgAlert)}
    `;

    if (charts.zscoreTrend) charts.zscoreTrend.destroy();
    charts.zscoreTrend = new Chart(document.getElementById('zscoreTrendChart'), {
        type: 'line',
        data: {
            labels: State.months,
            datasets: [
                {
                    label: 'Z-Score',
                    data: zScores,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: '#f8fafc' } },
                datalabels: { display: false },
                // Custom plugin drawing horizontal lines for zones
            }
        },
        plugins: [{
            id: 'zscoreZones',
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                const xAxis = chart.scales.x;
                const yAxis = chart.scales.y;

                // Safe Zone > 2.9
                let ySafe = yAxis.getPixelForValue(2.9);
                // Distress Zone < 1.8
                let yDistress = yAxis.getPixelForValue(1.8);

                ctx.save();

                // Draw 2.9 line (Safe boundary)
                if (ySafe >= yAxis.top && ySafe <= yAxis.bottom) {
                    ctx.beginPath();
                    ctx.moveTo(xAxis.left, ySafe);
                    ctx.lineTo(xAxis.right, ySafe);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#10b981'; // Green
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                }

                // Draw 1.8 line (Distress boundary)
                if (yDistress >= yAxis.top && yDistress <= yAxis.bottom) {
                    ctx.beginPath();
                    ctx.moveTo(xAxis.left, yDistress);
                    ctx.lineTo(xAxis.right, yDistress);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#f43f5e'; // Red
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                }

                ctx.restore();
            }
        }]
    });
}
