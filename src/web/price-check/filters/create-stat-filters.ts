import { ParsedItem, ItemRarity, ItemCategory } from '@/parser'
import { ItemModifier, ModifierType } from '@/parser/modifiers'
import { uniqueModFilterPartial } from './unique-roll'
import { rollToFilter } from './util'
import { StatFilter } from './interfaces'
import { filterPseudo } from './pseudo'
import { filterItemProp } from './pseudo/item-property'
import { getRollAsSingleNumber } from '@/parser/utils'
import { filterUniqueItemProp } from './pseudo/item-property-unique'

export interface FiltersCreationContext {
  readonly item: ParsedItem
  filters: Writeable<StatFilter>[]
  modifiers: ParsedItem['modifiers']
}

export function initUiModFilters (item: ParsedItem): StatFilter[] {
  if (item.rarity === ItemRarity.Unique && item.category === ItemCategory.Map) {
    return []
  }

  const ctx: FiltersCreationContext = {
    item,
    filters: [],
    modifiers: [...item.modifiers]
  }

  if (!item.isUnidentified) {
    if (item.rarity === ItemRarity.Unique) {
      filterUniqueItemProp(ctx)
    } else {
      filterItemProp(ctx)
      filterPseudo(ctx)
    }
  }

  ctx.filters.push(
    ...ctx.modifiers.map(mod => itemModToFilter(mod, item))
  )

  if (item.isUnidentified && item.rarity === ItemRarity.Unique) {
    ctx.filters = ctx.filters.filter(f => !f.hidden)
  }

  if (item.extra.veiled) {
    ctx.filters.forEach(filter => { filter.disabled = true })
  }

  finalFilterTweaks(ctx)

  return ctx.filters
}

export function itemModToFilter (mod: ItemModifier, item: ParsedItem) {
  const filter: Writeable<StatFilter> = {
    tradeId: mod.stat.types.find(type => type.name === mod.type)!.tradeId,
    statRef: mod.stat.ref,
    text: mod.stat.text,
    type: mod.type,
    option: mod.option,
    roll: undefined,
    disabled: true,
    min: undefined,
    max: undefined
  }
  if (mod.option) {
    return filter
  }

  if (
    item.rarity === ItemRarity.Unique &&
    mod.type !== ModifierType.Enchant
  ) {
    uniqueModFilterPartial(item, mod, filter)
  } else {
    itemModFilterPartial(mod, filter)
  }

  filterAdjustmentForNegate(mod, filter)

  return filter
}

function itemModFilterPartial (
  mod: ItemModifier,
  filter: Writeable<StatFilter>
) {
  if (!mod.values) {
    if (mod.condition) {
      filter.min = mod.condition.min
      filter.max = mod.condition.max
      filter.defaultMin = filter.min
      filter.defaultMax = filter.max
      filter.roll = filter.min || filter.max
    }
  } else {
    if (mod.type === 'enchant') {
      filter.roll = getRollAsSingleNumber(mod.values)
      filter.min = filter.roll
      filter.max = filter.roll
      filter.defaultMin = filter.roll
      filter.defaultMax = filter.roll
    } else {
      Object.assign(filter, rollToFilter(getRollAsSingleNumber(mod.values)))
    }
  }
}

function filterAdjustmentForNegate (
  mod: ItemModifier,
  filter: Writeable<StatFilter>
) {
  let negateFilter = false

  if (filter.boundMin != null && filter.boundMax != null) { // unique
    const sameSign = (Math.sign(filter.boundMin) === Math.sign(filter.boundMax))
    const isNegated = mod.negate
    const positiveMatcher = mod.statMatchers.find(matcher => matcher.negate !== isNegated)
    if (!sameSign && isNegated && positiveMatcher) {
      filter.text = positiveMatcher.string
    } else {
      filter.text = mod.string
      negateFilter = Boolean(mod.negate)
    }
  } else {
    filter.text = mod.string
    negateFilter = Boolean(mod.negate)
  }

  if (negateFilter) {
    filter.invert = true
    const raw = { ...filter }

    if (filter.boundMin != null && filter.boundMax != null) {
      filter.boundMin = -1 * raw.boundMax!
      filter.boundMax = -1 * raw.boundMin!
    }
    if (filter.defaultMin != null && filter.defaultMax != null) {
      filter.defaultMin = -1 * raw.defaultMax!
      filter.defaultMax = -1 * raw.defaultMin!
    }
    if (filter.min == null && filter.max == null && filter.defaultMax != null) {
      filter.min = -1 * (raw.defaultMax as number)
    } else {
      if (filter.max != null) {
        filter.min = -1 * (raw.max as number)
      }
      if (filter.min != null) {
        filter.max = -1 * (raw.min as number)
      }
    }
    if (filter.roll != null) {
      filter.roll = -1 * raw.roll!
    }
  } else {
    if (filter.min == null && filter.max == null && filter.defaultMin != null) {
      filter.min = filter.defaultMin
    }
  }

  if (mod.stat.inverted) {
    filter.invert = !filter.invert
  }
}

function finalFilterTweaks (ctx: FiltersCreationContext) {
  const { item } = ctx

  if (item.category === ItemCategory.ClusterJewel && item.rarity !== ItemRarity.Unique) {
    for (const filter of ctx.filters) {
      if (filter.type === 'enchant') {
        if (filter.statRef === '# Added Passive Skills are Jewel Sockets') {
          filter.hidden = 'Roll is not variable'
        }
        if (filter.statRef === 'Added Small Passive Skills grant: #') {
          filter.disabled = false
        }
        if (filter.statRef === 'Adds # Passive Skills') {
          // https://pathofexile.gamepedia.com/Cluster_Jewel#Optimal_passive_skill_amounts
          filter.disabled = false
          filter.min = undefined
          if (filter.max === 4) {
            filter.max = 5
          }
        }
      }
    }
  }

  if (item.category === ItemCategory.Map) {
    const isInfluenced = ctx.filters.find(filter => filter.statRef === 'Area is influenced by #')
    const isElderGuardian = ctx.filters.find(filter => filter.statRef === 'Map is occupied by #')
    if (isInfluenced && !isElderGuardian && isInfluenced.option!.tradeId === '2' /* TODO: hardcoded */) {
      const idx = ctx.filters.indexOf(isInfluenced)
      ctx.filters.splice(idx + 1, 0, {
        tradeId: ['map.no_elder_guardian'],
        text: 'Map is not occupied by Elder Guardian',
        statRef: 'Map is not occupied by Elder Guardian',
        disabled: false,
        type: 'implicit',
        min: undefined,
        max: undefined
      })
    }
    if (isInfluenced) {
      isInfluenced.disabled = false
    }
    if (isElderGuardian) {
      isElderGuardian.disabled = false
    }
  }
}
