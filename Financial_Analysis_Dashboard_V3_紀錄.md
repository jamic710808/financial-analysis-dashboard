# 財務報表分析儀表板 V3 — 開發紀錄

**版本：** V3.0
**開發日期：** 2026年3月19日
**基底版本：** V2（2026年3月7日）
**開發者：** Liu / Claude AI 協作
**參考資料：** Power BI 財務報表分析 PDF（1–60頁）、完整分析報告.docx

---

## 一、V3 版設計目標

V3 版在 V2（10頁）基礎上進行全面升級，主要設計目標：

1. **思維架構深化**：引入 CCC、杜邦五因子、三表連動 SVG 流程圖等分析框架
2. **雙主題系統**：支援「暗色玻璃態」↔「亮色商務」一鍵切換
3. **Excel 動態匯入**：支援多工作表自動偵測、欄位映射、匯入紀錄
4. **PDF 匯出**：整合 html2pdf.js，支援當前頁面一鍵匯出 A4 橫向
5. **頁數擴充**：從 10 頁擴充至 15 頁，新增 5 個進階分析模組

---

## 二、版本比較 V2 vs V3

| 項目 | V2（2026-03-07） | V3（2026-03-19） |
|------|-----------------|-----------------|
| 頁數 | 10 頁 | **15 頁** |
| 主題 | 單一暗色模式 | **雙主題切換** |
| 單位切換 | 無 | **元 / 萬元 / 百萬元** |
| Excel 匯入 | 單工作表 | **多工作表 + 自動偵測** |
| Excel 範本下載 | 無 | **✅ 內建範本** |
| PDF 匯出 | 無 | **✅ html2pdf.js** |
| CSV 匯出 | ✅ | ✅ |
| CCC 分析 | 無 | **✅ P9 全新** |
| 情境模擬器 | 無 | **✅ P10 全新** |
| 三表連動圖 | 文字矩陣 | **✅ P11 SVG 流程圖** |
| YoY/MoM 中心 | 無 | **✅ P12 全新** |
| 資料品質儀表板 | 無 | **✅ P13 全新** |
| DAX 公式庫 | 基礎列表 | **✅ 可搜尋 + 12則公式** |

---

## 三、頁面架構

### 核心總覽群組
| 頁碼 | 名稱 | 核心圖表 | 分析思維 |
|------|------|---------|---------|
| P1 | 執行總覽 | 收入+毛利率雙軸、淨利+EBITDA、費用結構甜甜圈、資本結構堆疊、三大現金流 | 一頁看懂企業全貌 |
| P2 | 資產負債表 | **巢狀甜甜圈**（資產層次）、趨勢折線、流動vs非流動 | Stock 存量邏輯（期末值） |
| P3 | 損益表 | **瀑布圖**（收入→淨利分解）、趨勢、**垂直分析**（%of收入） | Flow 流量邏輯（區間加總） |
| P4 | 現金流量 | **Cash Bridge 瀑布**、三大活動趨勢、FCF、CFO/NI比率 | 現金為王邏輯 |

### 財務比率群組
| 頁碼 | 名稱 | 核心圖表 | 分析思維 |
|------|------|---------|---------|
| P5 | 獲利能力 | 多維利潤率趨勢、ROE/ROA、**雷達圖**（同期對比）、EBITDA vs EBIT | 獲利品質多維度 |
| P6 | 流動性效率 | 流動/速動比率、DSO/DIO/DPO趨勢、週轉率、NWC | 效率雙維度 |
| P7 | 杜邦分析 | **杜邦分解樹**（動態SVG結構）、三因子趨勢、因子貢獻堆疊、五因子杜邦 | ROE = NM × AT × EM |
| P8 | Altman Z-Score | **儀表評分**（紅/黃/綠區帶）、歷史趨勢、五因子雷達圖、各因子趨勢 | 破產預警五因子模型 |

