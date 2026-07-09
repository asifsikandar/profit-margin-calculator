export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function financialSlug(name: string): string {
  // Every financial calculator route ends with "-calculator"
  const s = slugify(name);
  return s.endsWith("-calculator") ? s : `${s}-calculator`;
}

export function calcHref(category: string, name: string): string {
  if (category === "financial") return `/financial/${financialSlug(name)}`;
  return `/calculator/${category}/${slugify(name)}`;
}
