const units = [
  { from: 0, to: 1e3, unit: 'B' },
  { from: 1e3, to: 1e6, unit: 'KB' },
  { from: 1e6, to: 1e9, unit: 'MB' },
  { from: 1e9, to: 1e12, unit: 'GB' },
  { from: 1e12, to: 1e15, unit: 'TB' },
  { from: 1e15, to: 1e18, unit: 'PB' },
  { from: 1e18, to: 1e21, unit: 'EB' },
  { from: 1e21, to: 1e24, unit: 'ZB' },
  { from: 1e24, to: 1e27, unit: 'YB' },
];

export function bytesToString(bytes: number): string {
  const unit = units.find(u => bytes >= u.from && bytes < u.to) ?? units[3];
  return `${Math.floor(bytes / unit.from)} ${unit.unit}`;
}
