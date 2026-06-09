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
    const secondsinDay = 86400;
    const mockRatings = [];

    // Picks a random rating from the moodsPool and adds it throughout the days
    for (let i = 0; i < count; i++) {
        const randomTemplate = moodsPool[Math.floor(Math.random() * moodsPool.length)];

        const randomTimeOffset = Math.floor(Math.random() * daysBack * secondsinDay);
        const timestamp = nowInSeconds - randomTimeOffset;

        mockRatings.push({
            uuid: crypto.randomUUID(),
            rating: randomTemplate.rating,
            note: randomTemplate.note,
            timestamp: timestamp
        });
    }

    return mockRatings.sort((a, b) => a.timestamp - b.timestamp);
}