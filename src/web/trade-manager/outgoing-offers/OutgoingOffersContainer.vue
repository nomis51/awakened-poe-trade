<template>
  <div
    id="outgoing-offers-container"
    style="top: 50%; right: 20px; height: 50%; width: 15%; max-width: 20%; position: absolute; transform: translateY(-50%);"
    class="flex-grow flex h-full"
  >
    <table style="width: 100%">
      <template v-for="offer of offers">
        <tr>
          <td>
            <OutgoingOffer
              ref="offers"
              class="outgoing-offers"
              :key="offer.id"
              :offer="offer"
              @dismiss="dismiss(offer)"
              @joinHideout="sendJoinHideout(offer)"
              @tradeRequest="sendTradeRequest(offer)"
            />
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import { MainProcess } from "@/ipc/main-process-bindings";
import {
  NEW_outgoing_OFFER,
  TRADE_ACCEPTED,
  TRADE_CANCELLED,
  PLAYER_JOINED,
  NEW_OUTGOING_OFFER
} from "@/ipc/ipc-event";
import { Config } from "@/web/Config";

import OutgoingOffer from "./OutgoingOffer";

export default {
  components: {
    OutgoingOffer
  },
  created() {
    this.handleEvents();
  },
  data() {
    return {
      offers: []
    };
  },
  methods: {
    /**
     * Handles the events from the MainProcess
     */
    handleEvents() {
      /**
       * Any new outgoing offers from the clipboard
       */
      MainProcess.addEventListener(NEW_OUTGOING_OFFER, ({ detail: offer }) => {
        console.log("New outgoing offer", offer);
        this.offers.unshift(offer);
      });

      /**
       * Any "Trade accepted" message that might help removing completed offers
       */
      MainProcess.addEventListener(TRADE_ACCEPTED, () => {
        const offer = this.offers.find(o => o.hideoutJoined);

        if (Config.store.tradeManager.autoThanks) {
          if (offer) {
            MainProcess.sendThanksWhisper(offer, false);
            this.dismiss(offer);
          }
        }
      });
    },
    dismiss(offer) {
      const index = this.offers.findIndex(o => o.id === offer.id);

      if (index !== -1) {
        this.offers.splice(index, 1);
      }
    },
    sendJoinHideout(offer) {
      const index = this.offers.findIndex(o => o.id === offer.id);

      if (index !== -1) {
        this.offers[index].hideoutJoined = true;
      }

      MainProcess.sendJoinHideout(offer);
    },
    sendTradeRequest(offer) {
      const index = this.offers.findIndex(o => o.id === offer.id);

      if (index !== -1) {
        this.offers[index].tradeRequestSent = true;
      }

      MainProcess.sendTradeRequest(offer);
    }
  }
};
</script>

<style>
#outgoing-offers-container > table > tr {
  margin-bottom: 10px;
}

#outgoing-offers-container {
  max-height: 50%;
  overflow-y: scroll;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