### 進階分析群組（NEW）
| 頁碼 | 名稱 | 核心圖表 | 分析思維 |
|------|------|---------|---------|
| P9 | 現金循環週期 | CCC趨勢、DSO/DIO/DPO堆疊（含負值DPO）、三分項折線 | CCC = DSO + DIO - DPO |
| P10 | 情境模擬器 | 滑桿參數調整、淨利敏感度折線、**龍捲風圖**、Break-Even分析 | What-If 假設分析 |
| P11 | 三表連動 | **SVG 流程圖**（損益→資負→現金流箭頭連結）、三表關鍵項目比較表 | 三表勾稽思維 |
| P12 | 年月比較中心 | YoY/MoM 切換、絕對值/百分比切換、收入/獲利/費用/現金流比較 | 時間序列趨勢思維 |
| P13 | 資料品質儀表板 | 品質評分（0-100分）、品質雷達圖、完整度直條、**Z-Score異常偵測** | 資料治理框架 |

### 輔助工具群組
| 頁碼 | 名稱 | 功能 |
|------|------|------|
| P14 | 三表矩陣 | 全期（12期）損益表 / 資產負債表 / 現金流量表並排顯示 |
| P15 | DAX 公式庫 | 12則常用 Power BI DAX 公式，可關鍵字搜尋 |

---

## 四、技術架構

### 前端技術棧
```
Chart.js v4.4.0    — 圖表渲染（Bar / Line / Doughnut / Radar / Floating Bar）
SheetJS 0.20.0     — Excel 解析（多工作表支援）
html2pdf.js 0.10.1 — PDF 匯出（html2canvas + jsPDF）
Vanilla JS (ES6+)  — 無框架，單一 HTML 自包含
CSS Custom Props   — 雙主題系統
```

### 雙主題架構
```css
/* 暗色（預設）*/
:root { --bg:#070e1a; --cy:#22d3ee; ... }

/* 亮色（切換後）*/
body.theme-light { --bg:#f0f4f8; --cy:#047819; ... }
```

```javascript
// T() 函數取代 V2 的常數 T 物件，實現動態主題感知
function T() {
  const L = document.body.classList.contains('theme-light');
  return L ? { cy:'#047819', ... } : { cy:'#22d3ee', ... };
}
```

### 資料模型（D 物件擴充）

V3 相比 V2 新增以下欄位：

| 新增欄位 | 類型 | 說明 |
|---------|------|------|
| `ebit` | number[] | 息前稅前盈餘 |
| `ebitda` | number[] | EBITDA |
| `payables` | number[] | 應付帳款（DPO 計算用）|
| `dso` | number[] | 應收帳款週轉天數 |
| `dio` | number[] | 存貨週轉天數 |
| `dpo` | number[] | 應付帳款週轉天數 |
| `ccc` | number[] | 現金循環週期（天）|
| `openingCash` | number[] | 期初現金餘額 |
| `closingCash` | number[] | 期末現金餘額 |
| `prevRevenue` | number[] | 前期收入（YoY 用）|
| `prevNetIncome` | number[] | 前期淨利（YoY 用）|
| `prevCFO` | number[] | 前期 CFO（YoY 用）|

### 圖表創新點

1. **巢狀甜甜圈（P2）**：雙環 doughnut，內環為流動/非流動，外環為細項資產
2. **損益瀑布圖（P3）**：Chart.js floating bar `[min, max]` 格式實現
3. **Cash Bridge（P4）**：現金橋樑圖，期初→CFO→CFI→CFF→期末，正負色區分
4. **杜邦分解樹（P7）**：HTML/CSS flex 結構動態渲染
5. **三表連動 SVG（P11）**：內嵌 SVG，虛線箭頭連結三表關係
6. **龍捲風圖（P10）**：水平橫條圖（`indexAxis:'y'`）呈現敏感度

---

## 五、Excel 匯入規格

### 支援格式
- `.xlsx`, `.xls`（SheetJS 解析）
- `.csv`（SheetJS 解析）

### 多工作表偵測邏輯
```javascript
const sheetIS = findSheet(wb, ['損益表','IS','P&L','Income']);
const sheetBS = findSheet(wb, ['資產負債表','BS','Balance']);
const sheetCF = findSheet(wb, ['現金流量表','CF','Cash']);
```

