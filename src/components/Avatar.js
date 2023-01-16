import React from 'react';
import './Avatar.css';

export default function Avatar({ name, github }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <a
      className="avatar"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(https://github.com/${github}.png)`,
        backgroundSize: 'cover',
      }}
      href={`https://github.com/${github}`}
      target="_blank"
      rel="noreferrer"
    >
      {initials}
    </a>
  );
}
