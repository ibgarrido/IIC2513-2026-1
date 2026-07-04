import './Card.css';

export default function Card({ member, index }) {
    return (
        <div
            className="card animated-card"
            style={{ animationDelay: `${index * 0.2}s` }}
        >
            <div
                className="card-header"
                style={{ backgroundImage: `url('${member.image}')` }}
            >
                <div className="card-header-bar">
                    <a className="btn-message" href="#message">
                        <svg viewBox="0 0 16 16" className="bi bi-chat-dots-fill" fill="white" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                        </svg>
                    </a>
                </div>
                <div className="card-header-slanted-edge"></div>
            </div>

            <div className="card-body">
                <div className="titles-container">
                    <span className="name">{member.name}</span><br />
                    <span className="job-title"><u>{member.role}</u></span>
                </div>

                <div className="bio">{member.bio}</div>

                <div className="social-handle-container">
                    <span>{member.socialHandle}</span>
                </div>
            </div>

            <div className="card-footer">
                <div className="stats">
                    <div className="stat">
                        <span className="label">Diseños</span>
                        <span className="value">{member.stats.designs}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Commits</span>
                        <span className="value">{member.stats.commits}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Cafés</span>
                        <span className="value">{member.stats.coffees}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}