import Datastore from 'nedb-promises';

export interface TradeSchema {
    time: Date,
    item: string,
    price: string,
    player: string,
    league: string,
    location: string
}

class TradeStore {
    private db: Datastore;

    constructor() {
        const dbPath = `./apt-data/trades.db`;
        this.db = Datastore.create({
            filename: dbPath,
            timestampData: true
        });
    }

    public async create(data: TradeSchema): Promise<TradeSchema> {
        console.log('inserting')
       console.log(await this.db.insert(data));
        return data;
    }
}

export const tradeStore = new TradeStore();