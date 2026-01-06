export function formatSynapses(price: number | null): string {
  return price === null ? 'Бесценно' : `${price} синапсов`;
}