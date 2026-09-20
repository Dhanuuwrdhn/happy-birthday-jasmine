// Self-check: node lib/logic.check.ts
import assert from 'node:assert/strict'
import { isUnlocked, remaining, shuffle, nextOutcome, teaseTarget } from './logic.ts'
import { content, unlockAt } from './content.ts'

const at = unlockAt.getTime()

assert.equal(isUnlocked(at - 1, unlockAt), false, 'one second before: still locked')
assert.equal(isUnlocked(at, unlockAt), true, 'exactly on time: open')
assert.equal(isUnlocked(at + 1, unlockAt), true, 'after: stays open')

assert.deepEqual(remaining(at, unlockAt), { days: 0, hours: 0, minutes: 0, seconds: 0 })
assert.deepEqual(remaining(at + 999999, unlockAt), { days: 0, hours: 0, minutes: 0, seconds: 0 }, 'never negative')
assert.deepEqual(remaining(at - (86400 + 3600 + 60 + 1) * 1000, unlockAt), {
  days: 1,
  hours: 1,
  minutes: 1,
  seconds: 1,
})

assert.equal(content.prizes.length, 2, 'must be exactly 2 prizes')
assert.ok(content.teases.length >= 4, 'need enough tease lines to not repeat too fast')
assert.equal(shuffle(content.prizes).length, 2, 'shuffle must not drop a prize')

// The game must tease first and still always be winnable.
assert.deepEqual(nextOutcome(0, 3, 0), { kind: 'tease' }, 'first pick always misses')
assert.deepEqual(nextOutcome(2, 3, 0), { kind: 'tease' }, 'still missing below the target')
assert.deepEqual(nextOutcome(3, 3, 0), { kind: 'prize', index: 0 }, 'wins on hitting the target')
assert.deepEqual(nextOutcome(9, 3, 1), { kind: 'prize', index: 1 }, 'second round hands over prize 2')
for (const r of [0, 0.5, 0.999]) {
  const t = teaseTarget(() => r)
  assert.ok(t >= 2 && t <= 4, `tease target out of range: ${t}`)
}

console.log('all checks passed')
