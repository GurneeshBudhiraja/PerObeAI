// converts a string to title case
function titleCase(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (s) => s.toUpperCase());
}

export { titleCase };
