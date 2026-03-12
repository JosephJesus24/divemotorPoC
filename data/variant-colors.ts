import type { ColorOption } from '@/types'

// ─── Colores oficiales por modelo/variante — especificación exacta de fabricante ─
// HEX, RGB y descripción de acabado bloqueados → la IA no puede interpretar libremente
// Cada color tiene finishDescription estricta para garantizar consistencia tonal

export interface VariantColorMap {
  [modelId: string]: {
    [variantId: string]: ColorOption[]
  }
}

// ─── Jeep Commander ──────────────────────────────────────────────────────────────

const COMMANDER_LIMITED: ColorOption[] = [
  {
    id: 'preto_carbon',
    label: 'Preto Carbon',
    hex: '#000000',
    prompt: 'Preto Carbon solid black',
    finishDescription:
      'Pure solid black with no metallic particles. ' +
      'High-gloss clear coat finish. ' +
      'Reflections must be deep and mirror-like. ' +
      'Absolute black tone — no gray, no blue, no brown undertone.',
  },
  {
    id: 'cinza_granite_bicolor',
    label: 'Cinza Granite Bicolor',
    hex: '#5b5b58',
    prompt: 'Cinza Granite Bicolor metallic gray',
    finishDescription:
      'Medium-dark warm gray metallic with fine aluminum particles. ' +
      'Glossy automotive finish with subtle olive undertone. ' +
      'RGB(91, 91, 88) — slightly warm neutral gray. ' +
      'Metallic sparkle visible under direct light only.',
  },
  {
    id: 'azul_jazz_bicolor',
    label: 'Azul Jazz Bicolor',
    hex: '#11264b',
    prompt: 'Azul Jazz Bicolor deep metallic blue',
    finishDescription:
      'Deep navy blue metallic with micro-fine blue-silver particles. ' +
      'RGB(17, 38, 75) — very dark saturated blue. ' +
      'Glossy high-depth finish. ' +
      'Must NOT shift toward purple, teal, or light blue.',
  },
  {
    id: 'prata_billet_bicolor',
    label: 'Prata Billet Bicolor',
    hex: '#868b8d',
    prompt: 'Prata Billet Bicolor metallic silver',
    finishDescription:
      'Medium metallic silver-gray with cool undertone. ' +
      'RGB(134, 139, 141) — balanced cool silver. ' +
      'Visible metallic flake under all lighting conditions. ' +
      'No warm/yellow tint. Clean neutral silver.',
  },
  {
    id: 'slash_gold_bicolor',
    label: 'Slash Gold Bicolor',
    hex: '#bcafa9',
    prompt: 'Slash Gold Bicolor pearl champagne',
    finishDescription:
      'Warm champagne pearl with pink-beige undertone. ' +
      'RGB(188, 175, 169) — muted warm rose-gold. ' +
      'Pearl finish with color-shift effect under angled light. ' +
      'Must NOT appear as plain beige or metallic gold.',
  },
  {
    id: 'branco_polar_bicolor',
    label: 'Branco Polar Bicolor',
    hex: '#f4f4f4',
    prompt: 'Branco Polar Bicolor pearl white',
    finishDescription:
      'Brilliant pearl white with micro-pearl particles. ' +
      'RGB(244, 244, 244) — near-pure white with subtle iridescence. ' +
      'Pearl effect visible as faint rainbow shimmer at edges. ' +
      'Must NOT appear as flat/matte white or cream.',
  },
]

const COMMANDER_OVERLAND: ColorOption[] = [
  {
    id: 'preto_carbon',
    label: 'Preto Carbon',
    hex: '#000000',
    prompt: 'Preto Carbon solid black',
    finishDescription:
      'Pure solid black with no metallic particles. ' +
      'High-gloss clear coat finish. ' +
      'Reflections must be deep and mirror-like. ' +
      'Absolute black tone — no gray, no blue, no brown undertone.',
  },
  {
    id: 'prata_billet_bicolor',
    label: 'Prata Billet Bicolor',
    hex: '#868b8d',
    prompt: 'Prata Billet Bicolor metallic silver',
    finishDescription:
      'Medium metallic silver-gray with cool undertone. ' +
      'RGB(134, 139, 141) — balanced cool silver. ' +
      'Visible metallic flake under all lighting conditions. ' +
      'No warm/yellow tint. Clean neutral silver.',
  },
  {
    id: 'azul_jazz_bicolor',
    label: 'Azul Jazz Bicolor',
    hex: '#11264b',
    prompt: 'Azul Jazz Bicolor deep metallic blue',
    finishDescription:
      'Deep navy blue metallic with micro-fine blue-silver particles. ' +
      'RGB(17, 38, 75) — very dark saturated blue. ' +
      'Glossy high-depth finish. ' +
      'Must NOT shift toward purple, teal, or light blue.',
  },
  {
    id: 'cinza_granite_bicolor',
    label: 'Cinza Granite Bicolor',
    hex: '#5b5b58',
    prompt: 'Cinza Granite Bicolor metallic gray',
    finishDescription:
      'Medium-dark warm gray metallic with fine aluminum particles. ' +
      'Glossy automotive finish with subtle olive undertone. ' +
      'RGB(91, 91, 88) — slightly warm neutral gray. ' +
      'Metallic sparkle visible under direct light only.',
  },
  {
    id: 'slash_gold_bicolor',
    label: 'Slash Gold Bicolor',
    hex: '#bcafa9',
    prompt: 'Slash Gold Bicolor pearl champagne',
    finishDescription:
      'Warm champagne pearl with pink-beige undertone. ' +
      'RGB(188, 175, 169) — muted warm rose-gold. ' +
      'Pearl finish with color-shift effect under angled light. ' +
      'Must NOT appear as plain beige or metallic gold.',
  },
  {
    id: 'branco_polar_bicolor',
    label: 'Branco Polar Bicolor',
    hex: '#f4f4f4',
    prompt: 'Branco Polar Bicolor pearl white',
    finishDescription:
      'Brilliant pearl white with micro-pearl particles. ' +
      'RGB(244, 244, 244) — near-pure white with subtle iridescence. ' +
      'Pearl effect visible as faint rainbow shimmer at edges. ' +
      'Must NOT appear as flat/matte white or cream.',
  },
]

