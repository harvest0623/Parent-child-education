import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Switch, Avatar, ActionSheet, Toast, ImageViewer, Popup, Button, Input } from 'antd-mobile'
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
    const fileInputRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];

        // 预览图片
        setVisibleImage(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPreviewAvatar(reader.result);
        };
    }

    const uploadAvatar = async () => {
        try {
            // 限制上传图片大小为 1MB
            if (previewAvatar.length > 1024 * 1024) {
                Toast.show({
                    content: '图片大小不能超过 1MB',
                    duration: 2000,
                    icon: 'fail'
                })
                return;
            }

            // 上传图片到后端
            const params = {
                avatar: previewAvatar
            };

            const res = await axios.post('/api/auth/updateAvatar', params);
            // console.log(res);

            Toast.show({
                content: res.data.message,
                duration: 2000,
                icon: 'success'
            })

            setVisibleImage(false);
            setAvatar(previewAvatar);
            fileInputRef.current.value = '';  // 保证下一次上传同一张图也会触发onChange
        } catch (error) {
            // console.log(error);
            
            Toast.show({
                content: error.message,
                duration: 2000,
                icon: 'fail'
            })
        }
    }

    const updateNickname = async () => {
        const res = await axios.post('/api/auth/updateNickname', {
            nickname: newNickname
        });
        // console.log(res);

        Toast.show({
            content: res.data.message,
            duration: 1000,
            icon: 'success',
            afterClose: () => {
                setVisiblePopup(false);
                setNickname(newNickname);
            }   
        })
    }

    const updatePassword = async () => {
        const res = await axios.post('/api/auth/updatePassword', {
            oldPassword,
            newPassword
        });
        // console.log(res);

        Toast.show({
            content: res.data.message,
            duration: 1000,
            icon: 'success',
            afterClose: () => {
                setVisiblePopupPassword(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }   
        })
    }

    useEffect(() => {
        // 从后端获取用户信息
        axios.get('api/auth/info')
            .then(res => {
                // console.log(res.data);
                setAvatar(res.data.avatar);
                setNickname(res.data.nickname);
                setNewNickname(res.data.nickname);
                setAccount(res.data.phone);
                setGender(res.data.gender === 1 ? '男' : '女');
            })
    }, []);

    return (
        <div className="account-setting">

            {/* 共用了 AI 识物组件的头部样式 */}
            <header className='image-capture-header'>
                <button className='image-capture-header__back' onClick={() => navigate(-1)}>
                    <i className='iconfont icon-fanhui'></i>
                </button>
                <h1>账号设置</h1>
                <div className="image-capture-header__placeholder"></div>
            </header>

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

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
            />

            <ActionSheet
                visible={visible}
                actions={actions}
                cancelText='取消'
                onClose={() => setVisible(false)}
                onAction={(action, index) => {
                    if (action.key === 'select') {
                        // 触发文件选择框
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
                            确认上传
                        </div>
                    </div>
                )}
            />

            {/* 修改昵称的弹窗 */}
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
                            placeholder="请输入新昵称"
                            value={newNickname}
                            onChange={(val) => setNewNickname(val)}
                        />
                    </div>
                </div>
                <Button type='primary' block className='update-nickname__confirm' onClick={updateNickname}>确认</Button>
            </Popup>

            {/* 修改密码的弹窗 */}
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
                        />
                    </div>
                    <div className="update-password__title">新密码：</div>
                    <div className="update-password__input-container">
                        <Input
                            placeholder="请输入新密码"
                            value={newPassword}
                            onChange={(val) => setNewPassword(val)}
                        />
                    </div>

                    {/* <div className="update-password__title">请确认新密码：</div>
                    <div className="update-password__input-container">
                        <Input
                            placeholder="请确认新密码"
                            value={confirmPassword}
                            onChange={(val) => setConfirmPassword(val)} 
                        />
                    </div> */}
                    
                </div>
                <Button type='primary' block className='update-password__confirm' onClick={updatePassword}>确认</Button>
            </Popup>
        </div>
    )
}