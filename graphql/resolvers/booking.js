const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (error) {
            throw error;
        }
    },

    bookEvent: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '65a3c31e41a955e776f6161c',
            event: fetchedEvent
        })

        const result = await booking.save();
        return transformBooking(result);
    },

    cancelBooking: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        
        try {
            const booking = await Booking.findOne({ _id: args.bookingId }).populate('event');
            const event = transformEvent(booking.event);

            await Booking.deleteOne({ _id: args.bookingId });
            return event;

        } catch (error) {
            throw error;
        }
    }
}