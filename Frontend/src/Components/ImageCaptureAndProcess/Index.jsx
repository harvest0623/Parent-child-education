import React, { useState, useRef } from 'react'
import './Index.less'
import { useNavigate } from 'react-router-dom'

export default function Index({
    theme = 'default',
    title = 'AI 拍照识物',
    onRecognition,
    children
}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // 主题颜色配置（保留兼容旧主题，同时支持首页品牌色系）
    const themeConfig = {
        default: {
            primary: '#ff7a45',
            secondary: '#f5f5f5',
            loading: '#ff6b6b',
            voice: '#ffd166',
            gradient: ['#FF7A45', '#FF5E9C'],
            gradientSoft: ['#fef3e6', '#e6f7ff']
        },
        green: {
            primary: '#4caf50',
            secondary: '#f5f5f5',
            loading: '#4caf50',
            voice: '#4caf50',
            gradient: ['#00B894', '#00D2A0'],
            gradientSoft: ['#e8f5e8', '#fff3e0']
        },
        purple: {
            primary: '#6C5CE7',
            secondary: '#f5f5f5',
            loading: '#6C5CE7',
            voice: '#6C5CE7',
            gradient: ['#6C5CE7', '#8E7BFF'],
            gradientSoft: ['#ece9ff', '#f3efff']
        }
    };
    const currentTheme = themeConfig[theme] || themeConfig.default;

    const handleImageUpload = (e) => {
        // console.log(e.target.files[0]);
        const file = e.target.files[0];
        if (file) {
            // 将 file 对象转换成 url
            const imageUrl = URL.createObjectURL(file);
            // console.log(imageUrl);

            setSelectedImage(imageUrl);

            // ai 识别
            onRecognition(file);
        }
    }

    // 拍照
    const handleCamera = async () => {
        // 打开摄像头
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setTimeout(() => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');  // 创建二维画布
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // 停止视频流(摄像头)
            stream.getTracks().forEach(track => track.stop());

            // 将 canvas 转换为 blob 格式
            canvas.toBlob(blob => {
                if (blob) {
                    // console.log(blob);
                    const imageUrl = URL.createObjectURL(blob);
                    // console.log(imageUrl);
                    setSelectedImage(imageUrl);  // 预览图片
                    const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
                    console.log(file);

                    // ai 识别
                    onRecognition(file);
                }
            }, 'image/jpeg', 0.8);
        }, 1000);
    }

    // 清除预览
    const handleClear = () => {
        setSelectedImage(null);
        fileInputRef.current.value = null;
    }

    return (
        <div
            className='image-capture-root'
            style={{
                '--capture-primary': currentTheme.primary,
                '--capture-gradient': `linear-gradient(135deg, ${currentTheme.gradient[0]} 0%, ${currentTheme.gradient[1]} 100%)`
            }}
        >
            {/* 沉浸式渐变 Hero 头部 */}
            <header className='image-capture-header'>
                {/* 装饰光斑 */}
                <div className='image-capture-header__blob image-capture-header__blob--1'></div>
                <div className='image-capture-header__blob image-capture-header__blob--2'></div>
                <div className='image-capture-header__blob image-capture-header__blob--3'></div>

                {/* 浮动光点 */}
                <div className='image-capture-header__particles' aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className='image-capture-header__bar'>
                    <button
                        className='image-capture-header__back'
                        onClick={() => navigate(-1)}
                        aria-label="返回"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 6l-6 6 6 6" />
                        </svg>
                    </button>
                    <div className='image-capture-header__title-wrap'>
                        <span className='image-capture-header__eyebrow'>
                            <span className='image-capture-header__dot'></span>
                            AI · 智能识别
                        </span>
                        <h1 className='image-capture-header__title'>{title}</h1>
                    </div>
                    <div className="image-capture-header__placeholder"></div>
                </div>
            </header>

            <main className="image-capture-main">
                {/* 图片预览卡片 */}
                <section
                    className="image-capture-preview"
                    style={{
                        background: `radial-gradient(circle at 20% 20%, ${currentTheme.gradientSoft[0]} 0, transparent 35%),
                          radial-gradient(circle at 90% 10%, ${currentTheme.gradientSoft[1]} 0, transparent 40%),
                          #ffffff`
                    }}
                >
                    <div className="image-capture-preview__inner">
                        {
                            selectedImage ? (
                                <div className="image-capture-preview__image-container">
                                    <img src={selectedImage} alt="" className='image-capture-preview__image' />
                                    <button
                                        className='image-capture-preview__clear'
                                        onClick={handleClear}
                                        aria-label="清除图片"
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 6l12 12M18 6L6 18" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="image-capture-preview__placeholder">
                                    <div className="image-capture-preview__placeholder-icon">
                                        <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.2-2h6.6L16.8 6h2A2.5 2.5 0 0 1 21.3 8.5v9A2.5 2.5 0 0 1 18.8 20H5.5a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
                                            <circle cx="12" cy="13" r="3.6" />
                                            <circle cx="18" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
                                        </svg>
                                    </div>
                                    <p className="image-capture-preview__placeholder-text">点击下方按钮拍照或上传图片</p>
                                    <p className="image-capture-preview__placeholder-tip">支持 JPG / PNG · 建议光线充足、主体清晰</p>
                                </div>
                            )
                        }
                    </div>
                </section>

                {/* 操作按钮区 */}
                <section className="image-capture-actions">
                    <button
                        className='image-capture-btn image-capture-btn--primary'
                        onClick={handleCamera}
                    >
                        <span className="image-capture-btn__icon">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.2-2h6.6L16.8 6h2A2.5 2.5 0 0 1 21.3 8.5v9A2.5 2.5 0 0 1 18.8 20H5.5a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
                                <circle cx="12" cy="13" r="3.6" />
                            </svg>
                        </span>
                        <span>拍照</span>
                    </button>
                    <button
                        className='image-capture-btn image-capture-btn--secondary'
                        onClick={() => {
                            fileInputRef.current.click()
                        }}
                    >
                        <span className="image-capture-btn__icon">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 16V4M6 10l6-6 6 6" />
                                <path d="M4 20h16" />
                            </svg>
                        </span>
                        <span>上传图片</span>
                    </button>
                    <input
                        type="file"
                        accept='image/*'
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ opacity: 0, position: 'absolute', left: '-9999px' }}
                    />
                </section>

                {
                    children
                }
            </main>

            {/* 视频元素 */}
            <video ref={videoRef} />

            {/* 画布，用于绘制视频帧 */}
            <canvas ref={canvasRef} />
        </div>
    )
}
