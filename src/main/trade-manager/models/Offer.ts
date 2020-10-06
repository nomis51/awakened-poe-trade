import { TradeSchema } from '../store'

/**
 * Define the Offer class
 * Is a logical representation of a trading whisper
 */
export interface Offer {
  /**
   * Unique in-app ID
   */
  id: number;
  item: string;
  time: string;
  price: {
    value: string;
    currency: string;
    image: string;
  };
  player: string;
  league: string;
  location: {
    tab: string;
    left: string;
    top: string;
  }
}

export const toDbSchema = (offer:Offer)=>{
  return {
    time: new Date(offer.time),
    item: offer.item,
    price: `${offer.price.value} ${offer.price.currency}`,
    player: offer.player,
    league: offer.league,
    location: `tab: "${offer.location.tab}"; position: left ${offer.location.left}, top ${offer.location.top}`
  } as TradeSchema
}
