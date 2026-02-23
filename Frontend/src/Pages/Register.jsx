import React, { useState } from 'react'
import '../Styles/Register.less'

export default function Register() {
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [captchaCode, setCaptchaCode] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <form className='register-form' onSubmit={() => {}}>

            {/* 昵称输入框 */}
            <div className="register-form__group">
                <i className='iconfont icon-zhanghao'></i>
                <input
                    type="text"
                    placeholder='请输入昵称'
                    className='register-form__input'
                    value={nickname}
                    onChange={(e) => {
                        setNickname(e.target.value)
                    }}
                />
            </div>

            {/* 手机号输入框 */}
            <div className="register-form__group">
                <i className='iconfont icon-dianhua'></i>
                <input
                    type="text"
                    placeholder='请输入手机号'
                    className='register-form__input'
                    value={phone}
                    onChange={(e) => {
                        setPhone(e.target.value)
                    }}
                />
            </div>

            {/* 验证码输入框 */}
            <div className="register-form__group register-form__group--captcha">
                <i className='iconfont icon-yanzhengyanzhengma'></i>
                <input
                    type="text"
                    placeholder='请输入验证码'
                    className='register-form__input register-form__input--captcha'
                    value={captchaCode}
                    onChange={(e) => {
                        setCaptchaCode(e.target.value)
                    }}
                    maxLength={4}
                />
            </div>

            {/* 密码输入框 */}
            <div className="register-form__group">
                <i className='iconfont icon-mima'></i>
                <input
                    type="password"
                    placeholder='请设置密码'
                    className='register-form__input'
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
            </div>

            </form>
        </div>
    )
}