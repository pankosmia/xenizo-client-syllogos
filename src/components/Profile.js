import React from 'react';
import { Link } from 'react-router-dom';

const Profile = ({ username, avatarUrl }) => (
    <div className="profile d-flex align-items-center justify-content-end">
        <Link to="/profile" className="text-dark text-decoration-none d-flex align-items-center">
            <h6 className="mb-0 me-2">Bienvenue {username} !</h6>
            {avatarUrl && (
                <img
                    src={avatarUrl}
                    alt={`${username}'s avatar`}
                    style={{ width: '80px', borderRadius: '50%' }}
                />
            )}
        </Link>
    </div>
);

export default Profile;
