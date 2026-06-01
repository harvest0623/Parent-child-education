import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Switch, Toast, SpinLoading } from 'antd-mobile'
import '../Styles/NotificationSetting.less'

const defaultSettings = {
    masterSwitch: true,
    systemNotification: true,
    activityNotification: true,
    commentReply: true,
    messageNotification: true,
    notificationSound: true,
    notificationVibrate: true
}

export default function NotificationSetting() {
    const navigate = useNavigate()
    const [settings, setSettings] = useState(defaultSettings)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        setLoading(true)
        try {
            const stored = localStorage.getItem('notificationSettings')
            if (stored) {
                setSettings(JSON.parse(stored))
            }
        } catch (error) {
            Toast.show({
                content: '加载设置失败',
                duration: 2000,
                icon: 'fail'
            })
        } finally {
            setLoading(false)
        }
    }

    const saveSettings = async (newSettings) => {
        setSaving(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 300))
            localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
            setSettings(newSettings)
            Toast.show({
                content: '设置已保存',
                duration: 1000,
                icon: 'success'
            })
        } catch (error) {
            Toast.show({
                content: '保存失败',
                duration: 2000,
                icon: 'fail'
            })
        } finally {
            setSaving(false)
        }
    }

    const handleToggle = (key) => {
        const newSettings = { ...settings, [key]: !settings[key] }
        
        if (key === 'masterSwitch' && !newSettings.masterSwitch) {
            newSettings.systemNotification = false
            newSettings.activityNotification = false
            newSettings.commentReply = false
            newSettings.messageNotification = false
        }
        
        if (key !== 'masterSwitch' && newSettings[key] && !newSettings.masterSwitch) {
            newSettings.masterSwitch = true
        }

        saveSettings(newSettings)
    }

    const notificationItems = [
        {
            key: 'systemNotification',
            label: '系统通知',
            description: '接收系统更新、维护等通知'
        },
        {
            key: 'activityNotification',
            label: '活动通知',
            description: '接收平台活动、优惠等通知'
        },
        {
            key: 'commentReply',
            label: '评论回复',
            description: '接收评论和回复的通知'
        },
        {
            key: 'messageNotification',
            label: '消息通知',
            description: '接收私信、@等消息通知'
        }
    ]

    const soundItems = [
        {
            key: 'notificationSound',
            label: '通知声音',
            description: '收到通知时播放提示音'
        },
        {
            key: 'notificationVibrate',
            label: '通知震动',
            description: '收到通知时震动提醒'
        }
    ]

    return (
        <div className="notification-setting">
            <header className='image-capture-header'>
                <button className='image-capture-header__back' onClick={() => navigate(-1)}>
                    <i className='iconfont icon-fanhui'></i>
                </button>
                <h1>通知设置</h1>
                <div className="image-capture-header__placeholder"></div>
            </header>

            {loading ? (
                <div className="loading-container">
                    <SpinLoading color="primary" />
                </div>
            ) : (
                <div className="notification-setting-content">
                    <div className="setting-section">
                        <div className="section-title">通知开关</div>
                        <List>
                            <List.Item
                                extra={
                                    <Switch
                                        checked={settings.masterSwitch}
                                        onChange={() => handleToggle('masterSwitch')}
                                        disabled={saving}
                                    />
                                }
                            >
                                <div className="setting-item">
                                    <div className="setting-label">消息通知总开关</div>
                                    <div className="setting-description">关闭后将不再接收任何通知</div>
                                </div>
                            </List.Item>
                        </List>
                    </div>

                    <div className="setting-section">
                        <div className="section-title">通知类型</div>
                        <List>
                            {notificationItems.map(item => (
                                <List.Item
                                    key={item.key}
                                    extra={
                                        <Switch
                                            checked={settings[item.key]}
                                            onChange={() => handleToggle(item.key)}
                                            disabled={saving || !settings.masterSwitch}
                                        />
                                    }
                                >
                                    <div className="setting-item">
                                        <div className="setting-label">{item.label}</div>
                                        <div className="setting-description">{item.description}</div>
                                    </div>
                                </List.Item>
                            ))}
                        </List>
                    </div>

                    <div className="setting-section">
                        <div className="section-title">提醒方式</div>
                        <List>
                            {soundItems.map(item => (
                                <List.Item
                                    key={item.key}
                                    extra={
                                        <Switch
                                            checked={settings[item.key]}
                                            onChange={() => handleToggle(item.key)}
                                            disabled={saving || !settings.masterSwitch}
                                        />
                                    }
                                >
                                    <div className="setting-item">
                                        <div className="setting-label">{item.label}</div>
                                        <div className="setting-description">{item.description}</div>
                                    </div>
                                </List.Item>
                            ))}
                        </List>
                    </div>

                    <div className="setting-tip">
                        提示：关闭总开关后，所有通知类型将被关闭
                    </div>
                </div>
            )}
        </div>
    )
}