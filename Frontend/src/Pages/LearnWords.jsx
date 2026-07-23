import ImageCaptureAndProcess from '../Components/ImageCaptureAndProcess/Index.jsx'
import axios from '../Http'
import { Toast } from 'antd-mobile'
import { useState } from 'react'
import LearnWordsResult from '../Components/LearnWordsResult/Index.jsx'

export default function LearnWords() {
    const [recognitionResult, setRecognitionResult] = useState(null);

    const realRecognition = async (file) => {
        try {
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (err) => reject(err);
            })

            Toast.show({
                content: 'AI识别中...',
                duration: 0,
                icon: 'loading',
                maskClickable: false
            })

            const res = await axios.post('/api/coze/learn-words', {
                img: dataUrl
            })

            Toast.clear();
            
            setRecognitionResult(res.data);
        } catch (error) {
            Toast.show({
                content: error.message,
                duration: 2000,
                icon: 'fail',
            })
        }
    }

    return (
        <ImageCaptureAndProcess 
            theme="purple"
            title="拍照学单词"
            onRecognition={realRecognition}
        >
            {
                recognitionResult && (
                    <LearnWordsResult recognitionResult={recognitionResult}></LearnWordsResult>
                )
            }
        </ImageCaptureAndProcess>
    )
}