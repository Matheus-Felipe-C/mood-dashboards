import getHTML from './mood-embed';

const plugin = {
    appOption: {
        'Counter': {
            async run (app: any) {
                await app.openSidebarEmbed(1);
            }
        }
    },

    renderEmbed(app: any, ...args: any) {
        return getHTML();
    }
}

export default plugin