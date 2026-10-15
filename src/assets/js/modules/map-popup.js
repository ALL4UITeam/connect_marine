export function anchorMapPopup(popup) {
  let anchor;
  const position = () => {
    if (!anchor || popup.hidden) return;
    const parent = popup.offsetParent;
    if (!parent) return;
    const pin = anchor.getBoundingClientRect();
    const bounds = parent.getBoundingClientRect();
    const scaleX = bounds.width / parent.offsetWidth || 1;
    const scaleY = bounds.height / parent.offsetHeight || 1;
    popup.style.left = `${(pin.left + pin.width / 2 - bounds.left) / scaleX - parent.clientLeft + parent.scrollLeft}px`;
    popup.style.top = `${(pin.top - bounds.top) / scaleY - parent.clientTop + parent.scrollTop - 8}px`;
  };
  const observer = new ResizeObserver(position);
  observer.observe(popup.parentElement);
  window.addEventListener('resize', position);
  return (pin) => {
    if (anchor) observer.unobserve(anchor);
    anchor = pin;
    if (anchor) observer.observe(anchor);
    position();
  };
}
