import '../styles/Login.less'
import { useState } from 'react'
import { Toast } from 'antd-mobile';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // 阻止表单默认提交行为

        // 检验账号格式是否正确
        const phoneRegex = /^1[3-9]\d{9}$/;
        const majorChineseEmailRegex = /^[a-zA-Z0-9._%+-]+@(?:qq\.com|163\.com|126\.com|sina\.(?:com|cn)|sohu\.com|yeah\.net|gmail\.com|hotmail\.com|outlook\.com|foxmail\.com|aliyun\.com)$/i;
        if (!phoneRegex.test(phone) && !majorChineseEmailRegex.test(phone)) {
            Toast.show({
                icon: 'fail',
                content: '请输入正确的账号'
            })
            return;
        }

        // 向后端发请求
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone,
                password
            })
        })
        console.log(res);
    }

    return (
        <div>
            <form className='auth-form' onSubmit={handleSubmit}>

                <div className="auth-form__group">
                    <i className='iconfont icon-zhanghao'></i>
                    <input
                        type="tel"
                        placeholder='请输入手机号或邮箱'
                        className='auth-form__input'
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value)
                        }}
                    />
                </div>

                <div className="auth-form__group">
                    <i className='iconfont icon-mima'></i>
                    <input
                        type="password"
                        placeholder='请输入密码'
                        className='auth-form__input'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </div>

                <div className="auth-form__forgot-wrapper">
                    <a href="#" className='auth-form__forgot'>忘记密码？</a>
                </div>

                <button disabled={loading} type='submit' className='auth-form__submit'>
                    {loading ? '登录中...' : '登录'}
                </button>

            </form>
        </div>
    )
}