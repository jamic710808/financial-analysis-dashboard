// Global State Management
const State = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    metrics: {
        revenue: [],          // 營業收入
        cost: [],             // 營業成本
        grossProfit: [],      // 毛利
        operatingExpense: [], // 營業費用
        operatingIncome: [],  // 營業利益
        tax: [],              // 稅捐
        netIncome: [],        // 淨利潤
        
        assets: [],           // 總資產
        liabilities: [],      // 總負債
        equity: [],           // 總權益
        currentAssets: [],    // 流動資產
        currentLiabilities:[],// 流動負債
        inventory: [],        // 存貨
        cash: [],             // 現金
        
        cfo: [],              // 營業現金流
        cfi: [],              // 投資現金流
        cff: [],              // 籌資現金流
        netCashFlow: []       // 淨現金流
    }
};

// Generate Sample Data for Default View
function generateSampleData() {
    const baseRev = 5000000;
    const revGrowth = 0.05;

    for (let i = 0; i < 12; i++) {
        // P&L
        const rev = Math.round(baseRev * Math.pow(1 + revGrowth, i) * (0.9 + Math.random() * 0.2));
        const cgs = Math.round(rev * (0.55 + Math.random() * 0.05)); // COGS around 55-60%
        const opEx = Math.round(rev * (0.2 + Math.random() * 0.05)); // OpEx around 20-25%
        const gp = rev - cgs;
        const opI = gp - opEx;
        const tax = Math.round(opI * 0.2);
        const ni = opI - tax;

        State.metrics.revenue.push(rev);
        State.metrics.cost.push(cgs);
        State.metrics.grossProfit.push(gp);
        State.metrics.operatingExpense.push(opEx);
        State.metrics.operatingIncome.push(opI);
        State.metrics.tax.push(tax);
        State.metrics.netIncome.push(ni);

        // Balance Sheet (Cumulative growth)
        const assetsBase = 20000000;
        const totalAssets = Math.round(assetsBase + (i * 1000000) * (0.9 + Math.random() * 0.2));
        const liabBase = 12000000;
        const totalLiab = Math.round(liabBase + (i * 400000) * (0.9 + Math.random() * 0.2));
        const totalEquity = totalAssets - totalLiab;

        const currAssets = Math.round(totalAssets * 0.4);
        const currLiab = Math.round(totalLiab * 0.6);
        const inv = Math.round(currAssets * 0.3);
        const cashBal = Math.round(currAssets * 0.2);

        State.metrics.assets.push(totalAssets);
        State.metrics.liabilities.push(totalLiab);
        State.metrics.equity.push(totalEquity);
        State.metrics.currentAssets.push(currAssets);
        State.metrics.currentLiabilities.push(currLiab);
        State.metrics.inventory.push(inv);
        State.metrics.cash.push(cashBal);

        // Cash Flow
        const cfo = ni + Math.round(ni * 0.1); // Add back D&A roughly
        const cfi = Math.round(-totalAssets * 0.05 * Math.random()); // CapEx
        const cff = Math.round(Math.random() > 0.5 ? 500000 : -200000); // Debt issuance/repayment
        const netCf = cfo + cfi + cff;

        State.metrics.cfo.push(cfo);
        State.metrics.cfi.push(cfi);
        State.metrics.cff.push(cff);
        State.metrics.netCashFlow.push(netCf);
    }
}

