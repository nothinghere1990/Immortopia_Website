# 不朽幻都 | Immortopia: Cyberpunk Monopoly Game Website

<div align="center">

<a href="https://nothinghere1990.github.io/Immortopia_Website/#">
    <img alt="Immortopia Website" width="500" src="images\Logo.png">
</a>

**一個賽博朋克風格的大富翁遊戲介紹網站**  
*A cyberpunk-themed Monopoly game introduction website*

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Swiper.js](https://img.shields.io/badge/Swiper.js-6332F6?style=flat-square&logo=swiper)](https://swiperjs.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chart.js)](https://www.chartjs.org/)

</div>
<hr>

## 📖 項目簡介 | Project Description

不朽幻都（Immortopia）是一個賽博朋克主題的大富翁遊戲介紹網站。網站採用現代化的滑動式設計，展示遊戲世界觀、角色介紹、場景設計，並內建一個使用真實股票數據的投資模擬小遊戲。

## ✨ 功能特點 | Features

### 🎮 核心功能
- **4頁式滑動網站** - 流暢的頁面切換體驗
- **響應式設計** - 完美適配桌面端和移動端
- **賽博朋克視覺效果** - 霓虹發光、玻璃質感等視覺特效
- **多種導航方式** - 支援滑鼠滾輪、鍵盤方向鍵、觸控滑動

### 📱 頁面內容
1. **主頁** - 遊戲世界觀介紹，21世紀末的不朽幻都
2. **角色介紹** - 展示遊戲角色（彈間陽子等4個角色，後續會追加）的技能、雷達圖、棋子設計
3. **場景圖** - 展示遊戲場景設計（還有更多場景，後續會追加），包含AI生成圖和白模圖
4. **小遊戲** - 股票投資模擬器，使用真實股票數據

### 🎯 股票投資模擬器
- **真實數據** - 使用 Polygon.io API 獲取真實股票價格
- **互動圖表** - Chart.js 實時顯示股價走勢
- **投資管理** - 虛擬資金管理，買入/賣出操作
- **交易記錄** - 完整的交易歷史追蹤
- **損益計算** - 實時計算投資收益

## 🛠️ 技術棧 | Tech Stack

### 前端框架
- **Vue.js 3** - 響應式前端框架
- **Tailwind CSS** - 實用優先的CSS框架
- **Swiper.js** - 現代化滑動組件庫

### 圖表與數據
- **Chart.js** - 靈活的JavaScript圖表庫
- **Polygon.io API** - 真實股票市場數據

### 字體與樣式
- **Google Fonts (Noto Sans TC)** - 支援繁體中文的網頁字體
- **CSS3 動畫** - 自定義賽博朋克視覺效果

## 📁 項目結構 | Project Structure

```
Immortopia_Website/
├── index.html              # 主頁面文件
├── script.js               # 主要JavaScript邏輯
├── stock-game.js           # 股票遊戲邏輯
├── styles.css              # 主要樣式文件
├── stock_game_flowchart.md # 股票遊戲流程圖
├── images/                 # 圖片資源
│   ├── Logo.png           # 網站Logo
│   ├── Home_Bg.png        # 主頁背景
│   ├── Others_Bg.png      # 其他頁面背景
│   ├── Art-*.png          # 角色立繪
│   ├── 頭像-*.png         # 角色頭像
│   ├── 角色棋子-*.png     # 角色棋子
│   ├── *雷達圖*.png       # 技能/個性雷達圖
│   └── 市中心*.png        # 場景圖片
└── README.md             # 項目說明文件
```

## 🎮 使用說明 | Usage Guide

### 導航操作
- **滑鼠滾輪** - 上下滾動切換頁面
- **鍵盤方向鍵** - 左右箭頭切換頁面
- **觸控滑動** - 在移動設備上滑動切換
- **導航按鈕** - 點擊頂部導航按鈕直接跳轉

### 股票投資遊戲
1. 進入「小遊戲」頁面
2. 查看當前股票價格和走勢圖
3. 輸入投資金額
4. 點擊「買入」或「賣出」按鈕
5. 查看投資組合和交易記錄
6. 使用「重置」按鈕重新開始

## ⚙️ API 配置 | API Configuration

### Polygon.io API 設置
1. 註冊 [Polygon.io](https://polygon.io/) 帳戶
2. 獲取免費 API 金鑰
3. 在 `stock-game.js` 中替換 API 金鑰：
```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

### API 限制
- 免費版本：每分鐘5次請求
- 建議設置適當的請求間隔避免超出限制