const COMMANDER_BLACKHAWK: ColorOption[] = [
  {
    id: 'preto_carbon',
    label: 'Preto Carbon',
    hex: '#000000',
    prompt: 'Preto Carbon solid black',
    finishDescription:
      'Pure solid black with no metallic particles. ' +
      'High-gloss clear coat finish. ' +
      'Reflections must be deep and mirror-like. ' +
      'Absolute black tone — no gray, no blue, no brown undertone.',
  },
  {
    id: 'azul_jazz_bicolor',
    label: 'Azul Jazz Bicolor',
    hex: '#11264b',
    prompt: 'Azul Jazz Bicolor deep metallic blue',
    finishDescription:
      'Deep navy blue metallic with micro-fine blue-silver particles. ' +
      'RGB(17, 38, 75) — very dark saturated blue. ' +
      'Glossy high-depth finish. ' +
      'Must NOT shift toward purple, teal, or light blue.',
  },
  {
    id: 'cinza_granite_bicolor',
    label: 'Cinza Granite Bicolor',
    hex: '#5b5b58',
    prompt: 'Cinza Granite Bicolor metallic gray',
    finishDescription:
      'Medium-dark warm gray metallic with fine aluminum particles. ' +
      'Glossy automotive finish with subtle olive undertone. ' +
      'RGB(91, 91, 88) — slightly warm neutral gray. ' +
      'Metallic sparkle visible under direct light only.',
  },
  {
    id: 'cinza_sting_bicolor',
    label: 'Cinza Sting Bicolor',
    hex: '#7d818a',
    prompt: 'Cinza Sting Bicolor pearl gray-blue',
    finishDescription:
      'Cool blue-gray pearl with subtle metallic sheen. ' +
      'RGB(125, 129, 138) — medium gray with distinct blue undertone. ' +
      'Pearl particles create depth under angled light. ' +
      'Must NOT appear as neutral gray — blue shift is characteristic.',
  },
  {
    id: 'branco_polar_bicolor',
    label: 'Branco Polar Bicolor',
    hex: '#f4f4f4',
    prompt: 'Branco Polar Bicolor pearl white',
    finishDescription:
      'Brilliant pearl white with micro-pearl particles. ' +
      'RGB(244, 244, 244) — near-pure white with subtle iridescence. ' +
      'Pearl effect visible as faint rainbow shimmer at edges. ' +
      'Must NOT appear as flat/matte white or cream.',
  },
]

// ─── Jeep Renegade ──────────────────────────────────────────────────────────────

const RENEGADE_SPORT: ColorOption[] = [
  {
    id: 'preto_carbon',
    label: 'Preto Carbon',
    hex: '#000000',
    prompt: 'Preto Carbon solid black',
    finishDescription:
      'Pure solid black with no metallic particles. ' +
      'High-gloss clear coat finish. ' +
      'Reflections must be deep and mirror-like. ' +
      'Absolute black tone — no gray, no blue, no brown undertone.',
  },
  {
    id: 'azul_jazz',
    label: 'Azul Jazz',
    hex: '#11264b',
    prompt: 'Azul Jazz deep metallic blue',
    finishDescription:
      'Deep navy blue metallic with micro-fine blue-silver particles. ' +
      'RGB(17, 38, 75) — very dark saturated blue. ' +
      'Glossy high-depth finish. ' +
      'Must NOT shift toward purple, teal, or light blue.',
  },
  {
    id: 'cinza_granite',
    label: 'Cinza Granite',
    hex: '#5b5b58',
    prompt: 'Cinza Granite metallic gray',
    finishDescription:
      'Medium-dark warm gray metallic with fine aluminum particles. ' +
      'Glossy automotive finish with subtle olive undertone. ' +
      'RGB(91, 91, 88) — slightly warm neutral gray. ' +
      'Metallic sparkle visible under direct light only.',
  },
  {
    id: 'branco_polar',
    label: 'Branco Polar',
    hex: '#f4f4f4',
    prompt: 'Branco Polar pearl white',
    finishDescription:
      'Brilliant pearl white with micro-pearl particles. ' +
      'RGB(244, 244, 244) — near-pure white with subtle iridescence. ' +
      'Pearl effect visible as faint rainbow shimmer at edges. ' +
      'Must NOT appear as flat/matte white or cream.',
  },
]

const RENEGADE_LONGITUDE: ColorOption[] = [
  {
    id: 'preto_carbon',
    label: 'Preto Carbon',
    hex: '#000000',
    prompt: 'Preto Carbon solid black',
    finishDescription:
      'Pure solid black with no metallic particles. ' +
      'High-gloss clear coat finish. ' +
      'Reflections must be deep and mirror-like. ' +
      'Absolute black tone — no gray, no blue, no brown undertone.',
  },
  {
    id: 'azul_jazz',
    label: 'Azul Jazz',
    hex: '#11264b',
    prompt: 'Azul Jazz deep metallic blue',
    finishDescription:
      'Deep navy blue metallic with micro-fine blue-silver particles. ' +
      'RGB(17, 38, 75) — very dark saturated blue. ' +
      'Glossy high-depth finish. ' +
      'Must NOT shift toward purple, teal, or light blue.',
  },
  {
    id: 'cinza_granite',
    label: 'Cinza Granite',
    hex: '#5b5b58',
    prompt: 'Cinza Granite metallic gray',
    finishDescription:
      'Medium-dark warm gray metallic with fine aluminum particles. ' +
      'Glossy automotive finish with subtle olive undertone. ' +
      'RGB(91, 91, 88) — slightly warm neutral gray. ' +
      'Metallic sparkle visible under direct light only.',
  },
  {
    id: 'branco_polar',
    label: 'Branco Polar',
    hex: '#f4f4f4',
    prompt: 'Branco Polar pearl white',
    finishDescription:
      'Brilliant pearl white with micro-pearl particles. ' +
      'RGB(244, 244, 244) — near-pure white with subtle iridescence. ' +
      'Pearl effect visible as faint rainbow shimmer at edges. ' +
      'Must NOT appear as flat/matte white or cream.',
  },
  {
    id: 'cinza_sting',
    label: 'Cinza Sting',
    hex: '#7d818a',
    prompt: 'Cinza Sting pearl gray-blue',
    finishDescription:
      'Cool blue-gray pearl with subtle metallic sheen. ' +
      'RGB(125, 129, 138) — medium gray with distinct blue undertone. ' +
      'Pearl particles create depth under angled light. ' +
      'Must NOT appear as neutral gray — blue shift is characteristic.',
  },
]

// ─── Jeep Compass ───────────────────────────────────────────────────────────────

const COMPASS_SPORT: ColorOption[] = [
  {
    id: 'preto_carbon',
    label: 'Preto Carbon',
    hex: '#000000',
    prompt: 'Preto Carbon solid black',
    finishDescription:
      'Pure solid black with no metallic particles. ' +
      'High-gloss clear coat finish. ' +
      'Reflections must be deep and mirror-like. ' +
      'Absolute black tone — no gray, no blue, no brown undertone.',
  },
  {
    id: 'azul_jazz',
    label: 'Azul Jazz',
    hex: '#11264b',
    prompt: 'Azul Jazz deep metallic blue',
    finishDescription:
      'Deep navy blue metallic with micro-fine blue-silver particles. ' +
      'RGB(17, 38, 75) — very dark saturated blue. ' +
      'Glossy high-depth finish. ' +
      'Must NOT shift toward purple, teal, or light blue.',
  },
  {
    id: 'cinza_granite',
    label: 'Cinza Granite',
    hex: '#5b5b58',
    prompt: 'Cinza Granite metallic gray',
    finishDescription:
      'Medium-dark warm gray metallic with fine aluminum particles. ' +
      'Glossy automotive finish with subtle olive undertone. ' +
      'RGB(91, 91, 88) — slightly warm neutral gray. ' +
      'Metallic sparkle visible under direct light only.',
  },
  {
    id: 'prata_billet',
    label: 'Prata Billet',
    hex: '#868b8d',
    prompt: 'Prata Billet metallic silver',
    finishDescription:
      'Medium metallic silver-gray with cool undertone. ' +
      'RGB(134, 139, 141) — balanced cool silver. ' +
      'Visible metallic flake under all lighting conditions. ' +
      'No warm/yellow tint. Clean neutral silver.',
  },
  {
    id: 'branco_polar',
    label: 'Branco Polar',
    hex: '#f4f4f4',
    prompt: 'Branco Polar pearl white',
    finishDescription:
      'Brilliant pearl white with micro-pearl particles. ' +
      'RGB(244, 244, 244) — near-pure white with subtle iridescence. ' +
      'Pearl effect visible as faint rainbow shimmer at edges. ' +
      'Must NOT appear as flat/matte white or cream.',
  },
]

