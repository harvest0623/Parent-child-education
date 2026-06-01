import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Switch, Avatar, ActionSheet, Toast, ImageViewer, Popup, Button, Input, SpinLoading } from 'antd-mobile'
import axios from '../Http'
import '../Styles/AccountSetting.less'

const actions = [
    { text: '从相册选择', key: 'select' }
]

export default function AccountSetting() {
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState('');
    const [nickname, setNickname] = useState('');
    const [account, setAccount] = useState('');
    const [gender, setGender] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleImage, setVisibleImage] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState('');
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [visiblePopupPassword, setVisiblePopupPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Toast.show({
                content: '请选择图片文件',
                duration: 2000,
                icon: 'fail'
            })
            return;
        }

        setVisibleImage(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPreviewAvatar(reader.result);
        };
    }

    const uploadAvatar = async () => {
        if (!previewAvatar) return;

        try {
            setUploading(true);

            if (previewAvatar.length > 1024 * 1024 * 4 / 3) {
                Toast.show({
                    content: '图片大小不能超过 1MB',
                    duration: 2000,
                    icon: 'fail'
                })
                return;
            }

            const params = {
                avatar: previewAvatar
            };

            const res = await axios.post('/api/auth/updateAvatar', params);

            Toast.show({
                content: res.data.message || '头像更新成功',
                duration: 2000,
                icon: 'success'
            })

            setVisibleImage(false);
            setAvatar(previewAvatar);
            fileInputRef.current.value = '';
        } catch (error) {
            Toast.show({
                content: error.response?.data?.message || error.message || '上传失败',
                duration: 2000,
                icon: 'fail'
            })
        } finally {
            setUploading(false);
        }
    }

    const updateNickname = async () => {
        if (!newNickname.trim()) {
            Toast.show({
                content: '昵称不能为空',
                duration: 1000,
                icon: 'fail'
            })
            return;
        }

        if (newNickname.trim().length < 2 || newNickname.trim().length > 20) {
            Toast.show({
                content: '昵称长度应为2-20个字符',
                duration: 1000,
                icon: 'fail'
            })
            return;
        }

        if (newNickname.trim() === nickname) {
            setVisiblePopup(false);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('/api/auth/updateNickname', {
                nickname: newNickname.trim()
            });

            Toast.show({
                content: res.data.message || '昵称更新成功',
                duration: 1000,
                icon: 'success',
                afterClose: () => {
                    setVisiblePopup(false);
                    setNickname(newNickname.trim());
                }
            })
        } catch (error) {
            Toast.show({
                content: error.response?.data?.message || error.message || '更新失败',
                duration: 1000,
                icon: 'fail'
            })
        } finally {
            setLoading(false);
        }
    }

    const updatePassword = async () => {
        if (!oldPassword.trim()) {
            Toast.show({
                content: '请输入旧密码',
                duration: 1000,
                icon: 'fail'
            })
            return;
        }

        if (!newPassword.trim()) {
            Toast.show({
                content: '请输入新密码',
                duration: 1000,
                icon: 'fail'
            })
            return;
        }

        if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
            Toast.show({
                content: '密码长度应为6-20个字符',
                duration: 1000,
                icon: 'fail'
            })
            return;
        }

        if (newPassword.trim() === oldPassword.trim()) {
            Toast.show({
                content: '新密码不能与旧密码相同',
                duration: 1000,
                icon: 'fail'
            })
            return;
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            Toast.show({
                content: '两次输入的密码不一致',
                duration: 1000,
                icon: 'fail'
            })
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('/api/auth/updatePassword', {
                oldPassword: oldPassword.trim(),
                newPassword: newPassword.trim()
            });

            Toast.show({
                content: res.data.message || '密码更新成功',
                duration: 1000,
                icon: 'success',
                afterClose: () => {
                    setVisiblePopupPassword(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                }
            })
        } catch (error) {
            Toast.show({
                content: error.response?.data?.message || error.message || '更新失败',
                duration: 1000,
                icon: 'fail'
            })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        axios.get('api/auth/info')
            .then(res => {
                setAvatar(res.data.avatar);
                setNickname(res.data.nickname);
                setNewNickname(res.data.nickname);
                setAccount(res.data.phone);
                setGender(res.data.gender === 1 ? '男' : '女');
            })
            .catch(error => {
                Toast.show({
                    content: '获取用户信息失败',
                    duration: 2000,
                    icon: 'fail'
                })
            })
            .finally(() => {
                setLoading(false);
            })
    }, []);

    return (
        <div className="account-setting">

            <header className='image-capture-header'>
                <button className='image-capture-header__back' onClick={() => navigate(-1)}>
                    <i className='iconfont icon-fanhui'></i>
                </button>
                <h1>账号设置</h1>
                <div className="image-capture-header__placeholder"></div>
            </header>

            {loading ? (
                <div className="loading-container">
                    <SpinLoading color="primary" />
                </div>
            ) : (
                <section className="account-setting-content">
                    <List>
                        <List.Item extra={<Switch defaultChecked />}>接收消息</List.Item>
                        
                        <List.Item extra={<Avatar style={{ '--border-radius': '50%' }} src={avatar} />} clickable onClick={() => setVisible(true)}>
                            头像
                        </List.Item>

                        <List.Item extra={nickname} clickable onClick={() => setVisiblePopup(true)}>
                            昵称
                        </List.Item>

                        <List.Item extra={gender} clickable>性别</List.Item>
                        <List.Item extra={account} clickable>账号</List.Item>

                        <List.Item extra='修改密码' clickable onClick={() => setVisiblePopupPassword(true)}>
                            密码
                        </List.Item>
                    </List>
                </section>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                accept="image/*"
            />

            <ActionSheet
                visible={visible}
                actions={actions}
                cancelText='取消'
                onClose={() => setVisible(false)}
                onAction={(action, index) => {
                    if (action.key === 'select') {
                        setVisible(false);
                        fileInputRef.current.click();
                    }
                }}
            />

            <ImageViewer
                classNames={{
                    mask: 'customize-mask',
                    body: 'customize-body',
                }}
                image={previewAvatar}
                visible={visibleImage}
                onClose={() => {
                    setVisibleImage(false)
                }}
                renderFooter={() => (
                    <div className='footer'>
                        <div className='footerButton' onClick={uploadAvatar}>
                            {uploading ? '上传中...' : '确认上传'}
                        </div>
                    </div>
                )}
            />

            <Popup
                visible={visiblePopup}
                showCloseButton
                onClose={() => setVisiblePopup(false)}
                afterShow={() => setNewNickname(nickname)}
                position='right'
            >
                <div className="update-nickname">
                    <div className="update-nickname__title">新昵称：</div>
                    <div className="update-nickname__input-container">
                        <Input
                            placeholder="请输入新昵称（2-20个字符）"
                            value={newNickname}
                            onChange={(val) => setNewNickname(val)}
                            maxLength={20}
                        />
                    </div>
                </div>
                <Button 
                    type='primary' 
                    block 
                    className='update-nickname__confirm' 
                    onClick={updateNickname}
                    loading={loading}
                    disabled={loading}
                >
                    确认
                </Button>
            </Popup>

            <Popup
                visible={visiblePopupPassword}
                showCloseButton
                onClose={() => setVisiblePopupPassword(false)}
                position='right'
            >
                <div className="update-password">
                    <div className="update-password__title">旧密码：</div>
                    <div className="update-password__input-container">
                        <Input
                            placeholder="请输入旧密码"
                            value={oldPassword}
                            onChange={(val) => setOldPassword(val)}
                            type="password"
                        />
                    </div>
                    <div className="update-password__title">新密码：</div>
                    <div className="update-password__input-container">
                        <Input
                            placeholder="请输入新密码（6-20个字符）"
                            value={newPassword}
                            onChange={(val) => setNewPassword(val)}
                            type="password"
                            maxLength={20}
                        />
                    </div>

                    <div className="update-password__title">确认新密码：</div>
                    <div className="update-password__input-container">
                        <Input
                            placeholder="请再次输入新密码"
                            value={confirmPassword}
                            onChange={(val) => setConfirmPassword(val)} 
                            type="password"
                            maxLength={20}
                        />
                    </div>
                    
                </div>
                <Button 
                    type='primary' 
                    block 
                    className='update-password__confirm' 
                    onClick={updatePassword}
                    loading={loading}
                    disabled={loading}
                >
                    确认
                </Button>
            </Popup>
        </div>
    )
}