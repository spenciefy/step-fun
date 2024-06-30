import dayjs from 'dayjs';

import { EMOJI_BG_COLORS } from '../constants';

export const titleCase = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

export const formatDate = (date: string) => {
  const daysDiff = dayjs().diff(dayjs(date), 'day');
  if (daysDiff >= 7) {
    return dayjs(date).format('M/D/YY');
  } else if (daysDiff > 1) {
    return dayjs(date).format('dddd');
  } else if (daysDiff === 1) {
    return 'Yesterday';
  } else {
    return dayjs(date).format('h:mm A');
  }
};

export function timeAgo(isoDate: string): string {
  const now = new Date();
  const past = new Date(isoDate);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  let interval = Math.floor(diffInSeconds / 31536000);

  if (interval >= 1) {
    return `${interval} year${interval === 1 ? '' : 's'} ago`;
  }

  interval = Math.floor(diffInSeconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${interval === 1 ? '' : 's'} ago`;
  }

  interval = Math.floor(diffInSeconds / 604800);
  if (interval >= 1) {
    return `${interval} week${interval === 1 ? '' : 's'} ago`;
  }

  interval = Math.floor(diffInSeconds / 86400);
  if (interval >= 1) {
    return `${interval} day${interval === 1 ? '' : 's'} ago`;
  }

  interval = Math.floor(diffInSeconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${interval === 1 ? '' : 's'} ago`;
  }

  interval = Math.floor(diffInSeconds / 60);
  if (interval >= 1) {
    return `${interval} minute${interval === 1 ? '' : 's'} ago`;
  }

  return `${diffInSeconds} second${interval === 1 ? '' : 's'} ago`;
}

export const getColorForEmoji = (emoji: string) => {
  // use the emoji char code to get a color, deterministic for each emoji
  const emojiCharCode = emoji ? emoji.charCodeAt(0) : 0;
  const colorIndex = emojiCharCode % EMOJI_BG_COLORS.length;
  const color = EMOJI_BG_COLORS[colorIndex];
  return color;
};
