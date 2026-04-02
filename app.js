const appStateKey = 'wellnessApp';

function getAppState() {
    const saved = localStorage.getItem(appStateKey);
    let state = saved ? JSON.parse(saved) : null;
    
    // Seed data if empty
    if (!state || !state.moodHistory || state.moodHistory.length === 0) {
        state = state || { user: null, assessment: {} };
        const now = new Date();
        state.moodHistory = [
            { mood: 'okay', timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toLocaleString() }, // 4 days ago
            { mood: 'good', timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleString() }, // 3 days ago
            { mood: 'sad', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleString() }, // 2 days ago
            { mood: 'good', timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleString() }, // 1 day ago
            { mood: 'great', timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleString() } // 2 hours ago
        ];
        saveAppState(state);
    }
    return state;
}

function saveAppState(state) {
    localStorage.setItem(appStateKey, JSON.stringify(state));
}

function checkAuth(redirectBackToLogin = true) {
    const state = getAppState();
    if (redirectBackToLogin && !state.user) {
        window.location.href = 'login.html';
        return null;
    }
    return state;
}

function logout() {
    localStorage.removeItem(appStateKey);
    window.location.href = 'login.html';
}

// Setup common config for Tailwind and custom CSS via document writing if needed, but we provide it in each HTML.