const COMPASS_LONGITUDE: ColorOption[] = [
  {
    id: 'preto_carbon',
    label: 'Preto Carbon',
    hex: '#000000',
    prompt: 'Preto Carbon solid black',
    finishDescription:
      'Pure solid black with no metallic particles. ' +
      'High-gloss clear coat finish. ' +
      'Reflections must be deep and mirror-like. ' +
      'Absolute black tone — no gray, no blue, no brown undertone.',
  },
  {
    id: 'azul_jazz',
    label: 'Azul Jazz',
    hex: '#11264b',
    prompt: 'Azul Jazz deep metallic blue',
    finishDescription:
      'Deep navy blue metallic with micro-fine blue-silver particles. ' +
      'RGB(17, 38, 75) — very dark saturated blue. ' +
      'Glossy high-depth finish. ' +
      'Must NOT shift toward purple, teal, or light blue.',
  },
  {
    id: 'cinza_granite',
    label: 'Cinza Granite',
    hex: '#5b5b58',
    prompt: 'Cinza Granite metallic gray',
    finishDescription:
      'Medium-dark warm gray metallic with fine aluminum particles. ' +
      'Glossy automotive finish with subtle olive undertone. ' +
      'RGB(91, 91, 88) — slightly warm neutral gray. ' +
      'Metallic sparkle visible under direct light only.',
  },
  {
    id: 'prata_billet',
    label: 'Prata Billet',
    hex: '#868b8d',
    prompt: 'Prata Billet metallic silver',
    finishDescription:
      'Medium metallic silver-gray with cool undertone. ' +
      'RGB(134, 139, 141) — balanced cool silver. ' +
      'Visible metallic flake under all lighting conditions. ' +
      'No warm/yellow tint. Clean neutral silver.',
  },
  {
    id: 'cinza_sting',
    label: 'Cinza Sting',
    hex: '#7d818a',
    prompt: 'Cinza Sting pearl gray-blue',
    finishDescription:
      'Cool blue-gray pearl with subtle metallic sheen. ' +
      'RGB(125, 129, 138) — medium gray with distinct blue undertone. ' +
      'Pearl particles create depth under angled light. ' +
      'Must NOT appear as neutral gray — blue shift is characteristic.',
  },
  {
    id: 'branco_polar',
    label: 'Branco Polar',
    hex: '#f4f4f4',
    prompt: 'Branco Polar pearl white',
    finishDescription:
      'Brilliant pearl white with micro-pearl particles. ' +
      'RGB(244, 244, 244) — near-pure white with subtle iridescence. ' +
      'Pearl effect visible as faint rainbow shimmer at edges. ' +
      'Must NOT appear as flat/matte white or cream.',
  },
]

const COMPASS_BLACKHAWK: ColorOption[] = [
  {
    id: 'preto_carbon',
    label: 'Preto Carbon',
    hex: '#000000',
    prompt: 'Preto Carbon solid black',
    finishDescription:
      'Pure solid black with no metallic particles. ' +
      'High-gloss clear coat finish. ' +
      'Reflections must be deep and mirror-like. ' +
      'Absolute black tone — no gray, no blue, no brown undertone.',
  },
  {
    id: 'cinza_granite_bicolor',
    label: 'Cinza Granite Bicolor',
    hex: '#5b5b58',
    prompt: 'Cinza Granite Bicolor metallic gray',
    finishDescription:
      'Medium-dark warm gray metallic with fine aluminum particles. ' +
      'Glossy automotive finish with subtle olive undertone. ' +
      'RGB(91, 91, 88) — slightly warm neutral gray. ' +
      'Metallic sparkle visible under direct light only.',
  },
  {
    id: 'sting_gray_bicolor',
    label: 'Sting Gray Bicolor',
    hex: '#7d818a',
    prompt: 'Sting Gray Bicolor pearl gray-blue',
    finishDescription:
      'Cool blue-gray pearl with subtle metallic sheen. ' +
      'RGB(125, 129, 138) — medium gray with distinct blue undertone. ' +
      'Pearl particles create depth under angled light. ' +
      'Must NOT appear as neutral gray — blue shift is characteristic.',
  },
  {
    id: 'branco_polar_bicolor',
    label: 'Branco Polar Bicolor',
    hex: '#f4f4f4',
    prompt: 'Branco Polar Bicolor pearl white',
    finishDescription:
      'Brilliant pearl white with micro-pearl particles. ' +
      'RGB(244, 244, 244) — near-pure white with subtle iridescence. ' +
      'Pearl effect visible as faint rainbow shimmer at edges. ' +
      'Must NOT appear as flat/matte white or cream.',
  },
]

// ─── Jeep Wrangler ──────────────────────────────────────────────────────────────

