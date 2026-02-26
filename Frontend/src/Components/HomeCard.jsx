import { useNavigate } from 'react-router-dom'

export default function HomeCard({ item }) {
    const navigate = useNavigate();
    return (
        <div className="home-card">
            <div className="home-card__tag">{item.tag}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button
                className='home-btn home-btn--small'
                onClick={() => {
                    navigate(item.path)
                }}
            >进入</button>
        </div>
    )
}