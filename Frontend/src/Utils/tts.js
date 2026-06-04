/**
 * TTS (Text-to-Speech) 语音朗读工具
 */

class TTSService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.onEndCallback = null;
        this.onErrorCallback = null;
    }

    /**
     * 检查浏览器是否支持TTS
     * @returns {boolean} 是否支持
     */
    isSupported() {
        return 'speechSynthesis' in window;
    }

    /**
     * 获取可用的语音列表
     * @returns {SpeechSynthesisVoice[]} 语音列表
     */
    getVoices() {
        return this.synth.getVoices();
    }

    /**
     * 获取中文语音
     * @returns {SpeechSynthesisVoice|null} 中文语音
     */
    getChineseVoice() {
        const voices = this.getVoices();
        // 优先选择中文语音
        return voices.find(voice => voice.lang.includes('zh')) || 
               voices.find(voice => voice.lang.includes('cmn')) || 
               voices[0] || 
               null;
    }

    /**
     * 朗读文本
     * @param {string} text - 要朗读的文本
     * @param {Object} options - 配置选项
     */
    speak(text, options = {}) {
        if (!this.isSupported()) {
            console.error('浏览器不支持语音合成');
            if (this.onErrorCallback) {
                this.onErrorCallback('浏览器不支持语音合成');
            }
            return;
        }

        // 停止当前朗读
        this.stop();

        const {
            rate = 1,      // 语速 (0.1 - 10)
            pitch = 1,     // 音高 (0 - 2)
            volume = 1,    // 音量 (0 - 1)
            voice = null,  // 语音
            lang = 'zh-CN', // 语言
        } = options;

        // 创建语音对象
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.rate = rate;
        this.utterance.pitch = pitch;
        this.utterance.volume = volume;
        this.utterance.lang = lang;

        // 设置语音
        if (voice) {
            this.utterance.voice = voice;
        } else {
            const chineseVoice = this.getChineseVoice();
            if (chineseVoice) {
                this.utterance.voice = chineseVoice;
            }
        }

        // 事件监听
        this.utterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
        };

        this.utterance.onend = () => {
            this.isPlaying = false;
            this.isPaused = false;
            if (this.onEndCallback) {
                this.onEndCallback();
            }
        };

        this.utterance.onerror = (event) => {
            this.isPlaying = false;
            this.isPaused = false;
            console.error('TTS错误:', event.error);
            if (this.onErrorCallback) {
                this.onErrorCallback(event.error);
            }
        };

        this.utterance.onpause = () => {
            this.isPaused = true;
        };

        this.utterance.onresume = () => {
            this.isPaused = false;
        };

        // 开始朗读
        this.synth.speak(this.utterance);
    }

    /**
     * 暂停朗读
     */
    pause() {
        if (this.isPlaying && !this.isPaused) {
            this.synth.pause();
            this.isPaused = true;
        }
    }

    /**
     * 恢复朗读
     */
    resume() {
        if (this.isPaused) {
            this.synth.resume();
            this.isPaused = false;
        }
    }

    /**
     * 停止朗读
     */
    stop() {
        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
    }

    /**
     * 切换播放/暂停状态
     */
    toggle() {
        if (this.isPlaying) {
            if (this.isPaused) {
                this.resume();
            } else {
                this.pause();
            }
        }
    }

    /**
     * 设置朗读结束回调
     * @param {Function} callback - 回调函数
     */
    onEnd(callback) {
        this.onEndCallback = callback;
    }

    /**
     * 设置错误回调
     * @param {Function} callback - 回调函数
     */
    onError(callback) {
        this.onErrorCallback = callback;
    }

    /**
     * 获取当前状态
     * @returns {Object} 状态信息
     */
    getStatus() {
        return {
            isSupported: this.isSupported(),
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
        };
    }
}

// 创建单例实例
const ttsService = new TTSService();

export default ttsService;