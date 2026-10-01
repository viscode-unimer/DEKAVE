/**
 * Video URL parser & embed helpers for YouTube and Instagram Reels
 */

export const parseVideo = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      type: 'none',
      id: '',
      embedUrl: '',
      thumbnailUrl: '',
      isShort: false,
      originalUrl: '',
    };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return {
      isValid: false,
      type: 'none',
      id: '',
      embedUrl: '',
      thumbnailUrl: '',
      isShort: false,
      originalUrl: '',
    };
  }

  // YouTube regular, short, youtu.be, embed
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    const isShort = /youtube\.com\/shorts\//i.test(trimmed);
    return {
      isValid: true,
      type: 'youtube',
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      isShort,
      originalUrl: trimmed,
    };
  }

  // Instagram Reel / Post
  const igMatch = trimmed.match(/instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    const id = igMatch[1];
    return {
      isValid: true,
      type: 'instagram',
      id,
      embedUrl: `https://www.instagram.com/reel/${id}/embed`,
      thumbnailUrl: '',
      isShort: true,
      originalUrl: trimmed,
    };
  }

  return {
    isValid: true,
    type: 'other',
    id: '',
    embedUrl: trimmed,
    thumbnailUrl: '',
    isShort: false,
    originalUrl: trimmed,
  };
};
