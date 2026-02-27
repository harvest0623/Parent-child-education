import ImageCaptureAndProcess from '../Components/ImageCaptureAndProcess/Index.jsx'
import axios from '../http'
import { Toast } from 'antd-mobile'
import { useState } from 'react'
import RecognitionResult from '../Components/RecognitionResult/Index.jsx'

// AI识物
export default function Recognition() {
    const [recognitionResult, setRecognitionResult] = useState(null);

    const realRecognition = async (file) => {
        try {
            // 将图片资源处理成 base64 
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (err) => reject(err);
            })

            // 向工作流发请求
            // 成功提示
            Toast.show({
                content: 'AI识别中...',
                duration: 0,
                icon: 'loading',
                maskClickable: false
            })

            const res = await axios.post('/api/coze/recognition', {
                img: dataUrl
            })

            Toast.clear();
            // console.log(res.data);
            
            setRecognitionResult(res.data);
        } catch (error) {

            // 失败提示
            Toast.show({
                content: error.message,
                duration: 2000,
                icon: 'fail',
            })
        }
    }

    return (
        <ImageCaptureAndProcess onRecognition={realRecognition}>
            {
                recognitionResult && (
                    <RecognitionResult recognitionResult={recognitionResult}></RecognitionResult>
                )
            }
        </ImageCaptureAndProcess>
    )
}