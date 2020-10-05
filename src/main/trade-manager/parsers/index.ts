import { Offer } from '../models/Offer'
import en from './en'
import ru from './ru';

export interface OfferParserProcessor {
    validate: (text: string) => boolean,
    parse: (text: string, id: number) => Offer | null,
}

export interface EventParserProcessor {
    validate: (text: string) => boolean,
    parse: (text: string) => string,
}

export interface Parser {
    incomingOffer: OfferParserProcessor,
    outgoingOffer: OfferParserProcessor,
    tradeAccepted: EventParserProcessor,
    tradeCancelled: EventParserProcessor,
    playerJoined: EventParserProcessor
}

export interface Parsers {
    en: Parser,
    ru: Parser
}

/**
 * Defines the way to parse different types messages/whispers/etc. based on the language
 */
export const parsing: any = {
    en,
    ru
}
