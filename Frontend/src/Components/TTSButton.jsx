import { useState, useEffect } from 'react'
import ttsService from '../Utils/tts'

/**
 * TTS语音朗读按钮组件
 * @param {Object} props
 * @param {string} props.text - 要朗读的文本
 * @param {string} props.className - 自定义类名
 * @param {Object} props.style - 自定义样式
 * @param {string} props.size - 按钮大小 ('small' | 'medium' | 'large')
 */
export default function TTSButton({ text, className = '', style = {}, size = 'medium' }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        // 设置回调
        ttsService.onEnd(() => {
            setIsPlaying(false);
            setIsPaused(false);
        });

        ttsService.onError(() => {
            setIsPlaying(false);
            setIsPaused(false);
        });

        // 清理
        return () => {
            ttsService.onEnd(null);
            ttsService.onError(null);
        };
    }, []);

    const handleClick = (e) => {
        e.stopPropagation();
        
        if (!text) return;

        if (isPlaying) {
            if (isPaused) {
                ttsService.resume();
                setIsPaused(false);
            } else {
                ttsService.pause();
                setIsPaused(true);
            }
        } else {
            ttsService.speak(text);
            setIsPlaying(true);
            setIsPaused(false);
        }
    };

    const handleStop = (e) => {
        e.stopPropagation();
        ttsService.stop();
        setIsPlaying(false);
        setIsPaused(false);
    };

    // 获取图标类名
    const getIconClass = () => {
        if (!isPlaying) return 'icon-laba';
        if (isPaused) return 'icon-zanting';
        return 'icon-bofang';
    };

    // 获取按钮大小样式
    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return { width: '28px', height: '28px', fontSize: '14px' };
            case 'large':
                return { width: '44px', height: '44px', fontSize: '22px' };
            default:
                return { width: '36px', height: '36px', fontSize: '18px' };
        }
    };

    return (
        <div 
            className={`tts-button ${isPlaying ? 'tts-button--playing' : ''} ${className}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', ...style }}
        >
            <button
                className="tts-button__btn"
                onClick={handleClick}
                style={{
                    ...getSizeStyle(),
                    border: 'none',
                    borderRadius: '50%',
                    background: isPlaying ? '#ff7a45' : '#f5f5f5',
                    color: isPlaying ? 'white' : '#666',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                }}
                title={isPlaying ? (isPaused ? '继续朗读' : '暂停朗读') : '朗读'}
            >
                <i className={`iconfont ${getIconClass()}`}></i>
            </button>
            
            {isPlaying && (
                <button
                    className="tts-button__stop"
                    onClick={handleStop}
                    style={{
                        width: '24px',
                        height: '24px',
                        border: 'none',
                        borderRadius: '50%',
                        background: '#ff6b6b',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        transition: 'all 0.2s ease',
                    }}
                    title="停止朗读"
                >
                    <i className="iconfont icon-tingzhi"></i>
                </button>
            )}
        </div>
    );
}