### 科目名稱映射（支援中英文）
```javascript
const keyMap = {
  '營業收入':'revenue', 'Revenue':'revenue',
  '營業成本':'cost', 'Cost':'cost',
  '毛利':'grossProfit', ...
};
```

### 資料方向支援
- **欄向**（預設）：第一欄為科目名稱，後續欄為各期數值
- **列向**：第一列為科目名稱，後續列為各期數值

---

## 六、PDF 匯出規格

```javascript
const opt = {
  margin: 0.5,
  filename: '財報分析_V3_P' + pid + '_' + date + '.pdf',
  image: { type: 'jpeg', quality: 0.95 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
};
```

- 匯出範圍：**當前頁面**（非全部頁面）
- 格式：A4 橫向，解析度 2x（高品質）
- 建議：先切換至要匯出的頁面，再點選「匯出 PDF」

---

## 七、資料品質評分邏輯

| 檢核項目 | 配分 | 評分邏輯 |
|---------|------|---------|
| 資產負債表平衡（A = L + E） | 25分 | 誤差率 < 0.1% 為通過 |
| 收入數值合理（全期為正） | 20分 | 無負值收入 |
| 毛利率合理範圍（0-80%） | 20分 | 全期毛利率在合理區間 |
| 現金流量連續性 | 20分 | 期末現金 ≈ 期初 + 淨現金流 |
| 資料完整度（無缺失值） | 15分 | 核心欄位無 NaN |

---

## 八、DAX 公式庫收錄清單

1. 期末餘額（LASTNONBLANKVALUE — 存量邏輯）
2. 本期合計（DATESINPERIOD — 流量邏輯）
3. YTD 累計（DATESYTD）
4. 同期比較 YoY（SAMEPERIODLASTYEAR）
5. 毛利率（DIVIDE）
6. ROE 杜邦分解（淨利率 × 週轉率 × 槓桿）
7. Altman Z-Score 五因子計算
8. 現金循環週期 CCC（DSO + DIO - DPO）
9. P_Time 計算群組（本期/累計切換）
10. P_View 計算群組（金額/%切換）
11. 自由現金流 FCF
12. 動態標題（SELECTEDVALUE 篩選器感應）

---

## 九、已知限制與後續優化方向

| 項目 | 限制說明 | 建議改善 |
|------|---------|---------|
| PDF 匯出 | 僅匯出當前頁面 | 可加入「全部頁面批次匯出」功能 |
| 情境模擬 | 假設線性關係 | 可加入非線性敏感度模型 |
| 歷史期數 | 固定 12 期 | 可動態調整期數 |
| 圖表互動 | 僅 tooltip | 可加入點擊下鑽（drill-through）|
| 行動裝置 | 側欄需手動折疊 | 可加入漢堡選單 |

---

## 十、檔案清單

```
財務報表分析/
├── Financial_Analysis_Dashboard_V3.html          ← 主儀表板（本檔）
├── Financial_Analysis_Dashboard_V3_紀錄.md        ← 本開發紀錄
├── Financial_Analysis_Dashboard_V3_使用說明書.md   ← 操作手冊
├── Financial_Analysis_Dashboard_V2.html          ← V2 版（參考保留）
└── Financial_Analysis_Dashboard_V2_紀錄.md        ← V2 開發紀錄
```

---

## 十一、AI 分析功能模組（V3.1 升級 — 2026年4月10日）

### 功能概述

參照「庫存策略分析第四版」儀表板的 AI 架構，為財務報表分析 V3 加入完整的 AI 對話分析框架。

### AI 技術架構

```
供應商抽象層    AI_PROVIDERS 常數（5個供應商）
狀態管理        aiState 物件（provider/model/apiKey/chatHistory/stream/abort）
系統提示詞      AI_SYSTEM_PROMPT（繁體中文財務分析師人設）
呼叫核心        callAI()（OpenAI + Anthropic 雙格式 + SSE 串流）
頁面觸發        triggerPageAI(pid)（15頁各自專屬提示詞）
資料萃取        extractPageData(pid)（從 D 物件提取當頁指標）
設定持久化      saveAISettings() / loadAISettings()（localStorage）
對話快取        saveAIChatCache() / restoreAIChat()（session 延續）
```

