import { useNavigate } from 'react-router-dom'
import { saveScrollPosition, scrollToTop } from '../Utils/scrollManager.js'

export default function HomeCard({ item }) {
    const navigate = useNavigate();
    return (
        <div className="home-card">
            <div className="home-card__icon">
                <i className={`iconfont ${item.icon}`}></i>
            </div>
            <div className="home-card__tag">{item.tag}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button
                className='home-btn home-btn--small'
                onClick={() => {
                    saveScrollPosition('/home')
                    navigate(item.path)
                    scrollToTop()
                }}
            >进入</button>
        </div>
    )
}