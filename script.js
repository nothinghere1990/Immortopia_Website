// 賽博克大富翁 - 主要腳本文件
const { createApp } = Vue;

const CyberpunkMonopolyApp = createApp({
    data() {
        return {
            mobileMenuOpen: false,
            swiper: null,
            currentSlide: 0,
            isLoading: false,
            isTransitioning: false,
            lastScrollTime: 0,
            // 股票遊戲相關數據
            stockGameActive: false,
            playerData: {
                cashBalance: 1000,
                stockInvestment: 0,
                shares: 0,
                totalValue: 1000,
                profitLoss: 0
            },
            stockInfo: {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                currentPrice: 150.00,
                change: 2.50,
                changePercent: 1.69,
                lastUpdate: '載入中...'
            },
            tradeAmount: '',
            transactionHistory: [],
            gameStatus: null,
            statusTimeout: null
        }
    },

    computed: {
        // 檢查是否可以買入
        canBuy() {
            const amount = parseFloat(this.tradeAmount);
            return amount > 0 && amount <= this.playerData.cashBalance;
        },

        // 檢查是否可以賣出
        canSell() {
            const amount = parseFloat(this.tradeAmount);
            return amount > 0 && amount <= this.playerData.stockInvestment;
        }
    },

    methods: {
        // 切換手機版選單
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },

        // 跳轉到指定的 slide（移除防抖動限制，允許快速點擊導航按鈕）
        goToSlide(index) {
            if (this.swiper && index >= 0 && index < 4) {
                // 直接執行轉場，不檢查 isTransitioning 狀態
                this.swiper.slideToLoop(index, this.swiper.params.speed);
                this.currentSlide = index;
            }
            this.mobileMenuOpen = false;
        },
        
        // 初始化 Swiper
        initSwiper() {
            this.swiper = new Swiper('.mySwiper', {
                direction: 'horizontal',
                loop: true,
                speed: 1000,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                // 確保轉場動畫順暢
                allowTouchMove: true,
                touchRatio: 1,
                touchAngle: 45,
                keyboard: {
                    enabled: true,
                },
                mousewheel: {
                    enabled: true,
                    forceToAxis: true,
                    sensitivity: 1,
                    releaseOnEdges: false,
                    thresholdDelta: 50,      // 降低觸發閾值讓滾輪更敏感
                    thresholdTime: 500       // 降低時間閾值
                },
                on: {
                    slideChangeTransitionStart: () => {
                        this.isTransitioning = true;
                    },
                    slideChangeTransitionEnd: (swiper) => {
                        // 在 loop 模式下使用 realIndex 來獲取真實的 slide 索引
                        this.currentSlide = swiper.realIndex;
                        this.onSlideChange();
                        this.isTransitioning = false;
                    },
                    slideChange: (swiper) => {
                        // 更新當前 slide 索引
                        this.currentSlide = swiper.realIndex;
                    },
                    init: () => {
                        // 初始化時設置正確的 currentSlide
                        this.currentSlide = this.swiper ? this.swiper.realIndex : 0;
                    }
                }
            });
        },
        
        // slide 切換事件處理
        onSlideChange() {
            // 可以在這裡添加頁面切換時的特殊邏輯
        },
        
        // 開始遊戲按鈕點擊事件
        startGame() {
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false;
                alert('遊戲即將開始！');
            }, 2000);
        },

        // 開始投資按鈕點擊事件
        startInvestment() {
            this.stockGameActive = true;
            this.showStatus('股票投資遊戲已啟動！', 'success');
        },

        // 股票遊戲相關方法
        buyStock() {
            const amount = parseFloat(this.tradeAmount);
            if (window.stockGame && window.stockGame.buyStock(amount)) {
                this.tradeAmount = '';
            }
        },

        sellStock() {
            const amount = parseFloat(this.tradeAmount);
            if (window.stockGame && window.stockGame.sellStock(amount)) {
                this.tradeAmount = '';
            }
        },

        resetGame() {
            if (window.stockGame) {
                window.stockGame.resetGame();
            }
        },

        // 從股票遊戲更新數據
        updateFromGame(gameState, stockInfo, transactionHistory) {
            this.playerData = { ...gameState };
            this.stockInfo = { ...stockInfo };
            this.transactionHistory = [...transactionHistory];
        },

        // 顯示遊戲狀態
        showStatus(message, type = 'info') {
            // 清除之前的通知
            if (this.statusTimeout) {
                clearTimeout(this.statusTimeout);
            }

            this.gameStatus = { message, type };

            // 3秒後自動清除通知
            this.statusTimeout = setTimeout(() => {
                this.gameStatus = null;
            }, 3000);
        },

        // 格式化數字
        formatNumber(num) {
            if (typeof num !== 'number') return '0.00';
            return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        
        // 處理鍵盤事件
        handleKeyboard(event) {
            if (this.isTransitioning || !this.swiper) return;

            switch(event.key) {
                case 'ArrowLeft':
                    this.swiper.slidePrev();
                    break;
                case 'ArrowRight':
                    this.swiper.slideNext();
                    break;
                case 'Home':
                    this.goToSlide(0);
                    break;
                case 'End':
                    this.goToSlide(3);
                    break;
            }
        },

        // 備用滑鼠滾輪處理（如果 Swiper 內建的不工作）
        handleMouseWheel(event) {
            if (!this.swiper || this.isTransitioning) return;

            const currentTime = Date.now();
            if (currentTime - this.lastScrollTime < 300) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
            const delta = event.deltaY || event.detail || event.wheelDelta;

            if (Math.abs(delta) < 30) return;

            this.lastScrollTime = currentTime;

            if (delta > 0) {
                this.swiper.slideNext();
            } else {
                this.swiper.slidePrev();
            }
        },



        // 初始化應用
        initApp() {
            document.addEventListener('keydown', this.handleKeyboard);
            window.addEventListener('resize', this.handleResize);

            // 添加備用滑鼠滾輪監聽器
            const swiperContainer = document.querySelector('.swiper');
            if (swiperContainer) {
                swiperContainer.addEventListener('wheel', this.handleMouseWheel.bind(this), { passive: false });
            }
        },

        // 處理視窗大小變化
        handleResize() {
            if (this.swiper) {
                this.swiper.update();
            }
        },

        // 清理資源
        cleanup() {
            document.removeEventListener('keydown', this.handleKeyboard);
            window.removeEventListener('resize', this.handleResize);

            // 移除備用滑鼠滾輪監聽器
            const swiperContainer = document.querySelector('.swiper');
            if (swiperContainer) {
                swiperContainer.removeEventListener('wheel', this.handleMouseWheel);
            }

            if (this.swiper) {
                this.swiper.destroy(true, true);
            }
        }
    },

    // 組件掛載後執行
    mounted() {
        this.initApp();
        // 設置全局Vue實例引用供股票遊戲使用
        window.stockGameVue = this;
        this.$nextTick(() => {
            setTimeout(() => {
                this.initSwiper();
            }, 100);
        });
    },

    // 組件卸載前執行
    beforeUnmount() {
        this.cleanup();
    }
});

// 掛載應用到 DOM
CyberpunkMonopolyApp.mount('#app');

// 工具函數
const Utils = {
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    generateId() {
        return Math.random().toString(36).substring(2, 11);
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    isMobile() {
        return window.innerWidth <= 768;
    }
};

window.CyberpunkMonopoly = {
    app: CyberpunkMonopolyApp,
    utils: Utils
};

// 頁面載入完成後的初始化
document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-spinner';
    loadingElement.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999';

    document.body.appendChild(loadingElement);

    setTimeout(() => {
        if (loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
    }, 1000);
});
