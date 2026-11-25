const UNIT_SECONDS = {
  s: 1,
  m: 60,
  h: 3_600,
  d: 86_400,
} as const;

type DurationUnit = keyof typeof UNIT_SECONDS;

export function durationToSeconds(duration: string): number {
  const unit = duration.slice(-1) as DurationUnit;
  const amount = Number(duration.slice(0, -1));
  const multiplier = UNIT_SECONDS[unit];

  if (!Number.isInteger(amount) || amount <= 0 || multiplier === undefined) {
    throw new Error(`Duración inválida: "${duration}".`);
  }

  return amount * multiplier;
}
