export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calcHref(category: string, name: string): string {
  // Homepage handles Margin (Financial); everything else uses placeholder route.
  if (category === "financial" && name.toLowerCase() === "margin") return "/";
  return `/calculator/${category}/${slugify(name)}`;
}
