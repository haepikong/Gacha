import type { TeamItem } from '../data/mascots';

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Finds a randomized ordering of `pool` where consecutive elements satisfy
 * `|a.id - b.id| >= minGap` (and the first element satisfies the gap from `lastId`).
 * Returns null if no such ordering exists within the search budget.
 */
function findSpacedOrdering(
  pool: TeamItem[],
  lastId: number | null,
  minGap: number,
  maxSteps = 800
): TeamItem[] | null {
  if (pool.length === 0) return [];

  let steps = 0;
  const used = new Array<boolean>(pool.length).fill(false);
  const result: TeamItem[] = [];

  const backtrack = (prevId: number | null): boolean => {
    if (result.length === pool.length) return true;
    if (++steps > maxSteps) return false;

    // Gather valid unused indices and randomize order for fair draws
    const candidates: number[] = [];
    for (let i = 0; i < pool.length; i++) {
      if (used[i]) continue;
      if (prevId === null || Math.abs(pool[i].id - prevId) >= minGap) {
        candidates.push(i);
      }
    }

    if (candidates.length === 0) return false;

    // Shuffle candidates; when unconstrained, bias slightly away from dead-end extremes for small n
    const shuffledIndices = shuffleArray(candidates);

    for (const idx of shuffledIndices) {
      used[idx] = true;
      result.push(pool[idx]);
      if (backtrack(pool[idx].id)) return true;
      result.pop();
      used[idx] = false;
    }

    return false;
  };

  return backtrack(lastId) ? result : null;
}

/**
 * Fallback ordering when strict non-consecutive spacing is mathematically impossible
 * (e.g., only 2 adjacent teams remain, or 3 teams starting from the middle).
 * Greedily picks the farthest available team at each step to maximize spacing.
 */
function buildMaxGapOrdering(pool: TeamItem[], lastId: number | null): TeamItem[] {
  const remaining = shuffleArray(pool);
  const result: TeamItem[] = [];
  let prevId = lastId;

  while (remaining.length > 0) {
    let bestGap = -1;
    let bestIndices: number[] = [];

    for (let i = 0; i < remaining.length; i++) {
      const gap = prevId === null ? 999 : Math.abs(remaining[i].id - prevId);
      if (gap > bestGap) {
        bestGap = gap;
        bestIndices = [i];
      } else if (gap === bestGap) {
        bestIndices.push(i);
      }
    }

    const chosenIdx = bestIndices[Math.floor(Math.random() * bestIndices.length)];
    const [picked] = remaining.splice(chosenIdx, 1);
    result.push(picked);
    prevId = picked.id;
  }

  return result;
}

/**
 * Generates a complete randomized presentation order for `eligibleTeams`
 * that prevents duplicate teams and avoids consecutive team numbers.
 * When enough teams are available, it attempts a wider gap (>= 3) first.
 */
export function generateSpacedOrder(
  eligibleTeams: TeamItem[],
  lastId: number | null
): TeamItem[] {
  if (eligibleTeams.length <= 1) return [...eligibleTeams];

  // Try wider spacing (>= 3) first when enough teams exist
  if (eligibleTeams.length >= 7) {
    for (let attempt = 0; attempt < 6; attempt++) {
      const wider = findSpacedOrdering(eligibleTeams, lastId, 3, 600);
      if (wider) return wider;
    }
  }

  // Standard non-consecutive spacing (>= 2)
  for (let attempt = 0; attempt < 12; attempt++) {
    const nonConsecutive = findSpacedOrdering(eligibleTeams, lastId, 2, 1000);
    if (nonConsecutive) return nonConsecutive;
  }

  // Unavoidable edge case (e.g. only {2, 3} remaining): maximize distance
  return buildMaxGapOrdering(eligibleTeams, lastId);
}

/**
 * Picks a single team from `eligibleTeams` that:
 * 1. Is never a duplicate (only picks from `eligibleTeams`).
 * 2. Avoids consecutive team numbers from `lastId` (|id - lastId| >= 2, and prefers >= 3 when pool is large).
 * 3. Preserves a valid non-consecutive continuation for the remaining teams whenever possible.
 */
export function pickSpacedTeam(
  eligibleTeams: TeamItem[],
  lastId: number | null
): TeamItem {
  if (eligibleTeams.length === 1) return eligibleTeams[0];

  const desiredGap = eligibleTeams.length >= 7 ? 3 : 2;

  const pickWithLookahead = (candidates: TeamItem[]): TeamItem | null => {
    const shuffled = shuffleArray(candidates);
    // Prefer candidates that still leave a valid non-consecutive path for remaining teams
    for (const candidate of shuffled) {
      const rest = eligibleTeams.filter((t) => t.id !== candidate.id);
      if (rest.length === 0 || findSpacedOrdering(rest, candidate.id, 2, 500) !== null) {
        return candidate;
      }
    }
    return null;
  };

  // Tier 1: Candidates meeting desiredGap (3 for large pools, 2 for smaller pools)
  const tier1 =
    lastId === null
      ? eligibleTeams
      : eligibleTeams.filter((t) => Math.abs(t.id - lastId) >= desiredGap);

  if (tier1.length > 0) {
    const smartPick = pickWithLookahead(tier1);
    if (smartPick) return smartPick;
    if (desiredGap === 2) {
      return tier1[Math.floor(Math.random() * tier1.length)];
    }
  }

  // Tier 2: Candidates meeting minimum non-consecutive gap (>= 2)
  if (desiredGap > 2 && lastId !== null) {
    const tier2 = eligibleTeams.filter((t) => Math.abs(t.id - lastId) >= 2);
    if (tier2.length > 0) {
      const smartPick = pickWithLookahead(tier2);
      if (smartPick) return smartPick;
      return tier2[Math.floor(Math.random() * tier2.length)];
    }
  }

  // Tier 3: Unavoidable edge case (e.g. only 2 teams left adjacent to lastId) -> pick farthest
  if (lastId !== null) {
    let maxGap = -1;
    let farthest: TeamItem[] = [];
    for (const t of eligibleTeams) {
      const gap = Math.abs(t.id - lastId);
      if (gap > maxGap) {
        maxGap = gap;
        farthest = [t];
      } else if (gap === maxGap) {
        farthest.push(t);
      }
    }
    if (farthest.length > 0) {
      return farthest[Math.floor(Math.random() * farthest.length)];
    }
  }

  return eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)];
}
