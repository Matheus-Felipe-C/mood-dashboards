/**
 * Generates an array of mock mood ratings.
 * @param count Number of mock entries to generate.
 * @param daysBack How far into the past (in days) the timestamps should span.
 */
export function generateMockMoods(count: number = 10, daysBack: number = 7) {
    const moodsPool = [
        { rating: 2, note: "Feeling amazing! Productive day, hit all my milestones." },
        { rating: 1, note: "Good day. Got a lot done and had a nice lunch." },
        { rating: 0, note: "Pretty neutral. Just grinding through routine tasks." },
        { rating: -1, note: "A bit tired and frustrated with some bugs today." },
        { rating: -2, note: "Exhausted. Burnt out and felt like procrastinating all afternoon." }
    ];

    const nowInSeconds = Math.floor(Date.now() / 1000);

    return Array.from({ length: daysBack }, (_, i) => {
        const randomTemplate = moodsPool[Math.floor(Math.random() * moodsPool.length)];
        const timestamp = nowInSeconds - i * 86400; // one entry per day, sequential
        return {
            uuid: crypto.randomUUID(),
            rating: randomTemplate.rating,
            note: randomTemplate.note,
            timestamp,
        };
    }).sort((a, b) => a.timestamp - b.timestamp);
}

export function generateMockTaskCounts(days: number): Map<string, number> {
    const counts = new Map<string, number>();
    const now = Math.floor(Date.now() / 1000);

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date((now - i * 86400) * 1000).toDateString(); 
        counts.set(date, Math.floor(Math.random() * 40 + 5));
    }

    return counts;
}