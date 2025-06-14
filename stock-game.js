// 股票投資小遊戲 - 主要邏輯文件
class StockGame {
    constructor() {
        this.apiKey = 'YOUR_POLYGON_API_KEY'; // 需要替換為實際的API密鑰
        this.baseUrl = 'https://api.polygon.io';
        this.symbol = 'AAPL'; // 預設股票代碼
        this.chart = null;
        this.updateInterval = null;
        this.lastUpdateTime = 0;
        this.minUpdateInterval = 60000; // 最小更新間隔：1分鐘
        
        // 遊戲狀態
        this.gameState = {
            cashBalance: 1000,
            stockInvestment: 0,
            shares: 0,
            currentPrice: 150.00,
            totalValue: 1000,
            profitLoss: 0
        };
        
        // 股票信息
        this.stockInfo = {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            currentPrice: 150.00,
            change: 2.50,
            changePercent: 1.69,
            lastUpdate: '載入中...'
        };
        
        // 交易記錄
        this.transactionHistory = [];
        
        // 圖表數據
        this.chartData = {
            labels: [],
            prices: []
        };
        
        // 模擬數據（當API不可用時使用）
        this.useSimulatedData = true;
        
        this.init();
    }
    
    // 初始化遊戲
    init() {
        this.loadGameState();
        this.initChart();
        this.startDataUpdate();
        this.bindEvents();
        console.log('股票投資遊戲初始化完成');
    }
    
    // 從本地存儲載入遊戲狀態
    loadGameState() {
        const savedState = localStorage.getItem('stockGameState');
        if (savedState) {
            this.gameState = { ...this.gameState, ...JSON.parse(savedState) };
        }
        this.updateGameState();
    }
    
    // 保存遊戲狀態到本地存儲
    saveGameState() {
        localStorage.setItem('stockGameState', JSON.stringify(this.gameState));
    }
    
