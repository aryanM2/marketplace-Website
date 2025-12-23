export function getImageUrl(img) {
  const placeholder = "https://via.placeholder.com/300x180?text=No+Image";
  if (!img) return placeholder;

  const isAbsolute = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
  const isRelative = (u) => typeof u === "string" && u.startsWith("/");

  // Prefer explicit url field if present
  if (isAbsolute(img.url)) return img.url;
  // If url is relative and we have a backend base URL, prefix it
  if (isRelative(img.url)) {
    const api = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
    return api ? `${api}${img.url}` : img.url;
  }

  // Next prefer path if absolute
  if (isAbsolute(img.path)) return img.path;

  // If path looks like a server filesystem path (e.g. /opt/...), don't use it
  if (typeof img.path === "string" && img.path.startsWith("/opt")) {
    // fallback to url if available
    if (isAbsolute(img.url)) return img.url;
    if (isRelative(img.url)) {
      const api = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
      return api ? `${api}${img.url}` : img.url;
    }
    return placeholder;
  }

  // If path is relative (starts with /), prefix backend URL if available
  if (isRelative(img.path)) {
    const api = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
    return api ? `${api}${img.path}` : img.path;
  }

  // Any other string fallback
  if (typeof img.path === "string" && img.path.length) return img.path;

  return placeholder;
}
