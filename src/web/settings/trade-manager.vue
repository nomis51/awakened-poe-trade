<template>
  <div class="trade-manager-settings">
    <div class="max-w-md p-2">
      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{
            $t(
              "In your whispers, you can refer the item name with {item} and to the price with {price}."
            )
          }}
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t("Thanks whisper") }}
        </div>
        <div class="mb-4 flex">
          <input
            v-model="config.tradeManager.whispers.thanks"
            class="rounded bg-gray-900 px-1 w-full block mb-1 font-fontin-regular text-center"
          />
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t("Sold whisper") }}
        </div>
        <div class="mb-4 flex">
          <input
            v-model="config.tradeManager.whispers.sold"
            class="rounded bg-gray-900 px-1 w-full block mb-1 font-fontin-regular text-center"
          />
          <br />
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t("Busy whisper") }}
        </div>
        <div class="mb-4 flex">
          <input
            v-model="config.tradeManager.whispers.busy"
            class="rounded bg-gray-900 px-1 w-full block mb-1 font-fontin-regular text-center"
          />
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t("Sill interested whisper") }}
        </div>
        <div class="mb-4 flex">
          <input
            v-model="config.tradeManager.whispers.stillInterested"
            class="rounded bg-gray-900 px-1 w-full block mb-1 font-fontin-regular text-center"
          />
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t("Auto kick") }}
        </div>
        <div class="mb-4 flex">
          <ui-radio
            v-model="config.tradeManager.autoKick"
            :value="true"
            class="mr-4"
            >{{ $t("Yes") }}</ui-radio
          >
          <ui-radio
            v-model="config.tradeManager.autoKick"
            :value="false"
            class="mr-4"
            >{{ $t("No") }}</ui-radio
          >
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t('Automatically send "Thanks" whisper') }}
        </div>
        <div class="mb-4 flex">
          <ui-radio
            v-model="config.tradeManager.autoThanks"
            :value="true"
            class="mr-4"
            >{{ $t("Yes") }}</ui-radio
          >
          <ui-radio
            v-model="config.tradeManager.autoThanks"
            :value="false"
            class="mr-4"
            >{{ $t("No") }}</ui-radio
          >
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t("Auto whisper (for outgoing offers)") }}
        </div>
        <div class="mb-4 flex">
          <ui-radio
            v-model="config.tradeManager.autoWhisper"
            :value="true"
            class="mr-4"
            >{{ $t("Yes") }}</ui-radio
          >
          <ui-radio
            v-model="config.tradeManager.autoWhisper"
            :value="false"
            class="mr-4"
            >{{ $t("No") }}</ui-radio
          >
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t("New offer notification sound")
          }}<span class="bg-gray-200 text-gray-900 rounded px-1">{{
            $t("Restart required")
          }}</span>
        </div>
        <div class="mb-4 flex">
          <input
            v-model.trim="config.tradeManager.sounds.newOffer"
            class="rounded-l bg-gray-900 px-1 block w-full font-sans"
            placeholder="Audio file"
          />
          <input
            type="file"
            id="file"
            class="hidden"
            accept="audio/*"
            @input="handleFile($event, 'newOffer')"
          />
          <label
            class="text-gray-400 bg-gray-900 px-2 ml-px cursor-pointer"
            for="file"
            >{{ $t("Browse") }}</label
          >
          <button
            @click="config.tradeManager.sounds.newOffer = '(default)'"
            class="px-3 bg-gray-900 rounded-r mr-2"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t("The buyer has joined the area notification sound") }}
          <span class="bg-gray-200 text-gray-900 rounded px-1">{{
            $t("Restart required")
          }}</span>
        </div>
        <div class="mb-4 flex">
          <input
            v-model.trim="config.tradeManager.sounds.buyerJoined"
            class="rounded-l bg-gray-900 px-1 block w-full font-sans"
            placeholder="Audio file"
          />
          <input
            type="file"
            id="file"
            class="hidden"
            accept="audio/*"
            @input="handleFile($event, 'buyerJoined')"
          />
          <label
            class="text-gray-400 bg-gray-900 px-2 ml-px cursor-pointer"
            for="file"
            >{{ $t("Browse") }}</label
          >
          <button
            @click="config.tradeManager.sounds.buyerJoined = '(default)'"
            class="px-3 bg-gray-900 rounded-r mr-2"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="mb-2">
        <div class="flex-1 mb-1">
          {{ $t("Interface click sound effect") }}
          <span class="bg-gray-200 text-gray-900 rounded px-1">{{
            $t("Restart required")
          }}</span>
        </div>
        <div class="mb-4 flex">
          <input
            v-model.trim="config.tradeManager.sounds.uiClick"
            class="rounded-l bg-gray-900 px-1 block w-full font-sans"
            placeholder="Audio file"
          />
          <input
            type="file"
            id="file"
            class="hidden"
            accept="audio/*"
            @input="handleFile($event, 'uiClick')"
          />
          <label
            class="text-gray-400 bg-gray-900 px-2 ml-px cursor-pointer"
            for="file"
            >{{ $t("Browse") }}</label
          >
          <button
            @click="config.tradeManager.sounds.uiClick = '(default)'"
            class="px-3 bg-gray-900 rounded-r mr-2"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Config } from "@/web/Config";

export default {
  data: () => ({}),
  computed: {
    config() {
      return Config.store;
    },
  },
  methods: {
    handleFile(e, soundName) {
      console.log(soundName, e.target.files[0].path.replace(/\\/g, "/"));
      this.config.tradeManager.sounds[
        soundName
      ] = e.target.files[0].path.replace(/\\/g, "/");
    },
  },
};
</script>
