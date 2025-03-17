// This file handles MediaSession API for Picture-in-Picture functionality
// MediaSession actions must use valid action types as defined in the MediaSession spec

if ('mediaSession' in navigator) {
  // List of valid MediaSession actions
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler
  const validActions = [
    'play',
    'pause',
    'seekbackward',
    'seekforward',
    'previoustrack',
    'nexttrack',
    'stop',
    'seekto'
    // Note: 'enterpictureinpicture' is NOT a valid MediaSessionAction
  ];

  // Set up handlers for each valid action
  validActions.forEach(action => {
    try {
      navigator.mediaSession.setActionHandler(action, null);
    } catch (error) {
      console.warn(`Warning: The media session action "${action}" is not supported.`);
    }
  });

  // For Picture-in-Picture functionality, use the Picture-in-Picture API directly
  // instead of trying to use it through MediaSession
  document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (document.pictureInPictureEnabled) {
        video.addEventListener('enterpictureinpicture', () => {
          console.log('Video entered picture-in-picture mode');
        });
        
        video.addEventListener('leavepictureinpicture', () => {
          console.log('Video left picture-in-picture mode');
        });
      }
    });
  });
} 