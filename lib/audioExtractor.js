/**
 * Extract the best audio URL from Dictionary API response
 * @param {Object} dictData Dictionary API response
 * @returns {string|null} Audio URL or null
 */
export function getAudioUrl(dictData) {
    // This function processes an already provided 'dictData' object, which is assumed
    // to be the result of a prior HTTP request to a Dictionary API.
    // It does not make any new HTTP requests itself; it only extracts information
    // from the data structure passed into it.
    if (!dictData || !dictData[0] || !dictData[0].phonetics) return null;

    // Prefer US English, then UK, then any
    const phonetics = dictData[0].phonetics;

    // 1. Try to find US audio
    const usAudio = phonetics.find(p => p.audio && p.audio.includes('-us.mp3'));
    if (usAudio) return usAudio.audio;

    // 2. Try to find UK audio
    const ukAudio = phonetics.find(p => p.audio && p.audio.includes('-uk.mp3'));
    if (ukAudio) return ukAudio.audio;

    // 3. Fallback to any audio
    const anyAudio = phonetics.find(p => p.audio && p.audio !== '');
    return anyAudio ? anyAudio.audio : null;
}
