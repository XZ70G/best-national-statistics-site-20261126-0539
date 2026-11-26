// Small chart helpers that draw SVG charts from plain data — no libraries, no network.
// Each function takes rows of { label, value } and returns an SVG string the views can drop
// into a page. Every chart also prints its values as text next to the bars, so the figure is
// readable even before the chart is looked at closely.

const BAR = '#0b6e4f';
const BAR_SOFT = '#7fb8a4';
const BAR_HIGHLIGHT = '#c98a1b';
const AXIS = '#5a6470';
const GRID = '#e3e7ea';

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Horizontal bars: one row per item, the value printed at the end of its bar.
// `format` turns a raw value into the text shown (for example v => v.toFixed(1) + '%').
export function horizontalBars(rows, { width = 640, rowHeight = 34, barHeight = 20, max = null, format = (v) => String(v), highlightIndex = -1, labelWidth = 170 } = {}) {
  const top = Math.max(...rows.map((r) => r.value), 0);
  const scaleMax = max ?? (top > 0 ? top : 1);
  const height = rows.length * rowHeight + 8;
  const plotX = labelWidth + 8;
  const plotWidth = width - plotX - 64;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart">`;
  rows.forEach((row, i) => {
    const y = 8 + i * rowHeight;
    const barWidth = Math.max(2, (row.value / scaleMax) * plotWidth);
    const fill = i === highlightIndex ? BAR_HIGHLIGHT : BAR;
    out += `<text x="0" y="${y + 15}" font-size="13" fill="#1d2733">${esc(row.label)}</text>`;
    out += `<rect x="${plotX}" y="${y + 2}" width="${barWidth.toFixed(1)}" height="${barHeight}" rx="3" fill="${fill}"/>`;
    out += `<text x="${plotX + barWidth + 8}" y="${y + 17}" font-size="13" font-weight="600" fill="#1d2733">${esc(format(row.value))}</text>`;
  });
  out += '</svg>';
  return out;
}

// Vertical bars: one column per item, the value printed above its bar.
export function verticalBars(rows, { width = 640, height = 300, format = (v) => String(v), highlightIndex = -1, baselineLabel = '' } = {}) {
  const top = Math.max(...rows.map((r) => r.value), 0);
  const scaleMax = top > 0 ? top * 1.15 : 1;
  const padTop = 26;
  const padBottom = 30;
  const padLeft = 8;
  const plotHeight = height - padTop - padBottom;
  const slot = (width - padLeft * 2) / rows.length;
  const barWidth = Math.min(44, slot * 0.62);
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart">`;
  out += `<line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padLeft}" y2="${height - padBottom}" stroke="${AXIS}" stroke-width="1"/>`;
  rows.forEach((row, i) => {
    const barHeight = (row.value / scaleMax) * plotHeight;
    const x = padLeft + i * slot + (slot - barWidth) / 2;
    const y = height - padBottom - barHeight;
    const fill = i === highlightIndex ? BAR_HIGHLIGHT : BAR;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="3" fill="${fill}"/>`;
    out += `<text x="${(x + barWidth / 2).toFixed(1)}" y="${(y - 7).toFixed(1)}" font-size="13" font-weight="600" fill="#1d2733" text-anchor="middle">${esc(format(row.value))}</text>`;
    out += `<text x="${(x + barWidth / 2).toFixed(1)}" y="${height - 10}" font-size="12" fill="#1d2733" text-anchor="middle">${esc(row.label)}</text>`;
  });
  if (baselineLabel) {
    out += `<text x="${width - padLeft}" y="${height - padBottom - 4}" font-size="11" fill="${AXIS}" text-anchor="end">${esc(baselineLabel)}</text>`;
  }
  out += '</svg>';
  return out;
}

// One stacked bar that splits a total into named parts. The bar itself carries no total
// label: the page text states the published total, and the two components as published do
// not sum to it exactly (the total is preliminary and the components are rounded), so no
// summed figure is printed here. The legend beside the chart names each part and its share.
export function stackedBar(parts, { width = 640, height = 46 } = {}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0);
  const barY = 10;
  const barHeight = 26;
  const fills = [BAR, BAR_HIGHLIGHT, BAR_SOFT];
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Stacked bar">`;
  let x = 0;
  parts.forEach((part, i) => {
    const w = (part.value / total) * width;
    out += `<rect x="${x.toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="${barHeight}" fill="${fills[i % fills.length]}"/>`;
    x += w;
  });
  out += '</svg>';
  return out;
}

// A two-part legend for a stacked bar, as HTML: a coloured swatch, a name and a value.
export function stackedLegend(parts) {
  const fills = [BAR, BAR_HIGHLIGHT, BAR_SOFT];
  return parts
    .map((part, i) => `<li><span class="swatch" style="background:${fills[i % fills.length]}"></span>${esc(part.label)}: <strong>${esc(part.valueText)}</strong> (${esc(part.shareText)})</li>`)
    .join('');
}
