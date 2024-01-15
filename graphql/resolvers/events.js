const Event = require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },

    createEvent: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '65a3c31e41a955e776f6161c'
        });

        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);

            const creator = await User.findById('65a3c31e41a955e776f6161c');
            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
}