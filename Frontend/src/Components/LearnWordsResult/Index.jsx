import './Index.less'
import React, { useEffect, useRef, useState } from 'react'

export default function Index({ recognitionResult }) {
    const data = recognitionResult?.data || {};
    const audioElement = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setIsPlaying(false);
    }, [recognitionResult])

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
                <div className="learn-words-result result-container">
                    <div className="learn-words-result__header">
                        <h2>识别结果</h2>
                        <div className='learn-words-result__voice' onClick={handleVoicePlay}>
                            <i className='iconfont icon-yinliang-F' style={{ color: isPlaying ? '#4caf50' : '#515151' }}></i>
                        </div>
                    </div>
                    <div className="learn-words-result__content">
                        <div className='learn-words-result__word'>
                            <h4>单词</h4>
                            <p>{data?.word || '暂无单词'}</p>
                        </div>
                        <div className='learn-words-result__meaning'>
                            <h4>释义</h4>
                            <p>{data?.meaning || '暂无释义'}</p>
                        </div>
                        <div className='learn-words-result__example'>
                            <h4>例句</h4>
                            <p>{data?.example || '暂无例句'}</p>
                        </div>
                    </div>
                    <audio src={data?.audio_url || null} ref={audioElement}></audio>
                </div>
            )
        }
    </div>
}