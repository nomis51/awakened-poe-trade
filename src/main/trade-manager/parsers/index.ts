import { Offer } from '../models/Offer'
import en from './en'

interface Parser {
    incomingOffer: {
        validate: (text: string) => boolean,
        parse: (text: string, id: number) => Offer,
    },
    outgoingOffer: {
        validate: (text: string) => boolean,
        parse: (text: string, id: number) => Offer,
    },
}

interface Parsers {
    en: Parser
}

/**
 * Defines the way to parse different types messages/whispers/etc. based on the language
 */
export const parsing: Parsers = {
    en
}