const WRANGLER_RUBICON: ColorOption[] = [
  {
    id: 'bright_white',
    label: 'Bright White',
    hex: '#F2F2F0',
    prompt: 'Bright White solid clear-coat',
    finishDescription:
      'Pure bright automotive white with neutral tone. ' +
      'RGB(242, 242, 240) — near-pure white with no warm or cool bias. ' +
      'Glossy clear-coat finish producing strong reflections and clean panel highlights. ' +
      'Must NOT appear as cream, ivory, or pearl — strictly solid white.',
  },
  {
    id: 'firecracker_red',
    label: 'Firecracker Red',
    hex: '#D6201E',
    prompt: 'Firecracker Red solid clear-coat',
    finishDescription:
      'Strong vibrant red automotive paint with warm undertones. ' +
      'RGB(214, 32, 30) — saturated true red, no orange or burgundy shift. ' +
      'Glossy clear-coat finish producing bold reflections and high contrast. ' +
      'Must NOT drift toward maroon, orange-red, or pink.',
  },
  {
    id: 'hydro_blue',
    label: 'Hydro Blue Pearl-Coat',
    hex: '#1E5FAF',
    prompt: 'Hydro Blue pearl metallic blue',
    finishDescription:
      'Deep saturated blue pearl metallic automotive paint. ' +
      'RGB(30, 95, 175) — vivid medium-dark blue with pearl particles. ' +
      'Reflective particles create bright highlights under sunlight. ' +
      'Must NOT shift toward navy, teal, or purple — stays true blue.',
  },
  {
    id: 'gobi',
    label: 'Gobi',
    hex: '#6F643F',
    prompt: 'Gobi solid khaki beige',
    finishDescription:
      'Earth-tone khaki beige automotive paint with warm sand undertones. ' +
      'RGB(111, 100, 63) — muted olive-tan desert tone. ' +
      'Glossy clear-coat finish inspired by desert off-road environments. ' +
      'Must NOT appear as bright yellow, gold, or greenish — stays sandy earth tone.',
  },
  {
    id: 'earl',
    label: 'Earl',
    hex: '#6F7F84',
    prompt: 'Earl solid gray-blue',
    finishDescription:
      'Muted gray-blue automotive paint with cool undertones. ' +
      'RGB(111, 127, 132) — desaturated blue-gray, slightly cooler than neutral. ' +
      'Glossy clear-coat finish giving a rugged modern off-road appearance. ' +
      'Must NOT appear as warm gray or bright blue — stays muted and cool.',
  },
  {
    id: 'black',
    label: 'Black',
    hex: '#0A0A0A',
    prompt: 'Black solid clear-coat',
    finishDescription:
      'Deep pure black automotive paint with high gloss clear-coat finish. ' +
      'RGB(10, 10, 10) — near-absolute black with no color undertone. ' +
      'Strong reflections and uniform dark appearance across all panels. ' +
      'Must NOT appear as dark gray, charcoal, or have blue/brown tint.',
  },
  {
    id: 'granite_crystal_metallic',
    label: 'Granite Crystal Metallic',
    hex: '#4A4D50',
    prompt: 'Granite Crystal Metallic dark gray',
    finishDescription:
      'Medium-dark graphite gray metallic automotive paint. ' +
      'RGB(74, 77, 80) — dark neutral gray with fine aluminum flakes. ' +
      'Subtle reflective highlights visible under direct lighting. ' +
      'Must NOT appear as light silver or warm brown-gray — stays cool dark graphite.',
  },
  {
    id: 'sarge_green',
    label: 'Sarge Green',
    hex: '#66B70E',
    prompt: 'Sarge Green solid olive green',
    finishDescription:
      'Military-inspired olive green automotive paint with warm undertones. ' +
      'RGB(102, 183, 14) — vivid yellow-green with classic Jeep heritage feel. ' +
      'Glossy clear-coat finish. ' +
      'Must NOT appear as dark forest green or lime — stays olive-military tone.',
  },
  {
    id: 'purple_reign',
    label: 'Purple Reign Pearl-Coat',
    hex: '#5C2E91',
    prompt: 'Purple Reign pearl metallic purple',
    finishDescription:
      'Deep violet purple pearl metallic automotive paint. ' +
      'RGB(92, 46, 145) — rich saturated purple with pearl reflective particles. ' +
      'Produces bright highlights and color depth under angled light. ' +
      'Must NOT shift toward blue, magenta, or plum — stays true deep violet.',
  },
]

// ─── Mercedes-Benz ──────────────────────────────────────────────────────────────

