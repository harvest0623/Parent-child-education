import React from 'react'
import ImageCaptureAndProcess from '../Components/ImageCaptureAndProcess/Index.jsx'

// AI 识物
export default function Recognition() {
    const realRecognition = () => {
       
    }

    return (
        <ImageCaptureAndProcess onRecognition={realRecognition}></ImageCaptureAndProcess>
    )
}