// Download Sample JSON
function downloadSampleData() {
    showToast('準備下載範例資料 (JSON)...');
    
    // Prepare export format aligned with SheetJS expectations for future CSV/XLSX support
    let exportData = [];
    for(let i=0; i<12; i++) {
        exportData.push({
            '月份': State.months[i],
            '營業收入': State.metrics.revenue[i],
            '營業成本': State.metrics.cost[i],
            '營業費用': State.metrics.operatingExpense[i],
            '營業利益': State.metrics.operatingIncome[i],
            '稅捐': State.metrics.tax[i],
            '淨利潤': State.metrics.netIncome[i],
            '總資產': State.metrics.assets[i],
            '總負債': State.metrics.liabilities[i],
            '總權益': State.metrics.equity[i],
            '流動資產': State.metrics.currentAssets[i],
            '流動負債': State.metrics.currentLiabilities[i],
            '存貨': State.metrics.inventory[i],
            '現金': State.metrics.cash[i],
            '營業現金流': State.metrics.cfo[i],
            '投資現金流': State.metrics.cfi[i],
            '籌資現金流': State.metrics.cff[i],
            '現金淨流量': State.metrics.netCashFlow[i]
        });
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "財務報表範例資料.json");
    dlAnchorElem.click();
}

// Engine to process imported Excel JSON data
function processImportedData(jsonData) {
    // Reset State Arrays
    for(let key in State.metrics) {
        State.metrics[key] = [];
    }
    State.months = [];

    jsonData.forEach(row => {
        State.months.push(row['月份'] || '');
        State.metrics.revenue.push(Number(row['營業收入']) || 0);
        State.metrics.cost.push(Number(row['營業成本']) || 0);
        State.metrics.operatingExpense.push(Number(row['營業費用']) || 0);
        State.metrics.operatingIncome.push(Number(row['營業利益']) || 0);
        State.metrics.tax.push(Number(row['稅捐']) || 0);
        State.metrics.netIncome.push(Number(row['淨利潤']) || 0);
        
        State.metrics.assets.push(Number(row['總資產']) || 0);
        State.metrics.liabilities.push(Number(row['總負債']) || 0);
        State.metrics.equity.push(Number(row['總權益']) || 0);
        State.metrics.currentAssets.push(Number(row['流動資產']) || 0);
        State.metrics.currentLiabilities.push(Number(row['流動負債']) || 0);
        State.metrics.inventory.push(Number(row['存貨']) || 0);
        State.metrics.cash.push(Number(row['現金']) || 0);
        
        State.metrics.cfo.push(Number(row['營業現金流']) || 0);
        State.metrics.cfi.push(Number(row['投資現金流']) || 0);
        State.metrics.cff.push(Number(row['籌資現金流']) || 0);
        State.metrics.netCashFlow.push(Number(row['現金淨流量']) || 0);
        
        // Compute derived values dynamically (Gross Profit)
        const gp = (Number(row['營業收入']) || 0) - (Number(row['營業成本']) || 0);
        State.metrics.grossProfit.push(gp);
    });

    renderAllPages();
}

function formatCurrency(val) {
    if(Math.abs(val) >= 100000000) return (val / 100000000).toFixed(2) + ' 億';
    if(Math.abs(val) >= 10000) return (val / 10000).toFixed(1) + ' 萬';
    return val.toLocaleString();
}

function formatPercent(val) {
    return (val * 100).toFixed(1) + '%';
}

// Render Engine (To be implemented across pages)
function renderAllPages() {
    console.log("Rendering all charts and KPIs...");
    // Future Render Functions Called Here
    if(typeof renderOverview === 'function') renderOverview();
    if(typeof renderBalanceSheet === 'function') renderBalanceSheet();
    if(typeof renderIncomeStatement === 'function') renderIncomeStatement();
    if(typeof renderCashFlow === 'function') renderCashFlow();
    if(typeof renderProfitability === 'function') renderProfitability();
    if(typeof renderLiquidity === 'function') renderLiquidity();
    if(typeof renderDuPont === 'function') renderDuPont();
    if(typeof renderZScore === 'function') renderZScore();
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    generateSampleData();
    renderAllPages();
    
    // File Input Logic (Replaced inline handler)
    document.getElementById('fileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        showToast('開始讀取檔案...');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                
                if(jsonData.length > 0) {
                    processImportedData(jsonData);
                    showToast('資料匯入成功！圖表已更新。');
                } else {
                    showToast('檔案內無有效的資料列', 'error');
                }
            } catch(error) {
                console.error(error);
                showToast('讀取失敗，請確認檔案格式！', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    });
});