    // 初始化圖表
    initChart() {
        const ctx = document.getElementById('stockChart');
        if (!ctx) return;
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.chartData.labels,
                datasets: [{
                    label: '股價',
                    data: this.chartData.prices,
                    borderColor: '#00f5ff',
                    backgroundColor: 'rgba(0, 245, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ffffff',
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 3,
                        hoverRadius: 6
                    }
                }
            }
        });
    }
    
    // 開始數據更新
    startDataUpdate() {
        this.updateStockData();
        this.updateInterval = setInterval(() => {
            this.updateStockData();
        }, this.minUpdateInterval);
    }
    
    // 更新股票數據
    async updateStockData() {
        const now = Date.now();
        if (now - this.lastUpdateTime < this.minUpdateInterval) {
            return;
        }
        
        try {
            if (this.useSimulatedData) {
                this.generateSimulatedData();
            } else {
                await this.fetchRealStockData();
            }
            this.lastUpdateTime = now;
            this.updateChart();
            this.updateGameState();
        } catch (error) {
            console.error('更新股票數據失敗:', error);
            this.showGameStatus('API 請求失敗，使用模擬數據', 'error');
            this.generateSimulatedData();
        }
    }
    
    // 生成模擬數據
    generateSimulatedData() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        
        // 生成隨機價格變動（-2% 到 +2%）
        const changePercent = (Math.random() - 0.5) * 4;
        const newPrice = this.stockInfo.currentPrice * (1 + changePercent / 100);
        const change = newPrice - this.stockInfo.currentPrice;
        
        this.stockInfo.currentPrice = Math.max(newPrice, 1); // 確保價格不為負
        this.stockInfo.change = change;
        this.stockInfo.changePercent = changePercent;
        this.stockInfo.lastUpdate = timeStr;
        
        // 更新圖表數據
        this.chartData.labels.push(timeStr);
        this.chartData.prices.push(this.stockInfo.currentPrice);
        
        // 保持最近20個數據點
        if (this.chartData.labels.length > 20) {
            this.chartData.labels.shift();
            this.chartData.prices.shift();
        }
        
        console.log(`模擬數據更新: $${this.stockInfo.currentPrice.toFixed(2)}`);
    }
    
    // 獲取真實股票數據（需要API密鑰）
    async fetchRealStockData() {
        if (!this.apiKey || this.apiKey === 'YOUR_POLYGON_API_KEY') {
            throw new Error('需要有效的 Polygon.io API 密鑰');
        }
        
        const url = `${this.baseUrl}/v2/aggs/ticker/${this.symbol}/prev?adjusted=true&apikey=${this.apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API 請求失敗: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            this.stockInfo.currentPrice = result.c; // 收盤價
            this.stockInfo.change = result.c - result.o; // 變動
            this.stockInfo.changePercent = ((result.c - result.o) / result.o) * 100;
            this.stockInfo.lastUpdate = new Date().toLocaleTimeString();
            
            // 更新圖表數據
            const timeStr = new Date().toLocaleTimeString();
            this.chartData.labels.push(timeStr);
            this.chartData.prices.push(this.stockInfo.currentPrice);
            
            if (this.chartData.labels.length > 20) {
                this.chartData.labels.shift();
                this.chartData.prices.shift();
            }
        }
    }
    
    // 更新圖表
    updateChart() {
        if (this.chart) {
            this.chart.data.labels = [...this.chartData.labels];
            this.chart.data.datasets[0].data = [...this.chartData.prices];
            this.chart.update('none'); // 無動畫更新以提高性能
        }
    }
    
    // 更新遊戲狀態
    updateGameState() {
        // 計算股票投資當前價值
        this.gameState.stockInvestment = this.gameState.shares * this.stockInfo.currentPrice;
        
        // 計算總資產
        this.gameState.totalValue = this.gameState.cashBalance + this.gameState.stockInvestment;
        
        // 計算損益
        this.gameState.profitLoss = this.gameState.totalValue - 1000;
        
        this.saveGameState();
        this.updateUI();
    }
    
    // 更新UI顯示
    updateUI() {
        // 這個方法會被Vue應用調用
        if (window.stockGameVue) {
            window.stockGameVue.updateFromGame(this.gameState, this.stockInfo, this.transactionHistory);
        }
    }
    
    // 買入股票
    buyStock(amount) {
        if (!amount || amount <= 0) {
            this.showGameStatus('請輸入有效的金額', 'error');
            return false;
        }
        
        if (amount > this.gameState.cashBalance) {
            this.showGameStatus('戶頭餘額不足', 'error');
            return false;
        }
        
        const shares = amount / this.stockInfo.currentPrice;
        this.gameState.cashBalance -= amount;
        this.gameState.shares += shares;
        
        // 記錄交易
        this.addTransaction('buy', amount);
        this.updateGameState();
        this.showGameStatus(`成功買入 ${shares.toFixed(4)} 股`, 'success');
        
        return true;
    }
    
    // 賣出股票
    sellStock(amount) {
        if (!amount || amount <= 0) {
            this.showGameStatus('請輸入有效的金額', 'error');
            return false;
        }
        
        const currentStockValue = this.gameState.shares * this.stockInfo.currentPrice;
        if (amount > currentStockValue) {
            this.showGameStatus('股票投資不足', 'error');
            return false;
        }
        
        const sharesToSell = amount / this.stockInfo.currentPrice;
        this.gameState.cashBalance += amount;
        this.gameState.shares -= sharesToSell;
        
        // 記錄交易
        this.addTransaction('sell', amount);
        this.updateGameState();
        this.showGameStatus(`成功賣出 ${sharesToSell.toFixed(4)} 股`, 'success');
        
        return true;
    }
    
    // 重置遊戲
    resetGame() {
        this.gameState = {
            cashBalance: 1000,
            stockInvestment: 0,
            shares: 0,
            currentPrice: this.stockInfo.currentPrice,
            totalValue: 1000,
            profitLoss: 0
        };
        
        this.transactionHistory = [];
        this.saveGameState();
        this.updateGameState();
        this.showGameStatus('遊戲已重置', 'info');
    }
    
    // 添加交易記錄
    addTransaction(type, amount) {
        const transaction = {
            id: Date.now(),
            type: type,
            amount: amount,
            price: this.stockInfo.currentPrice,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.transactionHistory.push(transaction);
        
        // 保持最近50筆記錄
        if (this.transactionHistory.length > 50) {
            this.transactionHistory.shift();
        }
    }
    
    // 顯示遊戲狀態消息
    showGameStatus(message, type = 'info') {
        if (window.stockGameVue) {
            window.stockGameVue.showStatus(message, type);
        }
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    // 綁定事件
    bindEvents() {
        // 頁面卸載時清理
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }
    
    // 清理資源
    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.chart) {
            this.chart.destroy();
        }
    }
    
    // 格式化數字
    formatNumber(num) {
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// 全局股票遊戲實例
window.stockGame = null;

// 當頁面載入完成後初始化股票遊戲
document.addEventListener('DOMContentLoaded', function() {
    // 延遲初始化，確保Vue應用已經掛載
    setTimeout(() => {
        if (document.getElementById('stockChart')) {
            window.stockGame = new StockGame();
        }
    }, 1000);
});
