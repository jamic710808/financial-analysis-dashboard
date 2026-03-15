// Shared Chart configuration
Chart.defaults.color = '#94a3b8';
Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.05)';
Chart.defaults.font.family = "'Segoe UI', Tahoma, sans-serif";
Chart.register(ChartDataLabels);

let charts = {}; // Store chart instances to destroy them before re-rendering

function createKPICard(title, value, change, isPositive, iconSvg) {
    const changeClass = isPositive ? 'positive' : 'negative';
    const changeIcon = isPositive ? '↑' : '↓';
    return `
        <div class="glass-panel kpi-card">
            <div class="kpi-header">
                <span>${title}</span>
                <div class="kpi-icon">${iconSvg}</div>
            </div>
            <div class="kpi-value">${value}</div>
            <div class="kpi-change ${changeClass}">
                ${changeIcon} ${Math.abs(change)}% 較上期
            </div>
        </div>
    `;
}

// ---------------- Page 1: 財務總覽 ----------------
function renderOverview() {
    const lastIdx = State.metrics.revenue.length - 1;
    if (lastIdx < 0) return;

    const rev = State.metrics.revenue[lastIdx];
    const prevRev = lastIdx > 0 ? State.metrics.revenue[lastIdx - 1] : rev;
    const revChange = prevRev ? ((rev - prevRev) / prevRev * 100).toFixed(1) : 0;

    const opI = State.metrics.operatingIncome[lastIdx];
    const prevOpI = lastIdx > 0 ? State.metrics.operatingIncome[lastIdx - 1] : opI;
    const opIChange = prevOpI ? ((opI - prevOpI) / prevOpI * 100).toFixed(1) : 0;

    const ni = State.metrics.netIncome[lastIdx];
    const prevNi = lastIdx > 0 ? State.metrics.netIncome[lastIdx - 1] : ni;
    const niChange = prevNi ? ((ni - prevNi) / prevNi * 100).toFixed(1) : 0;

    const assets = State.metrics.assets[lastIdx];
    const prevAssets = lastIdx > 0 ? State.metrics.assets[lastIdx - 1] : assets;
    const assetsChange = prevAssets ? ((assets - prevAssets) / prevAssets * 100).toFixed(1) : 0;

    const svgMoney = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;
    const svgChart = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
    const svgPie = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>`;
    const svgBriefcase = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;

    document.getElementById('overview-kpis').innerHTML = `
        ${createKPICard('本月營業收入', formatCurrency(rev), revChange, revChange >= 0, svgMoney)}
        ${createKPICard('本月營業利益', formatCurrency(opI), opIChange, opIChange >= 0, svgChart)}
        ${createKPICard('本月淨利潤', formatCurrency(ni), niChange, niChange >= 0, svgPie)}
        ${createKPICard('期末總資產', formatCurrency(assets), assetsChange, assetsChange >= 0, svgBriefcase)}
    `;

    if (charts.overviewTrend) charts.overviewTrend.destroy();
    charts.overviewTrend = new Chart(document.getElementById('overviewTrendChart'), {
        type: 'line',
        data: {
            labels: State.months,
            datasets: [
                {
                    label: '營業收入',
                    data: State.metrics.revenue,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: '淨利潤',
                    data: State.metrics.netIncome,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: '#f8fafc' } },
                datalabels: { display: false }
            },
            interaction: { mode: 'index', intersect: false }
        }
    });

    if (charts.overviewStructure) charts.overviewStructure.destroy();
    charts.overviewStructure = new Chart(document.getElementById('overviewStructureChart'), {
        type: 'doughnut',
        data: {
            labels: ['營業成本', '營業費用', '稅捐', '淨利潤'],
            datasets: [{
                data: [
                    State.metrics.cost[lastIdx],
                    State.metrics.operatingExpense[lastIdx],
                    State.metrics.tax[lastIdx],
                    State.metrics.netIncome[lastIdx]
                ],
                backgroundColor: ['#f43f5e', '#f59e0b', '#64748b', '#10b981'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { color: '#f8fafc' } },
                datalabels: {
                    color: '#fff',
                    formatter: (value, ctx) => {
                        let sum = ctx.chart._metasets[ctx.datasetIndex].total;
                        let percentage = (value * 100 / sum).toFixed(1) + "%";
                        return percentage;
                    }
                }
            }
        }
    });
}

// ---------------- Page 2: 資產負債表 ----------------
function renderBalanceSheet() {
    const lastIdx = State.metrics.assets.length - 1;
    if (lastIdx < 0) return;

    const currentAssets = State.metrics.currentAssets[lastIdx];
    const prevCA = lastIdx > 0 ? State.metrics.currentAssets[lastIdx - 1] : currentAssets;
    const caChange = prevCA ? ((currentAssets - prevCA) / prevCA * 100).toFixed(1) : 0;

    const inv = State.metrics.inventory[lastIdx];
    const prevInv = lastIdx > 0 ? State.metrics.inventory[lastIdx - 1] : inv;
    const invChange = prevInv ? ((inv - prevInv) / prevInv * 100).toFixed(1) : 0;

    const cash = State.metrics.cash[lastIdx];
    const prevCash = lastIdx > 0 ? State.metrics.cash[lastIdx - 1] : cash;
    const cashChange = prevCash ? ((cash - prevCash) / prevCash * 100).toFixed(1) : 0;

    const liab = State.metrics.liabilities[lastIdx];
    const prevLiab = lastIdx > 0 ? State.metrics.liabilities[lastIdx - 1] : liab;
    const liabChange = prevLiab ? ((liab - prevLiab) / prevLiab * 100).toFixed(1) : 0;

    const svgCA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
    const svgBox = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>`;
    const svgCash = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle></svg>`;
    const svgDebt = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`; // Negative representation usually

    document.getElementById('bs-kpis').innerHTML = `
        ${createKPICard('流動資產', formatCurrency(currentAssets), caChange, caChange >= 0, svgCA)}
        ${createKPICard('存貨', formatCurrency(inv), invChange, invChange <= 0, svgBox)}
        ${createKPICard('現金及約當現金', formatCurrency(cash), cashChange, cashChange >= 0, svgCash)}
        ${createKPICard('總負債', formatCurrency(liab), liabChange, liabChange <= 0, svgDebt)}
    `;

    if (charts.bsStructure) charts.bsStructure.destroy();
    charts.bsStructure = new Chart(document.getElementById('bsStructureChart'), {
        type: 'bar',
        data: {
            labels: State.months,
            datasets: [
                {
                    label: '流動負債',
                    data: State.metrics.currentLiabilities,
                    backgroundColor: '#f43f5e',
                    stack: 'LiabilitiesEquity'
                },
                {
                    label: '長期負債',
                    data: State.metrics.liabilities.map((v, i) => v - State.metrics.currentLiabilities[i]),
                    backgroundColor: '#fb7185',
                    stack: 'LiabilitiesEquity'
                },
                {
                    label: '所有者權益',
                    data: State.metrics.equity,
                    backgroundColor: '#8b5cf6',
                    stack: 'LiabilitiesEquity'
                },
                {
                    label: '流動資產',
                    data: State.metrics.currentAssets,
                    backgroundColor: '#06b6d4',
                    stack: 'Assets'
                },
                {
                    label: '非流動資產',
                    data: State.metrics.assets.map((v, i) => v - State.metrics.currentAssets[i]),
                    backgroundColor: '#38bdf8',
                    stack: 'Assets'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            },
            plugins: {
                legend: { position: 'top', labels: { color: '#f8fafc' } },
                datalabels: { display: false }
            }
        }
    });

    if (charts.bsDoughnut) charts.bsDoughnut.destroy();
    charts.bsDoughnut = new Chart(document.getElementById('bsDoughnutChart'), {
        type: 'pie',
        data: {
            labels: ['流動資產', '非流動資產'],
            datasets: [{
                data: [
                    State.metrics.currentAssets[lastIdx],
                    State.metrics.assets[lastIdx] - State.metrics.currentAssets[lastIdx]
                ],
                backgroundColor: ['#06b6d4', '#38bdf8'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#f8fafc' } },
                datalabels: {
                    color: '#fff',
                    formatter: (value, ctx) => {
                        let sum = ctx.chart._metasets[ctx.datasetIndex].total;
                        return (value * 100 / sum).toFixed(1) + "%";
                    }
                }
            }
        }
    });
}

// ---------------- Page 3: 綜合損益表 ----------------
function renderIncomeStatement() {
    const lastIdx = State.metrics.revenue.length - 1;
    if (lastIdx < 0) return;

    // Gross Margin, Op Margin, Net Margin
    const gpMargin = (State.metrics.grossProfit[lastIdx] / State.metrics.revenue[lastIdx]) * 100;
    const prevGpMargin = lastIdx > 0 ? (State.metrics.grossProfit[lastIdx - 1] / State.metrics.revenue[lastIdx - 1]) * 100 : gpMargin;

    const opMargin = (State.metrics.operatingIncome[lastIdx] / State.metrics.revenue[lastIdx]) * 100;
    const prevOpMargin = lastIdx > 0 ? (State.metrics.operatingIncome[lastIdx - 1] / State.metrics.revenue[lastIdx - 1]) * 100 : opMargin;

    const netMargin = (State.metrics.netIncome[lastIdx] / State.metrics.revenue[lastIdx]) * 100;
    const prevNetMargin = lastIdx > 0 ? (State.metrics.netIncome[lastIdx - 1] / State.metrics.revenue[lastIdx - 1]) * 100 : netMargin;

    // YTD Revenue
    const ytdRev = State.metrics.revenue.reduce((a, b) => a + b, 0);

    const svgMargin = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;

    document.getElementById('is-kpis').innerHTML = `
        ${createKPICard('毛利率', formatPercent(gpMargin / 100), (gpMargin - prevGpMargin).toFixed(1), gpMargin >= prevGpMargin, svgMargin)}
        ${createKPICard('營業利益率', formatPercent(opMargin / 100), (opMargin - prevOpMargin).toFixed(1), opMargin >= prevOpMargin, svgMargin)}
        ${createKPICard('淨利率', formatPercent(netMargin / 100), (netMargin - prevNetMargin).toFixed(1), netMargin >= prevNetMargin, svgMargin)}
        ${createKPICard('YTD 總營收', formatCurrency(ytdRev), 0, true, svgMargin)}
    `;

    // Waterfall Chart (Simulated with Bar using floating data format [start, end])
    const rev = State.metrics.revenue[lastIdx];
    const cogs = State.metrics.cost[lastIdx];
    const gp = State.metrics.grossProfit[lastIdx];
    const opex = State.metrics.operatingExpense[lastIdx];
    const opi = State.metrics.operatingIncome[lastIdx];
    const tax = State.metrics.tax[lastIdx];
    const ni = State.metrics.netIncome[lastIdx];

    const waterfallData = [
        [0, rev],                 // Revenue
        [rev - cogs, rev],        // COGS (Negative flow, so start is lower)
        [0, gp],                  // Gross Profit (Total)
        [gp - opex, gp],          // OpEx
        [0, opi],                 // Operating Income (Total)
        [opi - tax, opi],         // Tax
        [0, ni]                   // Net Income (Total)
    ];
    // colors: blue for total, red for negative flow
    const bgColors = ['#06b6d4', '#f43f5e', '#06b6d4', '#f43f5e', '#06b6d4', '#f43f5e', '#10b981'];

    if (charts.isWaterfall) charts.isWaterfall.destroy();
    charts.isWaterfall = new Chart(document.getElementById('isWaterfallChart'), {
        type: 'bar',
        data: {
            labels: ['營業收入', '營業成本', '毛利', '營業費用', '營業利益', '稅捐', '淨利潤'],
            datasets: [{
                data: waterfallData,
                backgroundColor: bgColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: {
                    display: true,
                    color: '#fff',
                    formatter: (value, ctx) => {
                        let diff = value[1] - value[0];
                        return formatCurrency(diff);
                    }
                }
            }
        }
    });

    if (charts.isMargin) charts.isMargin.destroy();
    charts.isMargin = new Chart(document.getElementById('isMarginChart'), {
        type: 'line',
        data: {
            labels: State.months,
            datasets: [
                {
                    label: '毛利率',
                    data: State.metrics.grossProfit.map((v, i) => (v / State.metrics.revenue[i]) * 100),
                    borderColor: '#06b6d4',
                    tension: 0.3
                },
                {
                    label: '營業利益率',
                    data: State.metrics.operatingIncome.map((v, i) => (v / State.metrics.revenue[i]) * 100),
                    borderColor: '#8b5cf6',
                    tension: 0.3
                },
                {
                    label: '淨利率',
                    data: State.metrics.netIncome.map((v, i) => (v / State.metrics.revenue[i]) * 100),
                    borderColor: '#10b981',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { title: { display: true, text: '百分比 (%)' } }
            },
            plugins: {
                legend: { position: 'top', labels: { color: '#f8fafc' } },
                datalabels: { display: false }
            }
        }
    });
}

// ---------------- Page 4: 現金流量表 ----------------
function renderCashFlow() {
    const lastIdx = State.metrics.cfo.length - 1;
    if (lastIdx < 0) return;

    const cfo = State.metrics.cfo[lastIdx];
    const prevCfo = lastIdx > 0 ? State.metrics.cfo[lastIdx - 1] : cfo;
    const cfoChange = prevCfo ? ((cfo - prevCfo) / Math.abs(prevCfo) * 100).toFixed(1) : 0;

    const cfi = State.metrics.cfi[lastIdx];
    const prevCfi = lastIdx > 0 ? State.metrics.cfi[lastIdx - 1] : cfi;
    const cfiChange = prevCfi ? ((cfi - prevCfi) / Math.abs(prevCfi) * 100).toFixed(1) : 0;

    const cff = State.metrics.cff[lastIdx];
    const prevCff = lastIdx > 0 ? State.metrics.cff[lastIdx - 1] : cff;
    const cffChange = prevCff ? ((cff - prevCff) / Math.abs(prevCff) * 100).toFixed(1) : 0;

    const netCf = State.metrics.netCashFlow[lastIdx];
    const prevNetCf = lastIdx > 0 ? State.metrics.netCashFlow[lastIdx - 1] : netCf;
    const netCfChange = prevNetCf ? ((netCf - prevNetCf) / Math.abs(prevNetCf) * 100).toFixed(1) : 0;

    const svgActivity = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`;

    document.getElementById('cf-kpis').innerHTML = `
        ${createKPICard('營業現金流 (CFO)', formatCurrency(cfo), cfoChange, cfo >= 0, svgActivity)}
        ${createKPICard('投資現金流 (CFI)', formatCurrency(cfi), cfiChange, cfiChange >= 0, svgActivity)}
        ${createKPICard('籌資現金流 (CFF)', formatCurrency(cff), cffChange, cff >= 0, svgActivity)}
        ${createKPICard('現金淨流量', formatCurrency(netCf), netCfChange, netCf >= 0, svgActivity)}
    `;

    if (charts.cfTrend) charts.cfTrend.destroy();
    charts.cfTrend = new Chart(document.getElementById('cfTrendChart'), {
        type: 'bar',
        data: {
            labels: State.months,
            datasets: [
                { label: 'CFO (營業)', data: State.metrics.cfo, backgroundColor: '#10b981' },
                { label: 'CFI (投資)', data: State.metrics.cfi, backgroundColor: '#f59e0b' },
                { label: 'CFF (籌資)', data: State.metrics.cff, backgroundColor: '#8b5cf6' },
                {
                    type: 'line',
                    label: '淨現金流',
                    data: State.metrics.netCashFlow,
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    fill: false,
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

    // Determine YTD values for CF Waterfall
    const ytdCfo = State.metrics.cfo.reduce((a, b) => a + b, 0);
    const ytdCfi = State.metrics.cfi.reduce((a, b) => a + b, 0);
    const ytdCff = State.metrics.cff.reduce((a, b) => a + b, 0);

    // Simulate Initial Cash (Cash array holds end of month balances)
    // Actually the cash array holds total cash available. 
    // Let's use the first month's cash minus its net CF as opening balance.
    const initialCash = State.metrics.cash[0] - State.metrics.netCashFlow[0];
    const endingCash = State.metrics.cash[lastIdx]; // or initialCash + ytdCfo + ytdCfi + ytdCff

    const wData = [
        [0, initialCash],
        [initialCash, initialCash + ytdCfo],
        [initialCash + ytdCfo, initialCash + ytdCfo + ytdCfi],
        [initialCash + ytdCfo + ytdCfi, initialCash + ytdCfo + ytdCfi + ytdCff],
        [0, endingCash]
    ];

    const wColors = [
        '#64748b',
        ytdCfo >= 0 ? '#10b981' : '#f43f5e',
        ytdCfi >= 0 ? '#10b981' : '#f43f5e',
        ytdCff >= 0 ? '#10b981' : '#f43f5e',
        '#06b6d4'
    ];

    if (charts.cfWaterfall) charts.cfWaterfall.destroy();
    charts.cfWaterfall = new Chart(document.getElementById('cfWaterfallChart'), {
        type: 'bar',
        data: {
            labels: ['期初餘額', 'CFO', 'CFI', 'CFF', '期末餘額'],
            datasets: [{
                data: wData,
                backgroundColor: wColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: {
                    display: true,
                    color: '#fff',
                    formatter: (value, ctx) => {
                        let diff = value[1] - value[0];
                        return formatCurrency(diff);
                    }
                }
            }
        }
    });
}