### 支援供應商

| 供應商 | 端點 | 代表模型 |
|--------|------|---------|
| OpenAI | https://api.openai.com/v1 | gpt-4o, gpt-4o-mini |
| DeepSeek | https://api.deepseek.com/v1 | deepseek-chat, deepseek-reasoner |
| 硅基流動 | https://api.siliconflow.cn/v1 | Qwen2.5-72B, DeepSeek-V3 |
| Anthropic | https://api.anthropic.com | claude-opus-4-6, claude-sonnet-4-6 |
| 自訂端點 | 使用者輸入 | 任意相容 OpenAI 格式的模型 |

### 15頁專屬分析觸發提示詞

| 頁碼 | 觸發主題 | 分析框架 |
|------|---------|---------|
| P1 | 執行總覽 | 四維健康評估（成長/獲利/現金/結構）+ 整體評分 A/B/C/D |
| P2 | 資產負債表 | 資產品質 + 負債結構 + 槓桿合理性 |
| P3 | 損益表 | 收入可持續性 + 利潤率趨勢 + 費用控制 |
| P4 | 現金流量 | CFO vs NI 盈餘品質 + FCF + 投融資策略 |
| P5 | 獲利能力 | ROE/ROA 驅動因子 + EBITDA margin + 同業比較 |
| P6 | 流動性效率 | 流動比/速動比達標 + DSO/DIO/DPO 業務解讀 |
| P7 | 杜邦分析 | ROE = 淨利率 × 週轉率 × 槓桿三因子拆解 |
| P8 | Z-Score | 安全/灰色/危險區識別 + 各因子貢獻 + 預警行動 |
| P9 | CCC | CCC趨勢方向 + 三分項診斷 + 優化建議 |
| P10 | 情境模擬 | 敏感度框架 + 槓桿效應 + 管理層KPI建議 |
| P11 | 三表連動 | 淨利→留存盈餘→CFO路徑 + 三表勾稽一致性 |
| P12 | 年月比較 | YoY加速/放緩判斷 + 季節性識別 + 成長預測 |
| P13 | 資料品質 | 平衡誤差容忍度 + 異常點 + 數據治理建議 |
| P14 | 三表矩陣 | 12期結構性轉折點 + 長期趨勢識別 |
| P15 | DAX公式庫 | Power BI 財務模型設計最佳實踐 |

### UI 元件

```
#ai-panel           固定定位側欄（右側滑出，width:420px）
#ai-panel-toggle    浮動觸發按鈕（右下角，漸層紫色）
.ai-page-btn        每頁頂部 AI 觸發按鈕（15個，帶動態脈衝點）
.ai-config-section  供應商/模型/API Key/進階設定
.ai-messages        可捲動對話區（user/assistant/system 三種氣泡）
.ai-quick-row       快速建議按鈕（綜合分析/異常偵測/改善建議/同業比較）
```

### 串流輸出機制

```javascript
// OpenAI SSE 格式
data: {"choices":[{"delta":{"content":"..."}}]}

// Anthropic SSE 格式
data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"..."}}

// 共用：ReadableStream + TextDecoder 逐 chunk 解析
// 串流中：el.textContent 即時更新 + auto-scroll
// 取消：AbortController.abort()
```

### Token 估算（輸入框即時顯示）

```javascript
function estimateTokens(text) {
  const cjk = (text.match(/[\u4e00-\u9fff...]/g)||[]).length;
  return Math.round(cjk * 1.5 + (text.length - cjk) * 0.28);
}
// >1500 token → 黃色警告；>3000 token → 紅色警告
```

### 檔案規模（V3.1）

| 版本 | 行數 | 大小 |
|------|------|------|
| V3.0（2026-03-19） | 2,396 行 | ~113 KB |
| V3.1（2026-04-10）含 AI 模組 | 3,114 行 | ~145 KB |

---

*V3.0 開發完成時間：2026年3月19日 | V3.1 AI 模組：2026年4月10日 | 協作工具：Claude AI (Cowork Mode)*
