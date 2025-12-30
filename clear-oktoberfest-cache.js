// Script to clear Oktoberfest popup from localStorage
// Run this in browser console or add to a cleanup script

if (typeof window !== 'undefined' && window.localStorage) {
  // Remove any oktoberfest-related localStorage items
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.toLowerCase().includes('oktoberfest')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`Removed localStorage key: ${key}`);
  });
  
  console.log('Oktoberfest popup localStorage cleared');
}

// Also clear any session storage
if (typeof window !== 'undefined' && window.sessionStorage) {
  const sessionKeysToRemove = [];
  
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.toLowerCase().includes('oktoberfest')) {
      sessionKeysToRemove.push(key);
    }
  }
  
  sessionKeysToRemove.forEach(key => {
    sessionStorage.removeItem(key);
    console.log(`Removed sessionStorage key: ${key}`);
  });
}