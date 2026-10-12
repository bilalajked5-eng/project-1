/**
 * Licensed stock photography (Unsplash License: free for commercial use,
 * no attribution required). Used only for general atmosphere: hero,
 * services and section imagery. Never used on project case studies, which
 * must show authentic Projects World work.
 *
 * Replace any entry with an exported photo from the current site by setting
 * `src` on the slot instead.
 */
const ids = {
  livingLuxury: '1618221195710-dd6b41faaea6',
  livingWarm: '1600210492486-724fe5c67fb0',
  livingSofa: '1586023492125-27b2c045efd7',
  sofaDetail: '1555041469-a586c61ea9bc',
  armchair: '1567016432779-094069958ea5',
  chairStudio: '1615529182904-14819c35db37',
  office: '1497366216548-37526070297c',
  officeMeeting: '1556761175-5973dc0f32e7',
  officeChair: '1524758631624-e2822e304c36',
  hotelRoom: '1631049307264-da0ec9d70304',
  hotelLobby: '1566073771259-6a8506099945',
  restaurant: '1414235077428-338989a2e8c0',
  bedroom: '1505693416388-ac5ce068fe85',
  dining: '1617806118233-18e1de247200',
  villa: '1600585154340-be6161a56a0c',
  interiorDesign: '1600607687939-ce8a6c25118c',
  materials: '1615873968403-89e068629265',
  lounge: '1493663284031-b7e3aefcae8e',
} as const

export type StockKey = keyof typeof ids

const url = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`

/** `src` + `srcSet` for a stock photo. */
export function stock(key: StockKey) {
  const id = ids[key]
  return {
    src: url(id, 1600),
    srcSet: [640, 1024, 1600, 2200].map((w) => `${url(id, w)} ${w}w`).join(', '),
  }
}
