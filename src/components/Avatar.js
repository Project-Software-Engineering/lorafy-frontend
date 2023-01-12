import React from 'react';

const Avatar = ({ name, github, backgroundColor  }) => {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');

  const handleClick = () => {
    window.location.href = `https://github.com/${github}`
  }

  return (
    <div
    className="avatar"
    style={{
        width: '75px',
        height: '75px',
        backgroundColor: backgroundColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '30px',
        borderRadius: '50%',
        cursor: 'pointer',
        margin: '5px'
    }}
    onClick={handleClick}
    >
    {initials}
    </div>
  );
}

export default Avatar;
