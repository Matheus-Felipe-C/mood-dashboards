import getHTML from './mood-embed';

const plugin = {
    appOption: {
        'Counter': {
            async run (app: any) {
                await app.openSidebarEmbed(1);
            }
        },
        'getMood': async function (app: any) {
                const from = Math.floor(Date.now() / 1000) - (60 * 60 * 24); // 1 day ago
                const moodRatings = await app.getMoodRatings(from);
                await app.alert("Mood ratings: " + JSON.stringify(moodRatings));
        }
    },

    renderEmbed(app: any, ...args: any) {
        return getHTML();
    }
}

export default plugin