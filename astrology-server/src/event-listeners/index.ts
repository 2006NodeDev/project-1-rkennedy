import {EventEmitter} from "events"

//special node js object
//its purpose is to hold event listeners and to send event triggers to those listeners

//we can call the emit() to send an event
//any functions listening to that event on the emitter get triggered in order
export const expressEventEmitter = new EventEmitter()

//defines custom event (so we don't mistype it)
export const customExpressEvents = {
    NEW_USER: 'NEW_USER'
}

//call expressEventEmttier.emit(customExpressEvents.NEW_USER, newUser) in user services
//this lets other internal things know it's done with the listener