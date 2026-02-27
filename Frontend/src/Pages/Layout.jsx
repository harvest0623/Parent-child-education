import React, { useState } from 'react'
import '../Styles/Layout.less'
import { Outlet, useNavigate } from 'react-router-dom'

const tabs = [
    { id: 'home', path: '/home', name: '首页', icon: 'icon-shouye', },
    { id: 'ai', path: '/ai', name: 'AI小伙伴', icon: 'icon-Al-Chatbot', isHightLighted: true },
    { id: 'mine', path: '/mine', name: '我的', icon: 'icon-wode' }
]

export default function Layout() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(() => {
        // console.log(window.location.pathname);

        const res = tabs.filter((tab) => {
            return tab.path === window.location.pathname;
        })
        // console.log(res);
        
        return res[0] ? res[0].id : 'home';
    });
    
    return (
        <div className='layout'>
            <div className='layout-page'>
                {/* 凡是 layout 的二级路由都展示在这里 */}
                <Outlet></Outlet>
            </div>
            <div className="bottom-nav">
                {
                    tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={`bottom-nav__item ${tab.isHightLighted ? 'hightLighted' : ''} ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                navigate(tab.path);
                            }}
                        >
                            <div className="bottom-nav__icon-container">
                                <i className={`iconfont ${tab.icon}`}></i>
                            </div> 
                            <span className="bottom-nav__label">{tab.name}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}