// src/components/news/AuthorAvatar.tsx
import React from 'react';

interface AuthorAvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

/** "Dr. Elena Rostova" becomes "ER" (titles ending in a dot are skipped). */
const getInitials = (name: string) =>
  name
    .split(' ')
    .filter((part) => part && !part.endsWith('.'))
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const AuthorAvatar: React.FC<AuthorAvatarProps> = ({ name, size = 'sm' }) => {
  const sizeClass = size === 'md' ? 'h-12 w-12 text-sm' : 'h-8 w-8 text-[11px]';

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-pink-600 font-bold text-white ${sizeClass}`}
    >
      {getInitials(name)}
    </span>
  );
};