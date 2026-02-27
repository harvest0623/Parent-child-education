import './Index.less'
import React, { useEffect, useRef, useState } from 'react'

export default function Index({ recognitionResult }) {
    // console.log(recognitionResult);
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
                <div className="object-recognition-result result-container">
                    <div className="object-recognition-result__header">
                        <h2>识别结果</h2>
                        <div className='object-recognition-result__voice' onClick={handleVoicePlay}>
                            <i className='iconfont icon-yinliang-F' style={{ color: isPlaying ? '#ff7a45' : '#515151' }}></i>
                        </div>
                    </div>
                    <div className="object-recognition-result__content">
                        <div className='object-recognition-result__description'>
                            <h4>物品介绍</h4>
                            <p>{data?.image_description || '暂无介绍'}</p>
                        </div>
                        <div className='object-recognition-result__safety'>
                            <h4>安全提示</h4>
                            <p>暂无安全提示</p>
                        </div>
                    </div>
                    <audio src={data?.audio_url || null} ref={audioElement}></audio>
                </div>
            )
        }
    </div>
}