import '../Styles/MinePage.less'
import { useState, useRef, useEffect } from 'react'
import { List, Card, ActionSheet, ImageViewer, Button } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function MinePage() {
    const [visible, setVisible] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});

    const actions = [
        { text: '确认', key: 'confirm' }
    ]
    const handleLogout = () => {
        // 弹框
        setVisible(true);
    }

    useEffect(() => {
        // 从后端获取用户信息
        axios.get('api/auth/info')
            .then(res => {
                // console.log(res.data);
                setUserInfo({
                    ...userInfo,
                    avatar: res.data.avatar,
                    nickname: res.data.nickname,
                    phone: res.data.phone,
                    gender: res.data.gender === 1 ? '男' : '女'
                });
            })
    }, []);

    return (
        <div className="mine-page-root">
            <header className="mine-page-header">
                <div className="user-info">
                    <div className="user-avatar" onClick={() => {
                        if (userInfo.avatar) {
                            setPreviewVisible(true);
                        }
                    }}>
                        {
                            userInfo.avatar ? (
                                <img src={userInfo.avatar} alt="用户头像" />
                            ) : (
                                <i className="iconfont icon-zhanghao"></i>
                            )
                        }
                    </div>
                    <div className="user-details">
                        <h2>{userInfo.nickname || '用户昵称'}</h2>
                        <p>亲子教育 AI 助手</p>
                    </div>
                </div>
            </header>

            <div className="mine-page-content">
                <Card style={{
                    borderRadius: '16px'
                }}
                    title='我的内容' headerStyle={{ height: '60px' }}>
                    <List header={null}>
                        <List.Item prefix={<i className="iconfont icon-wodeshoucang"></i>} onClick={() => { }}>
                            我的收藏
                        </List.Item>
                        <List.Item prefix={<i className="iconfont icon-liulanlishi"></i>} onClick={() => { }}>
                            浏览历史
                        </List.Item>
                    </List>
                </Card>

                <Card style={{
                    borderRadius: '16px'
                }}
                    title='设置' headerStyle={{ height: '60px' }}>
                    <List header={null}>
                        <List.Item prefix={<i className="iconfont icon-zhanghao"></i>} onClick={() => { navigate('/AccountSetting') }}>
                            账号设置
                        </List.Item>
                        <List.Item prefix={<i className="iconfont icon-tongzhishezhi"></i>} onClick={() => { }}>
                            通知设置
                        </List.Item>
                        <List.Item prefix={<i className="iconfont icon-bangzhuzhongxin"></i>} onClick={() => { }}>
                            帮助中心
                        </List.Item>
                        <List.Item prefix={<i className="iconfont icon-tuichudenglu"></i>} onClick={handleLogout}>
                            退出登录
                        </List.Item>
                    </List>
                </Card>
            </div>

            <ActionSheet
                visible={visible}
                actions={actions}
                cancelText="取消"
                onClose={() => setVisible(false)}
                onAction={(action, index) => {
                    // console.log(action);
                    if (action.key === 'confirm') {
                        // 确认退出登录
                        setVisible(false);
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                }}
            />

            {/* 头像预览组件 */}
            <ImageViewer
                classNames={{
                    mask: 'customize-mask',
                    body: 'customize-body',
                }}
                image={userInfo.avatar}
                visible={previewVisible}
                onClose={() => {
                    setPreviewVisible(false)
                }}
            />
        </div>
    )
}