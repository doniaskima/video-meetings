const urlify = (str) =>
    str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "-")
    .replace(/^-+|-+$/g, "");

module.exports = urlify;