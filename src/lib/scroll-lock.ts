/**
 * Call just before opening a modal panel. While a panel is open the page stops
 * scrolling, which hides the scrollbar on Windows and Linux. Remembering its
 * width lets the CSS pad the page by the same amount, so nothing shifts and the
 * panel can sit flush against the edge of the window.
 */
export function rememberScrollbarWidth() {
  const width = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  document.documentElement.style.setProperty("--scrollbar-width", `${width}px`);
}
