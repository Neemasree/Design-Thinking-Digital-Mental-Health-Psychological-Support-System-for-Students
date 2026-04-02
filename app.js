const appStateKey = 'wellnessApp';

function createDefaultState() {
    const now = new Date();
    return {
        user: null,
        assessment: {},
        moodHistory: [
            { mood: 'okay', timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toLocaleString(), source: 'seed' },
            { mood: 'good', timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleString(), source: 'seed' },
            { mood: 'sad', timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleString(), source: 'seed' },
            { mood: 'good', timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleString(), source: 'seed' },
            { mood: 'great', timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleString(), source: 'seed' }
        ],
        supportLog: [],
        analytics: {
            lastMoodDate: null,
            panicCount: 0,
            recommendationVersion: 1
        }
    };
}

function getAppState() {
    const saved = localStorage.getItem(appStateKey);
    let state = null;

    try {
        state = saved ? JSON.parse(saved) : null;
    } catch (error) {
        state = null;
    }

    if (!state || typeof state !== 'object') {
        state = createDefaultState();
        saveAppState(state);
        return state;
    }

    state.user = state.user || null;
    state.assessment = state.assessment || {};
    state.moodHistory = Array.isArray(state.moodHistory) ? state.moodHistory : [];
    state.supportLog = Array.isArray(state.supportLog) ? state.supportLog : [];
    state.analytics = state.analytics || { lastMoodDate: null, panicCount: 0, recommendationVersion: 1 };

    if (state.moodHistory.length === 0) {
        state.moodHistory = createDefaultState().moodHistory;
    }

    saveAppState(state);
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

function moodToScore(mood) {
    const map = { great: 5, good: 4, okay: 3, sad: 2, sick: 1, struggling: 2 };
    return map[mood] || 3;
}

function moodToLabel(mood) {
    const map = {
        great: 'Great',
        good: 'Good',
        okay: 'Okay',
        sad: 'Struggling',
        sick: 'Unwell',
        struggling: 'Struggling'
    };
    return map[mood] || 'Okay';
}

function recordMood(mood, source = 'daily-checkin') {
    const state = getAppState();
    state.moodHistory.push({ mood, timestamp: new Date().toLocaleString(), source });
    state.analytics.lastMoodDate = new Date().toISOString().split('T')[0];
    saveAppState(state);
    return state;
}

function getDailyCheckinStreak(moodHistory) {
    if (!Array.isArray(moodHistory) || moodHistory.length === 0) {
        return 0;
    }

    const daySet = new Set(
        moodHistory
            .map(item => {
                const date = new Date(item.timestamp);
                return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
            })
            .filter(Boolean)
    );

    let streak = 0;
    const cursor = new Date();

    while (true) {
        const key = cursor.toISOString().slice(0, 10);
        if (daySet.has(key)) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
            continue;
        }
        break;
    }

    return streak;
}

function analyzeState(state) {
    const moodHistory = state.moodHistory || [];
    const recent = moodHistory.slice(-7);
    const recentAverage = recent.length
        ? recent.reduce((sum, row) => sum + moodToScore(row.mood), 0) / recent.length
        : 3;

    const assessment = state.assessment || {};
    const stressWeight = {
        not_stressed: 0,
        moderately_stressed: 1,
        very_stressed: 2
    }[assessment.stress] || 1;

    const examWeight = {
        no_exams: 0,
        exams_soon: 1,
        exams_very_soon: 2
    }[assessment.exams] || 0;

    const challengeWeight = {
        no_challenges: 0,
        minor_challenges: 1,
        major_challenges: 2
    }[assessment.challenges] || 0;

    const moodRisk = recentAverage >= 4.2 ? 0 : recentAverage >= 3.2 ? 1 : 2;
    const panicWeight = state.analytics && state.analytics.panicCount > 0 ? 1 : 0;

    const riskScore = stressWeight + examWeight + challengeWeight + moodRisk + panicWeight;

    let riskLevel = 'Low';
    if (riskScore >= 6) {
        riskLevel = 'High';
    } else if (riskScore >= 3) {
        riskLevel = 'Moderate';
    }

    let behavior = 'Stable';
    if (recentAverage < 2.8) {
        behavior = 'Needs Attention';
    } else if (recentAverage > 4.1) {
        behavior = 'Resilient';
    }

    const emotionalState = recentAverage >= 4.2
        ? 'Positive and steady'
        : recentAverage >= 3.2
            ? 'Mixed but manageable'
            : 'Emotionally overloaded';

    const academicStress = assessment.exams === 'exams_very_soon' || assessment.stress === 'very_stressed'
        ? 'High academic load'
        : assessment.exams === 'exams_soon' || assessment.stress === 'moderately_stressed'
            ? 'Moderate academic pressure'
            : 'Low academic pressure';

    return {
        emotionalState,
        academicStress,
        behavior,
        riskLevel,
        riskScore,
        streak: getDailyCheckinStreak(moodHistory),
        recentAverage,
        latestMood: moodHistory.length ? moodHistory[moodHistory.length - 1].mood : 'okay'
    };
}

