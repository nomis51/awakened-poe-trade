import { normalizeCurrency, CURRENCY_TO_IMAGE } from '../Config'
import { Offer } from '../models/Offer'
import { strictMatch } from '../regex-executer'

export default {
    incomingOffer: {
        validate: (text: string) => false,
        parse: (text: string, id: number) => {
            const TIME_END_INDEX = 19
            const TIME_START_INDEX = 0
            const AT_FROM = '@From '
            const CHEV_SPACE = '> '
            const IN = ' in '
            const P_STASH_TAB = '(stash tab "'
            const POSITION_LEFT = '"; position: left '
            const TOP = ', top '
            const P = ')'

            // There are multiple whisper templates, so we need multiple parsing functions
            const reg1 = /@From .+:* Hi, I would like to buy your .+ listed for .+ in .+/gi
            function parse1(text: string) {
                const HI_I_WOULD_LIKE_TO_BUY_YOUR = ': Hi, I would like to buy your '
                const LISTED_FOR = ' listed for '

                const time = text.substring(TIME_START_INDEX, TIME_END_INDEX)

                let player = ''
                if (/@From <.+> .+: Hi/gi.test(text)) {
                    player = text.textBetween(CHEV_SPACE, HI_I_WOULD_LIKE_TO_BUY_YOUR)
                } else {
                    player = text.textBetween(AT_FROM, HI_I_WOULD_LIKE_TO_BUY_YOUR)
                }

                const item = text.textBetween(
                    HI_I_WOULD_LIKE_TO_BUY_YOUR,
                    LISTED_FOR
                )

                const price = text.textBetween(LISTED_FOR, IN)

                let currency = ''
                let priceImage = ''
                let priceValue = ''
                const priceSplit = price.split(' ')
                if (priceSplit && priceSplit.length == 2) {
                    currency = normalizeCurrency(priceSplit[1])
                    priceImage = CURRENCY_TO_IMAGE[currency]
                    priceValue = priceSplit[0]
                }

                // eslint-disable-next-line camelcase
                const p_stash_tab_index = text.indexOf(P_STASH_TAB)
                const league = text.substring(
                    text.indexOf(IN) + IN.length,
                    // eslint-disable-next-line camelcase
                    p_stash_tab_index !== -1 ? p_stash_tab_index : text.length
                )

                let tab = ''
                let left = ''
                let top = ''
                if (p_stash_tab_index !== -1) {
                    tab = text.textBetween(P_STASH_TAB, POSITION_LEFT)
                    left = text.textBetween(POSITION_LEFT, TOP, true, true)
                    top = text.textBetween(TOP, P, true, true)
                }

                return {
                    id,
                    player,
                    item,
                    time,
                    price: {
                        image: priceImage,
                        currency,
                        value: priceValue
                    },
                    league,
                    location: {
                        tab,
                        left,
                        top
                    }
                } as Offer
            }

            const reg2 = /@From .+:* Hi, I'd like to buy your .+ for my .+ in .+/gi
            function parse2(text: string) {
                const HI_ID_LIKE_TO_BUY_YOUR = ": Hi, I'd like to buy your "
                const FOR_MY = ' for my '

                const time = text.substring(TIME_START_INDEX, TIME_END_INDEX)

                let player = ''
                if (/@From <.+> .+: Hi/gi.test(text)) {
                    player = text.textBetween(CHEV_SPACE, HI_ID_LIKE_TO_BUY_YOUR)
                } else {
                    player = text.textBetween(AT_FROM, HI_ID_LIKE_TO_BUY_YOUR)
                }

                const item = text.textBetween(HI_ID_LIKE_TO_BUY_YOUR, FOR_MY)

                const price = text.textBetween(FOR_MY, IN)

                let currency = ''
                let priceImage = ''
                let priceValue = ''

                priceValue = price.substring(0, price.indexOf(' '))
                currency = normalizeCurrency(price.substring(price.indexOf(' ') + 1))
                priceImage = CURRENCY_TO_IMAGE[currency]

                // eslint-disable-next-line camelcase
                const p_stash_tab_index = text.indexOf(P_STASH_TAB)
                const league = text.substring(
                    text.indexOf(IN) + IN.length,
                    // eslint-disable-next-line camelcase
                    p_stash_tab_index !== -1 ? p_stash_tab_index : text.length
                )

                let tab = ''
                let left = ''
                let top = ''
                if (p_stash_tab_index !== -1) {
                    tab = text.textBetween(P_STASH_TAB, POSITION_LEFT)
                    left = text.textBetween(POSITION_LEFT, TOP, true, true)
                    top = text.textBetween(TOP, P, true, true)
                }

                return {
                    id: ++id,
                    player,
                    item,
                    time,
                    price: {
                        image: priceImage,
                        currency,
                        value: priceValue
                    },
                    league,
                    location: {
                        tab,
                        left,
                        top
                    }
                } as Offer
            }

            if (reg1.test(text)) {
                return parse1(text)
            } else if (reg2.test(text)) {
                return parse2(text)
            } else {
                return null
            }
        }
    },
    outgoingOffer: {
        validate: (text: string) => strictMatch(/@.+:* Здравствуйте, хочу купить у вас .+ за .+ в лиге .+/gi, text),
        parse: (text: string, id: number) => {
            const AT_FROM = '@'
            const IN = ' в лиге '
            const P_STASH_TAB = ' (секция "'
            const POSITION_LEFT = '"; позиция: '
            const TOP = ' столбец, '
            const P = ' ряд)'

            // There are multiple whisper templates, so we need multiple parsing functions
            const reg1 = /@.+:* Здравствуйте, хочу купить у вас .+ за .+ в лиге .+/gi
            function parse1(text: string) {
                const HI_I_WOULD_LIKE_TO_BUY_YOUR = ' Здравствуйте, хочу купить у вас '
                const LISTED_FOR = ' за '

                const player = text.textBetween(AT_FROM, HI_I_WOULD_LIKE_TO_BUY_YOUR)

                const item = text.textBetween(
                    HI_I_WOULD_LIKE_TO_BUY_YOUR,
                    LISTED_FOR
                )

                const price = text.textBetween(LISTED_FOR, IN)

                let currency = ''
                let priceImage = ''
                let priceValue = ''
                const priceSplit = price.split(' ')
                if (priceSplit && priceSplit.length == 2) {
                    currency = normalizeCurrency(priceSplit[1])
                    priceImage = CURRENCY_TO_IMAGE[currency]
                    priceValue = priceSplit[0]
                }

                // eslint-disable-next-line camelcase
                const p_stash_tab_index = text.indexOf(P_STASH_TAB)
                const league = text.substring(
                    text.indexOf(IN) + IN.length,
                    // eslint-disable-next-line camelcase
                    p_stash_tab_index !== -1 ? p_stash_tab_index : text.length
                )

                let tab = ''
                let left = ''
                let top = ''
                if (p_stash_tab_index !== -1) {
                    tab = text.textBetween(P_STASH_TAB, POSITION_LEFT)
                    left = text.textBetween(POSITION_LEFT, TOP, true, true)
                    top = text.textBetween(TOP, P, true, true)
                }

                const now = new Date()

                return {
                    id,
                    player,
                    item,
                    time: `${('0' + now.getHours()).slice(-2)}:${(
                        '0' + now.getMinutes()
                    ).slice(-2)}:${('0' + now.getSeconds()).slice(-2)}`,
                    price: {
                        image: priceImage,
                        currency,
                        value: priceValue
                    },
                    league,
                    location: {
                        tab,
                        left,
                        top
                    }
                } as Offer
            }

            if (reg1.test(text)) {
                return parse1(text)
            } else {
                return null
            }
        }
    },
    tradeAccepted: {
        validate: (text: string) => strictMatch(/Сделка принята/gi, text),
        parse: (text: string) => text
    },
    tradeCancelled: {
        validate: (text: string) => strictMatch(/Сделка отменена|Игрок не найден в этой области/gi, text),
        parse: (text: string) => text
    },
    playerJoined: {
        validate: (text: string) => strictMatch(/.+ присоединился к области/gi, text),
        parse: (text: string) =>
            text.substring(
                text.indexOf('] : ') + 4,
                text.indexOf(' присоединился к области')
            )
    }
}
