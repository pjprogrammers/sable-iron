let lockCount = 0;

export function lockPage() {
  if (typeof document === "undefined") return;
  lockCount += 1;
  document.body.classList.add("is-locked");
  document.getElementById("page-content")?.setAttribute("inert", "");
}

export function unlockPage() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  document.body.classList.remove("is-locked");
  document.getElementById("page-content")?.removeAttribute("inert");
}
