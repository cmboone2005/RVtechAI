// Keys for localStorage
const KEYS = {
  OFFLINE_GUIDES: 'rv-assistant-offline-guides',
  ONLINE_STATUS: 'rv-assistant-online-status',
  SAVED_DIAGNOSTICS: 'rv-assistant-saved-diagnostics'
};

// Online status management
export function updateOnlineStatus(isOnline: boolean): void {
  localStorage.setItem(KEYS.ONLINE_STATUS, JSON.stringify({ isOnline, timestamp: Date.now() }));
  
  // Dispatch a custom event that components can listen to
  window.dispatchEvent(new CustomEvent('onlineStatusChanged', { detail: { isOnline } }));
}

export function getOnlineStatus(): boolean {
  try {
    const data = localStorage.getItem(KEYS.ONLINE_STATUS);
    return data ? JSON.parse(data).isOnline : navigator.onLine;
  } catch (error) {
    console.error('Error reading online status from localStorage:', error);
    return navigator.onLine;
  }
}

// Offline guides management
export function saveGuideForOffline(guide: any): void {
  try {
    const savedGuides = getOfflineGuides();
    
    // Check if the guide is already saved
    const existingIndex = savedGuides.findIndex(g => g.id === guide.id);
    
    if (existingIndex !== -1) {
      // Update existing guide
      savedGuides[existingIndex] = guide;
    } else {
      // Add new guide
      savedGuides.push(guide);
    }
    
    localStorage.setItem(KEYS.OFFLINE_GUIDES, JSON.stringify(savedGuides));
  } catch (error) {
    console.error('Error saving guide for offline use:', error);
  }
}

export function removeOfflineGuide(guideId: number): void {
  try {
    const savedGuides = getOfflineGuides();
    const updatedGuides = savedGuides.filter(guide => guide.id !== guideId);
    localStorage.setItem(KEYS.OFFLINE_GUIDES, JSON.stringify(updatedGuides));
  } catch (error) {
    console.error('Error removing offline guide:', error);
  }
}

export function getOfflineGuides(): any[] {
  try {
    const data = localStorage.getItem(KEYS.OFFLINE_GUIDES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading offline guides from localStorage:', error);
    return [];
  }
}

export function isGuideSavedOffline(guideId: number): boolean {
  try {
    const savedGuides = getOfflineGuides();
    return savedGuides.some(guide => guide.id === guideId);
  } catch (error) {
    console.error('Error checking if guide is saved offline:', error);
    return false;
  }
}

// Saved diagnostics management for offline use
export function saveDiagnosticOffline(diagnostic: any): void {
  try {
    const savedDiagnostics = getSavedDiagnostics();
    
    // Check if the diagnostic is already saved
    const existingIndex = savedDiagnostics.findIndex(d => d.id === diagnostic.id);
    
    if (existingIndex !== -1) {
      // Update existing diagnostic
      savedDiagnostics[existingIndex] = diagnostic;
    } else {
      // Add new diagnostic
      savedDiagnostics.push(diagnostic);
    }
    
    localStorage.setItem(KEYS.SAVED_DIAGNOSTICS, JSON.stringify(savedDiagnostics));
  } catch (error) {
    console.error('Error saving diagnostic for offline use:', error);
  }
}

export function removeSavedDiagnostic(diagnosticId: number): void {
  try {
    const savedDiagnostics = getSavedDiagnostics();
    const updatedDiagnostics = savedDiagnostics.filter(diagnostic => diagnostic.id !== diagnosticId);
    localStorage.setItem(KEYS.SAVED_DIAGNOSTICS, JSON.stringify(updatedDiagnostics));
  } catch (error) {
    console.error('Error removing saved diagnostic:', error);
  }
}

export function getSavedDiagnostics(): any[] {
  try {
    const data = localStorage.getItem(KEYS.SAVED_DIAGNOSTICS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading saved diagnostics from localStorage:', error);
    return [];
  }
}

// Function to clear all data (useful for logout)
export function clearAllData(): void {
  try {
    localStorage.removeItem(KEYS.OFFLINE_GUIDES);
    localStorage.removeItem(KEYS.SAVED_DIAGNOSTICS);
    // Do not clear online status
  } catch (error) {
    console.error('Error clearing local data:', error);
  }
}
