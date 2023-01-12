import React from 'react';
import './Avatar.css';

const Avatar = ({ name, github, backgroundColor  }) => {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');

  return (
    <a
    className="avatar"
    style={{
        backgroundColor: backgroundColor,
    }}
    href = {`https://github.com/${github}`}
    target = '_blank'
    >
    {initials}
    </a>
  );
}

export default Avatar;