function getYouTubeRecommendations(assessment, analysis) {
    const highStress = assessment.stress === 'very_stressed' || analysis.riskLevel === 'High';
    const examFocus = assessment.exams === 'exams_very_soon' || assessment.exams === 'exams_soon';

    if (highStress) {
        return [
            {
                videoId: 'inpok4MKVLM',
                watchUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM',
                title: '5-Minute Meditation You Can Do Anywhere',
                caption: 'Quick grounding video for immediate calm and breath control.'
            },
            {
                videoId: '8VwufFen8QQ',
                watchUrl: 'https://www.youtube.com/watch?v=8VwufFen8QQ',
                title: 'Guided Breathing for Anxiety',
                caption: 'Structured breathing routine for high-stress moments.'
            }
        ];
    }

    if (examFocus) {
        return [
            {
                videoId: 'ukLnPbIffxE',
                watchUrl: 'https://www.youtube.com/watch?v=ukLnPbIffxE',
                title: 'Pomodoro Study Session for Focus',
                caption: 'Use a guided study timer to stay focused and reduce overwhelm.'
            },
            {
                videoId: 'IlU-zDU6aQ0',
                watchUrl: 'https://www.youtube.com/watch?v=IlU-zDU6aQ0',
                title: 'How to Study Effectively for Exams',
                caption: 'Simple exam-prep methods to improve retention and confidence.'
            }
        ];
    }

    return [
        {
            videoId: 'gKUL1VRSzlY',
            title: 'Featured Motivation Video',
            caption: 'Action-focused productivity guidance for everyday study habits.',
            watchUrl: 'https://youtu.be/gKUL1VRSzlY?si=-0NgizHhoKzxou5k'
        },
        {
            videoId: 'FWTNMzK9vG4',
            watchUrl: 'https://www.youtube.com/watch?v=FWTNMzK9vG4',
            title: 'How to Stop Procrastinating',
            caption: 'Action-focused productivity guidance for everyday study habits.'
        }
    ];
}

function buildPersonalizedPlan(state) {
    const analysis = analyzeState(state);
    const assessment = state.assessment || {};
    const videos = getYouTubeRecommendations(assessment, analysis);
    const tips = [];

    if (analysis.riskLevel === 'High') {
        tips.push('Take a 5-minute breathing break before restarting any task.');
        tips.push('Use the panic support button if your thoughts feel uncontrollable.');
        tips.push('Cut your task list to only 3 must-do items for today.');
    } else if (analysis.riskLevel === 'Moderate') {
        tips.push('Use a 25/5 Pomodoro cycle for the next 2 study rounds.');
        tips.push('Do one short movement break every 90 minutes.');
        tips.push('Message a peer or volunteer for accountability today.');
    } else {
        tips.push('Build momentum with one deep-work block in the morning.');
        tips.push('Track one gratitude note to keep your emotional baseline strong.');
        tips.push('Review tomorrow\'s top priority before ending the day.');
    }

    if (assessment.exams === 'exams_very_soon') {
        tips.push('Shift revision to active recall and past papers only.');
    }

    if (assessment.challenges === 'major_challenges') {
        tips.push('Add one trusted person check-in to your evening routine.');
    }

    const greeting = analysis.riskLevel === 'High'
        ? 'You are not alone. Today we will focus on calm, safety, and small wins.'
        : analysis.riskLevel === 'Moderate'
            ? 'You are handling pressure. Let\'s convert stress into a practical plan.'
            : 'You are in a stable zone. Keep the consistency going.';

    return {
        analysis,
        greeting,
        tips,
        videos
    };
}

function requestPanicSupport() {
    const state = getAppState();
    const volunteers = [
        { name: 'Anika', eta: '2 min', status: 'available' },
        { name: 'Rahul', eta: '4 min', status: 'available' },
        { name: 'Maya', eta: '6 min', status: 'busy' }
    ];

    const pick = volunteers[Math.floor(Math.random() * volunteers.length)];
    const connected = pick.status === 'available';

    state.analytics.panicCount = (state.analytics.panicCount || 0) + 1;
    state.supportLog.push({
        type: 'panic',
        timestamp: new Date().toLocaleString(),
        connected,
        volunteer: connected ? pick.name : null
    });
    saveAppState(state);

    if (connected) {
        return {
            connected: true,
            message: `Volunteer ${pick.name} is joining in about ${pick.eta}. Stay here, help is on the way.`
        };
    }

    return {
        connected: false,
        message: 'All volunteers are currently in active sessions. Start instant calming mode now: inhale 4s, hold 4s, exhale 6s for 5 cycles, then contact emergency numbers if needed.'
    };
}
