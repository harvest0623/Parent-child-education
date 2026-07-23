import './Index.less'
import React, { useRef, useState } from 'react'

export default function Index({ recognitionResult }) {
    // console.log(recognitionResult);
    const data = recognitionResult?.data || {};
    const audioElement = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [tracked, setTracked] = useState(recognitionResult);

    // 当识别结果变化时重置播放状态（React 推荐的"在渲染中调整 state"模式）
    if (recognitionResult !== tracked) {
        setTracked(recognitionResult);
        setIsPlaying(false);
    }

    const handleVoicePlay = () => {
        if (isPlaying) {
            audioElement.current?.pause();
            setIsPlaying(false);
        } else {
            audioElement.current?.play();
            setIsPlaying(true);
        }
    }

    return <div>
        {
            (
                <div className="object-recognition-result result-container">
                    <div className="object-recognition-result__decor object-recognition-result__decor--1"></div>
                    <div className="object-recognition-result__decor object-recognition-result__decor--2"></div>

                    <div className="object-recognition-result__header">
                        <div className="object-recognition-result__header-text">
                            <span className="object-recognition-result__eyebrow">
                                <span className="object-recognition-result__eyebrow-dot"></span>
                                AI 识别结果
                            </span>
                            <h2>识别结果</h2>
                        </div>
                        <button
                            className={`object-recognition-result__voice ${isPlaying ? 'is-playing' : ''}`}
                            onClick={handleVoicePlay}
                            aria-label={isPlaying ? '暂停语音' : '播放语音'}
                        >
                            {isPlaying ? (
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="6" y="5" width="4" height="14" rx="1" />
                                    <rect x="14" y="5" width="4" height="14" rx="1" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 5L6 9H2v6h4l5 4V5Z" />
                                    <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="object-recognition-result__content">
                        <div className='object-recognition-result__section object-recognition-result__description'>
                            <h4>
                                <span className="object-recognition-result__section-bar"></span>
                                物品介绍
                            </h4>
                            <p>{data?.image_description || '暂无介绍'}</p>
                        </div>
                        <div className='object-recognition-result__section object-recognition-result__safety'>
                            <h4>
                                <span className="object-recognition-result__section-bar object-recognition-result__section-bar--warning"></span>
                                安全提示
                            </h4>
                            <p>暂无安全提示</p>
                        </div>
                    </div>
                    <audio src={data?.audio_url || null} ref={audioElement}></audio>
                </div>
            )
        }
    </div>
}
