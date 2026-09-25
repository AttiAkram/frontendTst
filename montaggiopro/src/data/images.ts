import type { CategoryId } from './types'

/**
 * Demo photography from Unsplash (free licence). The backend will send real product images;
 * until then every product draws from its category pool. <Photo> shows a neutral fallback if one fails.
 */
const U = 'https://images.unsplash.com/photo-'

export const img = (id: string, w = 900) => `${U}${id}?auto=format&fit=crop&w=${w}&q=80`

export const CATEGORY_PHOTOS: Record<CategoryId, string[]> = {
  audio: ['1505740420928-5e560c06d30e', '1583394838336-acd977736f90', '1546435770-a3e426bf472b', '1484704849700-f032a568e944', '1590658268037-6bf12165a8df'],
  phone: ['1511707171634-5f897ff02aa9', '1592750475338-74b7b21085ab', '1598327105666-5b89351aff97', '1510557880182-3d4d3cba35a5'],
  camera: ['1526170375885-4d8ecf77b99f', '1516035069371-29a1b244cc32', '1502920917128-1aa500764cbd', '1510127034890-ba27508e9f1c'],
  wearable: ['1523275335684-37898b6baf30', '1546868871-7041f2a55e12', '1579586337278-3befd40fd17a', '1508685096489-7aacd43bd3b1'],
  computing: ['1496181133206-80ce9b88a853', '1517336714731-489689fd1ca8', '1587829741301-dc798b83add3', '1527864550417-7fd91fc51a46', '1527443224154-c4a3942d3acf'],
  gaming: ['1606144042614-b2417e99c4e3', '1592840496694-26d035b52b48', '1612287230202-1ff1d85d1bdf'],
  home: ['1608043152269-423dbba4e7e1', '1545454675-3531b543be5d', '1507473885765-e6ed057f782c'],
  power: ['1609091839311-d5365f9ff1c5', '1583863788434-e58a36330cf0', '1585338107529-13afc5f02586'],
}

/** Lifestyle / editorial shots for hero and storytelling blocks. */
export const EDITORIAL = {
  hero: '1478737270239-2f02b77fc618',
  desk: '1498050108023-c5249f4df085',
  people: '1519389950473-47ba0277781c',
  store: '1441986300917-64674bd600d8',
  shopping: '1483985988355-763728e1935b',
  flatlay: '1487180144351-b8472da7d491',
}
