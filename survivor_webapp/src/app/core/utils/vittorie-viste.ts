/**
 * Vittorie gia' celebrate con il popup dei vincitori: si mostra una volta sola per lega e per utente.
 * Salvate in localStorage (per utente, cosi' due account sullo stesso dispositivo non si confondono).
 */
const chiave = (userId: number | string | undefined | null) => `vittorieViste_${userId ?? 'anon'}`;

export function leggiVittorieViste(userId: number | string | undefined | null): number[] {
  try {
    const raw = localStorage.getItem(chiave(userId));
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function isVittoriaVista(userId: number | string | undefined | null, legaId: number): boolean {
  return leggiVittorieViste(userId).includes(legaId);
}

export function segnaVittorieViste(userId: number | string | undefined | null, legaIds: number[]): void {
  try {
    const tutte = new Set<number>([...leggiVittorieViste(userId), ...legaIds]);
    localStorage.setItem(chiave(userId), JSON.stringify([...tutte]));
  } catch {
    // storage non disponibile (modalita' privata, ecc.): il popup potrebbe ripetersi, non e' un errore
  }
}
