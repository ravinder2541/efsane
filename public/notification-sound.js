/* Simple notification sound using Web Audio API */
(function() {
  'use strict';
  
  // Check if already loaded to prevent duplicate declarations
  if (typeof window !== 'undefined' && window.playNotificationSound) {
    return;
  }
  
  const createNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const beep = (frequency = 800, duration = 200) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      };
      
      // Play a pleasant notification sound (two beeps)
      beep(800, 150);
      setTimeout(() => beep(1000, 150), 200);
    } catch (error) {
      console.log('Audio notification not available:', error.message);
    }
  };

  if (typeof window !== 'undefined') {
    window.playNotificationSound = createNotificationSound;
  }
})();
