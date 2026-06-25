import getHTML from './mood-embed';

const plugin = {
    appOption: {
        'Mood as Heartbeat': {
            async run (app: any) {
                await app.openEmbed('mood');
                await app.navigate("https://www.amplenote.com/notes/plugins/" + app.context.pluginUUID);
            }
        },
        'Read your Days Back': {
            async run (app: any) {
                await app.openEmbed('readback');
                await app.navigate("https://www.amplenote.com/notes/plugins/" + app.context.pluginUUID);
            }
        },
        'Spiral Mood': {
            async run (app: any) {
                await app.openEmbed('spiral');
                await app.navigate("https://www.amplenote.com/notes/plugins/" + app.context.pluginUUID);
            }
        }
    },

    renderEmbed(app: any, ...args: any) {
        return getHTML();
    },

    async onEmbedCall(app: any, action: any, ...args: any) {
        switch (action) {
            // Selects which dashboard will be opened
            case 'getDashboard' : {
                return app.context.embedArgs?.[0] ?? 'mood';
            }

            // Gets the mood from days sent in the embed call
            case "getMoods": {
                const [days] = args;
                const fromDate = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
                const moodRatings = await app.getMoodRatings(fromDate);

                return moodRatings;
            };
            // Gets the completed tasks from today up to the day argument
            case "getCompletedTasks": {
                const [days] = args;
                const fromDate = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
                const toDate = Math.floor(Date.now() / 1000);
                const completedTasks = await app.getCompletedTasks(fromDate, toDate);

                return completedTasks;
            }
        }
    }
}

export default plugin