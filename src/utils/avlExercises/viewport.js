export const MIN_ZOOM = 0.15;
export const MAX_ZOOM = 2.5;
export const clampZoom = value => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

export function zoomTransform(x, y, width, height, oldScale, newScale) {
    const ratio = newScale / oldScale;
    return { x: width / 2 - (width / 2 - x) * ratio,
        y: height / 2 - (height / 2 - y) * ratio };
}

// Keep dots between 18 and 36 screen pixels, with a fixed, discreet radius.
export function gridSpacing(scale) {
    let spacing = 24 * scale;
    while (spacing < 18) spacing *= 2;
    while (spacing > 36) spacing /= 2;
    return spacing;
}

export function fitZoom(width, height, viewportWidth, viewportHeight) {
    return clampZoom(Math.min(1, (viewportWidth - 16) / width, (viewportHeight - 16) / height));
}
