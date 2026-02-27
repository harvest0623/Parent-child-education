import React, { useState, useRef } from 'react'
import './Index.less'
import { useNavigate } from 'react-router-dom'

export default function Index({
    theme = 'default',
    onRecognition,
    recognitionResult,
    children
}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // 主题颜色配置
    const themeConfig = {
        default: {
            primary: '#ff7a45',
            secondary: '#f5f5f5',
            loading: '#ff6b6b',
            voice: '#ffd166',
            gradient: ['#fef3e6', '#e6f7ff']
        },
        green: {
            primary: '#4caf50',
            secondary: '#f5f5f5',
            loading: '#4caf50',
            voice: '#4caf50',
            gradient: ['#e8f5e8', '#fff3e0']
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

        // 方法二:
        // // 调用相机
        // navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        //     .then(stream => {
        //         const video = document.createElement('video');
        //         video.srcObject = stream;
        //         video.play();
        //
        //         // 等待视频加载完成
        //         video.onloadeddata = () => {
        //    
        //             // 创建 canvas 元素
        //             const canvas = document.createElement('canvas');
        //             canvas.width = video.videoWidth;
        //             canvas.height = video.videoHeight;
        //
        //             // 绘制视频帧到 canvas
        //             canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        //
        //             // 转换 canvas 内容为 base64 编码的图片
        //             const base64Image = canvas.toDataURL('image/jpeg');
        //
        //             // 关闭视频流
        //             stream.getTracks().forEach(track => track.stop());
        //
        //             // 设置选中的图片为拍照结果
        //             setSelectedImage(base64Image);
        //
        //             // ai 识别
        //             onRecognition(base64Image);
        //         };
        //     })
        //     .catch(err => {
        //         console.error('相机访问被拒绝或发生错误:', err);
        //     });
    }

    // 清除预览
    const handleClear = () => {
        setSelectedImage(null);
        fileInputRef.current.value = null;
    }
    
    return (
        <div className='image-capture-root'>
            <header className='image-capture-header'>
                <button className='image-capture-header__back' onClick={() => navigate(-1)}>
                    <i className='iconfont icon-fanhui'></i>
                </button>
                <h1>AI 拍照识物</h1>
                <div className="image-capture-header__placeholder"></div>
            </header>

            <main className="image-capture-main">
                <section className="image-capture-preview" style={{
                    background: `radial-gradi ent(circle at 20% 20%, ${currentTheme.gradient[0]} 0, transparent 35%),
                      radial-gradient(circle at 90% 10%, ${currentTheme.gradient[1]} 0, transparent 40%),
                      #ffffff`}}
                >                        {
                        selectedImage ? (
                            <div className="image-capture-preview__image-container">
                                <img src={selectedImage} alt="" className='image-capture-preview__image' />
                                <button className='image-capture-preview__clear' onClick={handleClear}>
                                    <i className="iconfont icon-qingchu"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="image-capture-preview__placeholder">
                                <i className='iconfont icon-image'></i>
                                <p>点击下方按钮拍照或上传图片</p>
                            </div>
                        )
                    }
                </section>

                <section className="image-capture-actions">
                    <button
                        className='image-capture-btn image-capture-btn--primary'
                        style={{ backgroundColor: currentTheme.primary }}
                        onClick={handleCamera}
                    >
                        <i className="iconfont icon-xiangji"></i>
                        拍照
                    </button>
                    <button
                        className='image-capture-btn image-capture-btn--secondary'
                        onClick={() => {
                            fileInputRef.current.click()
                        }}
                    >
                        <i className="iconfont icon-shangchuan"></i>
                        上传图片
                    </button>
                    <input
                        type="file"
                        accept='image/*'
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        // style={{ display: 'none' }}
                        style={{opacity: 0}}
                    />
                </section>

                {
                    children
                }
            </main>

            <video ref={videoRef}/>
            {/* 画布，用于绘制视频帧 */}
            <canvas ref={canvasRef} />
        </div>
    )
}