const MB_AMG_A35: ColorOption[] = [
  {
    id: 'dolomitgrau_metallic',
    label: 'Dolomitgrau metallic',
    hex: '#8c8f90',
    prompt: 'dolomitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(140, 143, 144) — dolomitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #8c8f90 exactly.',
  },
  {
    id: 'nachtschwarz',
    label: 'Nachtschwarz',
    hex: '#585b5a',
    prompt: 'nachtschwarz solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(88, 91, 90) — nachtschwarz. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #585b5a exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'mountaingrau',
    label: 'Mountaingrau',
    hex: '#a6a8a8',
    prompt: 'mountaingrau solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(166, 168, 168) — mountaingrau. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #a6a8a8 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'calcitgelb_metallic',
    label: 'Calcitgelb metallic',
    hex: '#535456',
    prompt: 'calcitgelb metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(83, 84, 86) — calcitgelb metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #535456 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
]

const MB_AMG_GLC43: ColorOption[] = [
  {
    id: 'silber_metallic_188',
    label: 'Silber metallic (188)',
    hex: '#9baeaf',
    prompt: 'silber metallic (188)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(155, 174, 175) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #9baeaf exactly.',
  },
  {
    id: 'spektralblau_metallic',
    label: 'Spektralblau metallic',
    hex: '#4d85b2',
    prompt: 'spektralblau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(77, 133, 178) — spektralblau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #4d85b2 exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'brillantsilber_metallic',
    label: 'Brillantsilber metallic',
    hex: '#e3e4e6',
    prompt: 'brillantsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(227, 228, 230) — brillantsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e3e4e6 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'selenitgrau_metallic',
    label: 'Selenitgrau metallic',
    hex: '#737574',
    prompt: 'selenitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(115, 117, 116) — selenitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #737574 exactly.',
  },
  {
    id: 'weiss_734',
    label: 'Weiß (734)',
    hex: '#c8ced4',
    prompt: 'weiß (734) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(200, 206, 212) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #c8ced4 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
  {
    id: 'obsidianschwarz_metallic',
    label: 'Obsidianschwarz metallic',
    hex: '#555555',
    prompt: 'obsidianschwarz metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(85, 85, 85) — obsidianschwarz metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #555555 exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
  {
    id: 'selenitgrau_2',
    label: 'Selenitgrau 2',
    hex: '#404241',
    prompt: 'selenitgrau 2 solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(64, 66, 65) — selenitgrau 2. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #404241 exactly.',
  },
]

const MB_C_200: ColorOption[] = [
  {
    id: 'iridiumsilber_metallic',
    label: 'Iridiumsilber metallic',
    hex: '#a1a5a6',
    prompt: 'iridiumsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(161, 165, 166) — iridiumsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #a1a5a6 exactly.',
  },
  {
    id: 'spektralblau_metallic',
    label: 'Spektralblau metallic',
    hex: '#4d85b2',
    prompt: 'spektralblau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(77, 133, 178) — spektralblau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #4d85b2 exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'brillantsilber_metallic',
    label: 'Brillantsilber metallic',
    hex: '#e3e4e6',
    prompt: 'brillantsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(227, 228, 230) — brillantsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e3e4e6 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'selenitgrau_metallic',
    label: 'Selenitgrau metallic',
    hex: '#737574',
    prompt: 'selenitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(115, 117, 116) — selenitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #737574 exactly.',
  },
  {
    id: 'goldbraun_metallic',
    label: 'Goldbraun metallic',
    hex: '#75859e',
    prompt: 'goldbraun metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(117, 133, 158) — goldbraun metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #75859e exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
  {
    id: 'obsidianschwarz_metallic',
    label: 'Obsidianschwarz metallic',
    hex: '#555555',
    prompt: 'obsidianschwarz metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(85, 85, 85) — obsidianschwarz metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #555555 exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
  {
    id: 'selenitgrau_2',
    label: 'Selenitgrau 2',
    hex: '#404241',
    prompt: 'selenitgrau 2 solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(64, 66, 65) — selenitgrau 2. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #404241 exactly.',
  },
]

const MB_CLA_200: ColorOption[] = [
  {
    id: 'spektralblau_metallic',
    label: 'Spektralblau metallic',
    hex: '#4d85b2',
    prompt: 'spektralblau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(77, 133, 178) — spektralblau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #4d85b2 exactly.',
  },
  {
    id: 'dolomitgrau_metallic',
    label: 'Dolomitgrau metallic',
    hex: '#8c8f90',
    prompt: 'dolomitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(140, 143, 144) — dolomitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #8c8f90 exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'nachtschwarz',
    label: 'Nachtschwarz',
    hex: '#585b5a',
    prompt: 'nachtschwarz solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(88, 91, 90) — nachtschwarz. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #585b5a exactly.',
  },
  {
    id: 'mountaingrau',
    label: 'Mountaingrau',
    hex: '#a6a8a8',
    prompt: 'mountaingrau solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(166, 168, 168) — mountaingrau. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #a6a8a8 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'blau_metallic_888',
    label: 'Blau metallic (888)',
    hex: '#51a9bd',
    prompt: 'blau metallic (888)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(81, 169, 189) — blau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #51a9bd exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'calcitgelb_metallic',
    label: 'Calcitgelb metallic',
    hex: '#535456',
    prompt: 'calcitgelb metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(83, 84, 86) — calcitgelb metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #535456 exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
]

const MB_CLE_300: ColorOption[] = [
  {
    id: 'spektralblau_metallic',
    label: 'Spektralblau metallic',
    hex: '#4d85b2',
    prompt: 'spektralblau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(77, 133, 178) — spektralblau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #4d85b2 exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'brillantsilber_metallic',
    label: 'Brillantsilber metallic',
    hex: '#e3e4e6',
    prompt: 'brillantsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(227, 228, 230) — brillantsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e3e4e6 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'selenitgrau_metallic',
    label: 'Selenitgrau metallic',
    hex: '#737574',
    prompt: 'selenitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(115, 117, 116) — selenitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #737574 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
  {
    id: 'obsidianschwarz_metallic',
    label: 'Obsidianschwarz metallic',
    hex: '#555555',
    prompt: 'obsidianschwarz metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(85, 85, 85) — obsidianschwarz metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #555555 exactly.',
  },
  {
    id: 'beige_sand_metallic_914',
    label: 'Beige/sand metallic (914)',
    hex: '#ead672',
    prompt: 'beige/sand metallic (914)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(234, 214, 114) — beige/sand metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #ead672 exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
  {
    id: 'selenitgrau_2',
    label: 'Selenitgrau 2',
    hex: '#404241',
    prompt: 'selenitgrau 2 solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(64, 66, 65) — selenitgrau 2. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #404241 exactly.',
  },
]

const MB_E_300: ColorOption[] = [
  {
    id: 'silber_metallic_188',
    label: 'Silber metallic (188)',
    hex: '#9baeaf',
    prompt: 'silber metallic (188)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(155, 174, 175) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #9baeaf exactly.',
  },
  {
    id: 'dunkelblau_metallic_595',
    label: 'Dunkelblau metallic (595)',
    hex: '#545b6f',
    prompt: 'dunkelblau metallic (595)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(84, 91, 111) — dunkelblau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #545b6f exactly.',
  },
  {
    id: 'silber_metallic_771',
    label: 'Silber metallic (771)',
    hex: '#b5aba3',
    prompt: 'silber metallic (771)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(181, 171, 163) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #b5aba3 exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'brillantsilber_metallic',
    label: 'Brillantsilber metallic',
    hex: '#e3e4e6',
    prompt: 'brillantsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(227, 228, 230) — brillantsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e3e4e6 exactly.',
  },
  {
    id: 'selenitgrau_metallic',
    label: 'Selenitgrau metallic',
    hex: '#737574',
    prompt: 'selenitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(115, 117, 116) — selenitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #737574 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
  {
    id: 'diamantweiss_metallic',
    label: 'Diamantweiß metallic',
    hex: '#e0e1e3',
    prompt: 'diamantweiß metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(224, 225, 227) — diamantweiß metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e0e1e3 exactly.',
  },
  {
    id: 'obsidianschwarz_metallic',
    label: 'Obsidianschwarz metallic',
    hex: '#555555',
    prompt: 'obsidianschwarz metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(85, 85, 85) — obsidianschwarz metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #555555 exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
]

const MB_EQA_350: ColorOption[] = [
  {
    id: 'dolomitgrau_metallic',
    label: 'Dolomitgrau metallic',
    hex: '#8c8f90',
    prompt: 'dolomitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(140, 143, 144) — dolomitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #8c8f90 exactly.',
  },
  {
    id: 'nachtschwarz',
    label: 'Nachtschwarz',
    hex: '#585b5a',
    prompt: 'nachtschwarz solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(88, 91, 90) — nachtschwarz. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #585b5a exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'mountaingrau',
    label: 'Mountaingrau',
    hex: '#a6a8a8',
    prompt: 'mountaingrau solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(166, 168, 168) — mountaingrau. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #a6a8a8 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'calcitgelb_metallic',
    label: 'Calcitgelb metallic',
    hex: '#535456',
    prompt: 'calcitgelb metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(83, 84, 86) — calcitgelb metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #535456 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
]

const MB_EQE_350: ColorOption[] = [
  {
    id: 'silber_metallic_771',
    label: 'Silber metallic (771)',
    hex: '#b5aba3',
    prompt: 'silber metallic (771)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(181, 171, 163) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #b5aba3 exactly.',
  },
  {
    id: 'iridiumsilber_metallic',
    label: 'Iridiumsilber metallic',
    hex: '#a1a5a6',
    prompt: 'iridiumsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(161, 165, 166) — iridiumsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #a1a5a6 exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'brillantsilber_metallic',
    label: 'Brillantsilber metallic',
    hex: '#e3e4e6',
    prompt: 'brillantsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(227, 228, 230) — brillantsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e3e4e6 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'goldbraun_metallic',
    label: 'Goldbraun metallic',
    hex: '#75859e',
    prompt: 'goldbraun metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(117, 133, 158) — goldbraun metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #75859e exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
  {
    id: 'obsidianschwarz_metallic',
    label: 'Obsidianschwarz metallic',
    hex: '#555555',
    prompt: 'obsidianschwarz metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(85, 85, 85) — obsidianschwarz metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #555555 exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
]

const MB_G_580: ColorOption[] = [
  {
    id: 'dunkelgrau_metallic_271',
    label: 'Dunkelgrau metallic (271)',
    hex: '#5c524a',
    prompt: 'dunkelgrau metallic (271)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(92, 82, 74) — dunkelgrau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #5c524a exactly.',
  },
  {
    id: 'silber_metallic_051',
    label: 'Silber metallic (051)',
    hex: '#9b9ca1',
    prompt: 'silber metallic (051)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(155, 156, 161) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #9b9ca1 exactly.',
  },
  {
    id: 'blau_metallic_591',
    label: 'Blau metallic (591)',
    hex: '#0a78a7',
    prompt: 'blau metallic (591)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(10, 120, 167) — blau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #0a78a7 exactly.',
  },
  {
    id: 'dunkelgrau_metallic_054',
    label: 'Dunkelgrau metallic (054)',
    hex: '#6a625a',
    prompt: 'dunkelgrau metallic (054)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(106, 98, 90) — dunkelgrau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #6a625a exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
  {
    id: 'weiss_693',
    label: 'Weiß (693)',
    hex: '#d8d2cc',
    prompt: 'weiß (693) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(216, 210, 204) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #d8d2cc exactly.',
  },
  {
    id: 'grau_metallic_255',
    label: 'Grau metallic (255)',
    hex: '#6f7864',
    prompt: 'grau metallic (255)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(111, 120, 100) — grau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #6f7864 exactly.',
  },
  {
    id: 'iridiumsilber_metallic',
    label: 'Iridiumsilber metallic',
    hex: '#a1a5a6',
    prompt: 'iridiumsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(161, 165, 166) — iridiumsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #a1a5a6 exactly.',
  },
  {
    id: 'grau_metallic_795',
    label: 'Grau metallic (795)',
    hex: '#a09d90',
    prompt: 'grau metallic (795)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(160, 157, 144) — grau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #a09d90 exactly.',
  },
  {
    id: 'weiss_775',
    label: 'Weiß (775)',
    hex: '#dee1e4',
    prompt: 'weiß (775) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(222, 225, 228) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #dee1e4 exactly.',
  },
  {
    id: 'blau_metallic_896',
    label: 'Blau metallic (896)',
    hex: '#4d6f99',
    prompt: 'blau metallic (896)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(77, 111, 153) — blau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #4d6f99 exactly.',
  },
  {
    id: 'rot_metallic_996',
    label: 'Rot metallic (996)',
    hex: '#da5e64',
    prompt: 'rot metallic (996)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(218, 94, 100) — rot metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #da5e64 exactly.',
  },
]

const MB_GLA_200: ColorOption[] = [
  {
    id: 'dolomitgrau_metallic',
    label: 'Dolomitgrau metallic',
    hex: '#8c8f90',
    prompt: 'dolomitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(140, 143, 144) — dolomitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #8c8f90 exactly.',
  },
  {
    id: 'nachtschwarz',
    label: 'Nachtschwarz',
    hex: '#585b5a',
    prompt: 'nachtschwarz solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(88, 91, 90) — nachtschwarz. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #585b5a exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'mountaingrau',
    label: 'Mountaingrau',
    hex: '#a6a8a8',
    prompt: 'mountaingrau solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(166, 168, 168) — mountaingrau. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #a6a8a8 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'calcitgelb_metallic',
    label: 'Calcitgelb metallic',
    hex: '#535456',
    prompt: 'calcitgelb metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(83, 84, 86) — calcitgelb metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #535456 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
]

const MB_GLB_200: ColorOption[] = [
  {
    id: 'weiss_341',
    label: 'Weiß (341)',
    hex: '#c5d2d0',
    prompt: 'weiß (341) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(197, 210, 208) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #c5d2d0 exactly.',
  },
  {
    id: 'silbergrau_metallic_809',
    label: 'Silbergrau metallic (809)',
    hex: '#68acd9',
    prompt: 'silbergrau metallic (809)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(104, 172, 217) — silbergrau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #68acd9 exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'nachtschwarz',
    label: 'Nachtschwarz',
    hex: '#585b5a',
    prompt: 'nachtschwarz solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(88, 91, 90) — nachtschwarz. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #585b5a exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'calcitgelb_metallic',
    label: 'Calcitgelb metallic',
    hex: '#535456',
    prompt: 'calcitgelb metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(83, 84, 86) — calcitgelb metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #535456 exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
  {
    id: 'dunkelgrau_metallic_957',
    label: 'Dunkelgrau metallic (957)',
    hex: '#606163',
    prompt: 'dunkelgrau metallic (957)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(96, 97, 99) — dunkelgrau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #606163 exactly.',
  },
]

const MB_GLC_200: ColorOption[] = [
  {
    id: 'silber_metallic_188',
    label: 'Silber metallic (188)',
    hex: '#9baeaf',
    prompt: 'silber metallic (188)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(155, 174, 175) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #9baeaf exactly.',
  },
  {
    id: 'spektralblau_metallic',
    label: 'Spektralblau metallic',
    hex: '#4d85b2',
    prompt: 'spektralblau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(77, 133, 178) — spektralblau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #4d85b2 exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'brillantsilber_metallic',
    label: 'Brillantsilber metallic',
    hex: '#e3e4e6',
    prompt: 'brillantsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(227, 228, 230) — brillantsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e3e4e6 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'selenitgrau_metallic',
    label: 'Selenitgrau metallic',
    hex: '#737574',
    prompt: 'selenitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(115, 117, 116) — selenitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #737574 exactly.',
  },
  {
    id: 'weiss_734',
    label: 'Weiß (734)',
    hex: '#c8ced4',
    prompt: 'weiß (734) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(200, 206, 212) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #c8ced4 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
  {
    id: 'obsidianschwarz_metallic',
    label: 'Obsidianschwarz metallic',
    hex: '#555555',
    prompt: 'obsidianschwarz metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(85, 85, 85) — obsidianschwarz metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #555555 exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
  {
    id: 'selenitgrau_2',
    label: 'Selenitgrau 2',
    hex: '#404241',
    prompt: 'selenitgrau 2 solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(64, 66, 65) — selenitgrau 2. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #404241 exactly.',
  },
]

const MB_GLC_300: ColorOption[] = [
  {
    id: 'silber_metallic_188',
    label: 'Silber metallic (188)',
    hex: '#9baeaf',
    prompt: 'silber metallic (188)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(155, 174, 175) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #9baeaf exactly.',
  },
  {
    id: 'spektralblau_metallic',
    label: 'Spektralblau metallic',
    hex: '#4d85b2',
    prompt: 'spektralblau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(77, 133, 178) — spektralblau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #4d85b2 exactly.',
  },
  {
    id: 'patagoniared_metallic',
    label: 'Patagoniared metallic',
    hex: '#cb6067',
    prompt: 'patagoniared metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(203, 96, 103) — patagoniared metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cb6067 exactly.',
  },
  {
    id: 'brillantsilber_metallic',
    label: 'Brillantsilber metallic',
    hex: '#e3e4e6',
    prompt: 'brillantsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(227, 228, 230) — brillantsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e3e4e6 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'selenitgrau_metallic',
    label: 'Selenitgrau metallic',
    hex: '#737574',
    prompt: 'selenitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(115, 117, 116) — selenitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #737574 exactly.',
  },
  {
    id: 'weiss_734',
    label: 'Weiß (734)',
    hex: '#c8ced4',
    prompt: 'weiß (734) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(200, 206, 212) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #c8ced4 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
  {
    id: 'obsidianschwarz_metallic',
    label: 'Obsidianschwarz metallic',
    hex: '#555555',
    prompt: 'obsidianschwarz metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(85, 85, 85) — obsidianschwarz metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #555555 exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
  {
    id: 'selenitgrau_2',
    label: 'Selenitgrau 2',
    hex: '#404241',
    prompt: 'selenitgrau 2 solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(64, 66, 65) — selenitgrau 2. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #404241 exactly.',
  },
]

const MB_GLE_450: ColorOption[] = [
  {
    id: 'grau_metallic_190',
    label: 'Grau metallic (190)',
    hex: '#949999',
    prompt: 'grau metallic (190)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(148, 153, 153) — grau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #949999 exactly.',
  },
  {
    id: 'obsidianschwarz_metallic',
    label: 'Obsidianschwarz metallic',
    hex: '#555555',
    prompt: 'obsidianschwarz metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(85, 85, 85) — obsidianschwarz metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #555555 exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
  {
    id: 'dunkelblau_metallic_032',
    label: 'Dunkelblau metallic (032)',
    hex: '#4d5a7f',
    prompt: 'dunkelblau metallic (032)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(77, 90, 127) — dunkelblau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #4d5a7f exactly.',
  },
  {
    id: 'iridiumsilber_metallic',
    label: 'Iridiumsilber metallic',
    hex: '#a1a5a6',
    prompt: 'iridiumsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(161, 165, 166) — iridiumsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #a1a5a6 exactly.',
  },
  {
    id: 'brillantsilber_metallic',
    label: 'Brillantsilber metallic',
    hex: '#e3e4e6',
    prompt: 'brillantsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(227, 228, 230) — brillantsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e3e4e6 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'goldbraun_metallic',
    label: 'Goldbraun metallic',
    hex: '#75859e',
    prompt: 'goldbraun metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(117, 133, 158) — goldbraun metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #75859e exactly.',
  },
  {
    id: 'silber_metallic_886',
    label: 'Silber metallic (886)',
    hex: '#96ac9e',
    prompt: 'silber metallic (886)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(150, 172, 158) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #96ac9e exactly.',
  },
  {
    id: 'weiss_734',
    label: 'Weiß (734)',
    hex: '#c8ced4',
    prompt: 'weiß (734) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(200, 206, 212) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #c8ced4 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'diamantweiss_metallic',
    label: 'Diamantweiß metallic',
    hex: '#e0e1e3',
    prompt: 'diamantweiß metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(224, 225, 227) — diamantweiß metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e0e1e3 exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
]

const MB_GLS_450: ColorOption[] = [
  {
    id: 'weiss_c20',
    label: 'Weiß (C20)',
    hex: '#cdd2d8',
    prompt: 'weiß (C20) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(205, 210, 216) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #cdd2d8 exactly.',
  },
  {
    id: 'silber_metallic_c10',
    label: 'Silber metallic (C10)',
    hex: '#9d9c9a',
    prompt: 'silber metallic (C10)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(157, 156, 154) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #9d9c9a exactly.',
  },
  {
    id: 'weiss_c35',
    label: 'Weiß (C35)',
    hex: '#cdd2d7',
    prompt: 'weiß (C35) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(205, 210, 215) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #cdd2d7 exactly.',
  },
  {
    id: 'beige_sand_metallic_c23',
    label: 'Beige/sand metallic (C23)',
    hex: '#c4bbab',
    prompt: 'beige/sand metallic (C23)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(196, 187, 171) — beige/sand metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #c4bbab exactly.',
  },
  {
    id: 'grau_metallic_190',
    label: 'Grau metallic (190)',
    hex: '#949999',
    prompt: 'grau metallic (190)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(148, 153, 153) — grau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #949999 exactly.',
  },
  {
    id: 'obsidianschwarz_metallic',
    label: 'Obsidianschwarz metallic',
    hex: '#555555',
    prompt: 'obsidianschwarz metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(85, 85, 85) — obsidianschwarz metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #555555 exactly.',
  },
  {
    id: 'graphitgrau_metallic',
    label: 'Graphitgrau metallic',
    hex: '#565656',
    prompt: 'graphitgrau metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(86, 86, 86) — graphitgrau metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #565656 exactly.',
  },
  {
    id: 'dunkelblau_metallic_032',
    label: 'Dunkelblau metallic (032)',
    hex: '#4d5a7f',
    prompt: 'dunkelblau metallic (032)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(77, 90, 127) — dunkelblau metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #4d5a7f exactly.',
  },
  {
    id: 'iridiumsilber_metallic',
    label: 'Iridiumsilber metallic',
    hex: '#a1a5a6',
    prompt: 'iridiumsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(161, 165, 166) — iridiumsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #a1a5a6 exactly.',
  },
  {
    id: 'brillantsilber_metallic',
    label: 'Brillantsilber metallic',
    hex: '#e3e4e6',
    prompt: 'brillantsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(227, 228, 230) — brillantsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e3e4e6 exactly.',
  },
  {
    id: 'polarweiss',
    label: 'Polarweiß',
    hex: '#e7e8e9',
    prompt: 'polarweiß solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(231, 232, 233) — polarweiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #e7e8e9 exactly.',
  },
  {
    id: 'goldbraun_metallic',
    label: 'Goldbraun metallic',
    hex: '#75859e',
    prompt: 'goldbraun metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(117, 133, 158) — goldbraun metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #75859e exactly.',
  },
  {
    id: 'silber_metallic_886',
    label: 'Silber metallic (886)',
    hex: '#96ac9e',
    prompt: 'silber metallic (886)',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(150, 172, 158) — silber metallic metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #96ac9e exactly.',
  },
  {
    id: 'weiss_734',
    label: 'Weiß (734)',
    hex: '#c8ced4',
    prompt: 'weiß (734) solid',
    finishDescription:
      'Solid automotive paint with high-gloss clear coat finish. ' +
      'RGB(200, 206, 212) — weiß. ' +
      'Deep reflections with uniform color across all panels. ' +
      'Must match hex #c8ced4 exactly.',
  },
  {
    id: 'hightechsilber_metallic',
    label: 'Hightechsilber metallic',
    hex: '#d3d8dd',
    prompt: 'hightechsilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(211, 216, 221) — hightechsilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #d3d8dd exactly.',
  },
  {
    id: 'diamantweiss_metallic',
    label: 'Diamantweiß metallic',
    hex: '#e0e1e3',
    prompt: 'diamantweiß metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(224, 225, 227) — diamantweiß metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #e0e1e3 exactly.',
  },
  {
    id: 'mojavesilber_metallic',
    label: 'Mojavesilber metallic',
    hex: '#cacacb',
    prompt: 'mojavesilber metallic',
    finishDescription:
      'Metallic automotive paint with fine aluminum particles. ' +
      'RGB(202, 202, 203) — mojavesilber metallic finish. ' +
      'Visible metallic flake creating subtle reflective highlights under direct light. ' +
      'High-gloss clear coat. ' +
      'Must match hex #cacacb exactly.',
  },
]

// ─── Jeep Gladiator ─────────────────────────────────────────────────────────────

const GLADIATOR_RUBICON: ColorOption[] = [
  {
    id: 'branco',
    label: 'Branco',
    hex: '#cccccc',
    prompt: 'Branco solid white',
    finishDescription:
      'Basic solid white automotive paint. ' +
      'RGB(204, 204, 204) — light neutral white with slight gray tone. ' +
      'High-gloss clear coat finish with clean reflections. ' +
      'Must NOT appear as pearl or cream — stays basic solid white.',
  },
  {
    id: 'preto',
    label: 'Preto',
    hex: '#1b1b1b',
    prompt: 'Preto solid black',
    finishDescription:
      'Pure solid black automotive paint. ' +
      'RGB(27, 27, 27) — near-absolute black with no color undertone. ' +
      'High-gloss clear coat with deep mirror-like reflections. ' +
      'Must NOT appear as dark gray or have any color tint.',
  },
  {
    id: 'vermelho_firecracker',
    label: 'Vermelho Firecracker',
    hex: '#cd1202',
    prompt: 'Vermelho Firecracker solid red',
    finishDescription:
      'Strong vibrant red automotive paint with warm undertones. ' +
      'RGB(205, 18, 2) — saturated true red, no orange or burgundy shift. ' +
      'Glossy clear-coat finish producing bold reflections and high contrast. ' +
      'Must NOT drift toward maroon, orange-red, or pink.',
  },
  {
    id: 'color_41',
    label: '41 Metallic',
    hex: '#8a8a88',
    prompt: '41 metallic gray',
    finishDescription:
      'Medium metallic gray automotive paint with fine aluminum particles. ' +
      'RGB(138, 138, 136) — neutral mid-gray metallic finish. ' +
      'Visible metallic flake under direct light. ' +
      'Must NOT appear as dark charcoal or light silver.',
  },
  {
    id: 'anvil',
    label: 'Anvil',
    hex: '#8C9095',
    prompt: 'Anvil metallic gray',
    finishDescription:
      'Cool-toned medium gray metallic automotive paint. ' +
      'RGB(140, 144, 149) — slightly blue-gray with metallic sheen. ' +
      'Fine metallic particles visible under all lighting conditions. ' +
      'Must NOT appear as warm gray — stays cool and slightly blue.',
  },
  {
    id: 'granite_crystal',
    label: 'Granite Crystal',
    hex: '#303435',
    prompt: 'Granite Crystal metallic dark gray',
    finishDescription:
      'Medium-dark graphite gray metallic automotive paint. ' +
      'RGB(48, 52, 53) — very dark neutral gray with fine aluminum flakes. ' +
      'Subtle reflective highlights visible under direct lighting. ' +
      'Must NOT appear as light silver or warm brown-gray — stays cool dark graphite.',
  },
  {
    id: 'hydro_blue',
    label: 'Hydro Blue',
    hex: '#1E5FAF',
    prompt: 'Hydro Blue metallic blue',
    finishDescription:
      'Deep saturated blue metallic automotive paint. ' +
      'RGB(30, 95, 175) — vivid medium-dark blue with metallic particles. ' +
      'Reflective particles create bright highlights under sunlight. ' +
      'Must NOT shift toward navy, teal, or purple — stays true blue.',
  },
]

// ─── Registry ────────────────────────────────────────────────────────────────

export const VARIANT_COLORS: VariantColorMap = {
  jeep_commander: {
    limited:   COMMANDER_LIMITED,
    overland:  COMMANDER_OVERLAND,
    blackhawk: COMMANDER_BLACKHAWK,
  },
  jeep_renegade: {
    sport:     RENEGADE_SPORT,
    longitude: RENEGADE_LONGITUDE,
  },
  jeep_compass: {
    sport:     COMPASS_SPORT,
    limited:   COMPASS_SPORT,
    longitude: COMPASS_LONGITUDE,
    blackhawk: COMPASS_BLACKHAWK,
  },
  jeep_wrangler: {
    rubicon_4door:    WRANGLER_RUBICON,
    rubicon:          WRANGLER_RUBICON,
    rubicon_2door:    WRANGLER_RUBICON,
    sahara_4door:     WRANGLER_RUBICON,
    unlimitedsahara:  WRANGLER_RUBICON,
    rubicon_u_12_3:   WRANGLER_RUBICON,
    rubicon_u_8_4:    WRANGLER_RUBICON,
  },
  jeep_gladiator: {
    rubicon:        GLADIATOR_RUBICON,
    rubicon_u_12_3: GLADIATOR_RUBICON,
    rubicon_u_8_4:  GLADIATOR_RUBICON,
  },
  mb_amg: {
    amg_a35:  MB_AMG_A35,
    amg_glc43: MB_AMG_GLC43,
  },
  mb_clase_c: {
    c_200: MB_C_200,
  },
  mb_cla: {
    cla_200_coupe_kit_amg:      MB_CLA_200,
    cla_200_coupe_progressive:  MB_CLA_200,
  },
  mb_cle: {
    cle_300_coupe_kit_amg: MB_CLE_300,
  },
  mb_clase_e: {
    e_300_kit_amg: MB_E_300,
  },
  mb_eqa: {
    eqa_350: MB_EQA_350,
  },
  mb_eqe: {
    eqe_350plus: MB_EQE_350,
  },
  mb_clase_g: {
    g_580: MB_G_580,
  },
  mb_gla: {
    gla_200_advance_plus: MB_GLA_200,
  },
  mb_glb: {
    glb_200_3filas: MB_GLB_200,
  },
  mb_glc: {
    glc_200_advance:        MB_GLC_200,
    glc_200_advance_plus:   MB_GLC_200,
    glc_200_coupe_kit_amg:  MB_GLC_200,
    glc_300_coupe_kit_amg:  MB_GLC_300,
  },
  mb_gle: {
    gle_450_advanced:       MB_GLE_450,
    gle_450_advanced_plus:  MB_GLE_450,
    gle_450_coupe_kit_amg:  MB_GLE_450,
    gle_450_kit_amg:        MB_GLE_450,
  },
  mb_gls: {
    gls_450: MB_GLS_450,
  },
}

/**
 * Get the official colors for a specific model + variant.
 * Returns empty array if no colors are defined.
 */
export function getVariantColors(modelId: string, variantId: string): ColorOption[] {
  return VARIANT_COLORS[modelId]?.[variantId] ?? []
}

/**
 * Get upload color options (value/label/hex) for the upload modal dropdown.
 */
export function getUploadColors(modelId: string, variantId: string): { value: string; label: string; hex: string }[] {
  const colors = getVariantColors(modelId, variantId)
  return colors.map(c => ({ value: c.id, label: c.label, hex: c.hex }))
}
