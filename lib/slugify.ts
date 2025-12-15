export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Reemplazar espacios con -
    .replace(/[^\w\-]+/g, '')    // Remover caracteres no word
    .replace(/\-\-+/g, '-')      // Reemplazar múltiples - con uno solo
    .replace(/^-+/, '')          // Trim - del inicio
    .replace(/-+$/, '')          // Trim - del final
}
