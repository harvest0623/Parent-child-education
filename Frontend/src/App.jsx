import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import './Styles/App.less'

// 登录和注册页面组件   
const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <div className="app-root">
            <div className="cartoon-bg"></div>
            <div className="auth-card">
                <div className="auth-card-wrapper">
                    
                    <div className="auth-header">
                        <div className="auth-logo">logo</div>
                        <h1 className="auth-title">亲子教育·成长伴侣</h1>
                        <p className="auth-subtitle">专注 0-12 岁亲子教育，科学陪伴每一天</p>
                    </div>

                    <div className="slider-container">
                        <div className={`slider-button ${activeTab === 'register' ? 'slider-button--right' : ''}`}></div>
                        <div className="slider-tabs">
                            <button className={`slider-tab ${activeTab === 'login' ? 'slider-tab--active' : ''}`} onClick={() => { setActiveTab('login') }}>登录</button>
                            <button className={`slider-tab ${activeTab === 'register' ? 'slider-tab--active' : ''}`} onClick={() => { setActiveTab('register') }}>注册</button>
                        </div>
                    </div>

                    {/* 登录模块 */}

                    {
                        activeTab === 'login' ? <Login></Login> : <Register></Register>
                    }

                    <div className="social-login">
                        <div className="divider">
                            <div className="divider-line"></div>
                            <div className="divider-text">第三方账号登录</div>
                            <div className="divider-line"></div>
                        </div>

                        <div className="oauth-buttons">
                            <button className='oauth-buttons__btn oauth-buttons__btn--qq'>
                                <i className="iconfont icon-QQ"></i>
                            </button>

                            <button className='oauth-buttons__btn oauth-buttons__btn--wechat'>
                                <i className="iconfont icon-weixin"></i>
                            </button>

                            <button className='oauth-buttons__btn oauth-buttons__btn--weibo'>
                                <i className="iconfont icon-xinlangweibo"></i>
                            </button>
                        </div>

                        <div className="auth-footnote">
                            <p>
                                注册即表示您同意我们的
                                <a href="#" className="auth-footer-link">用户协议</a>
                                和
                                <a href="#" className="auth-footer-link">隐私政策</a>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<AuthPage />} />
            </Routes>
        </BrowserRouter>
    )
}