# Feature Spec: Leftover Student Room Allocation
 
## 1. Problem This Solves
 
After the main allocation runs, there can be a small number of students left over — too few to justify opening a brand new room (e.g., as few as ~8 students). Opening a full new room for a handful of students wastes room capacity and invigilators. Instead, these leftover students should be absorbed into rooms that are already in use, by giving each room a small amount of **overflow capacity**.
 
---
 
## 2. Overflow Capacity Model
 
Every room, in addition to its normal seating layout, has **one extra row reserved for overflow**:
 
- **Extra row size:** 4 columns × 2 seats per bench = **8 seats**.
- This row is not used during normal allocation — it exists purely as a buffer for leftover students.
- A room's *effective* capacity for overflow purposes = normal capacity + 8 (this extra row), used only when needed.
---
 
## 3. Decision Rule: Overflow vs. New Room
 
The very first decision is a **threshold check on the size of the leftover group**, before any cascading is attempted:
 
Let:
- `L` = number of leftover students in the group (whatever the main allocation pass reports as unplaced — commonly `L = T mod R`, where `T` = total students in that allocation pool and `R` = standard per-room capacity, but `L` may also arise directly from unmatched-pairing counts; either way, the same rule applies to whatever `L` is)
- `OVERFLOW_CAPACITY = 8` (the fixed size of a room's extra row: 4 columns × 2 seats)
**Rule:**
```
if L == 0:
    → nothing to do, no leftovers
 
else if L > OVERFLOW_CAPACITY:      # L > 8
    → open a brand-new room for the entire leftover group
    → allocate it using the standard (existing) room-allocation logic,
      exactly as any other room would be filled
 
else:                                # 0 < L <= 8
    → attempt overflow placement into a previous room's extra row
      (see cascading search below)
```
 
This threshold exists because the extra row physically only has 8 seats — a group larger than 8 cannot fit in any single room's overflow row regardless of which room is tried, so there is no point cascading through previous rooms for a group of that size. Opening a new room is the only valid option once `L > 8`.
 
## 4. Cascading Search (only runs when `0 < L ≤ 8`)
 
1. **Target the most recently filled room first** (the "previous room" relative to allocation order — i.e., the last room that was fully allocated before the leftovers were identified).
2. Attempt to place the leftover students into that room's extra row (up to 8 seats), following the **same pairing rules already in place** for the rest of the room (no two same-exam students sharing a bench; different-branch/different-exam students may pair; a student with no valid pairing partner sits alone).
3. **If the leftover group fits into the extra row without breaking those constraints** → done. Allocation stops here.
4. **If the leftover group cannot be validly seated in that room's extra row** (e.g., all leftover students share an exam already present in that room, or in a way that would force an invalid same-exam pairing) → the leftover group is shifted to the **next previous room** (the second-most-recently-filled room) and step 2–3 repeats there.
5. This cascading continues backward through previously filled rooms, one room at a time, until a room is found where the leftover students can be seated in its extra row without violating the existing pairing constraints.
6. **If no previous room's extra row can accept the group** even after checking all of them, fall back to opening a new room for the group (same as the `L > 8` path).
**Important:** Only one room's extra row is used per leftover group when `L ≤ 8`. The group is not split across multiple rooms' overflow rows — it moves as a whole to the next candidate room if the current one doesn't work.
 
---
 
## 4. Effect on Room Capacity and Final Table
 
- Whichever room ends up absorbing the leftover students has its **effective capacity increased by the number of leftover seats used** (up to 8) for that exam session.
- This means that specific room's row/column layout in the final generated seating table will show more occupied seats than a "standard" room — **this is expected and acceptable**, not a bug.
- Only the room(s) that actually absorb overflow students are affected; all other rooms retain their original, unmodified layout.
- The existing constraint logic (same-exam students never share a bench, cross-branch pairing rules, solo seating when no valid partner exists) applies identically inside the extra row — the extra row is not a special exception zone, it's simply additional seats governed by the same rules.
---
 
## 5. Evaluation of Implementation Approaches
 
Three approaches were considered for handling leftover groups larger than the overflow row's 8-seat capacity:
 
| Approach | Description | Verdict |
|---|---|---|
| **A. Threshold + single-room cascade (chosen)** | `L ≤ 8` → search backward room-by-room for one room that can absorb the whole group in its extra row. `L > 8` → open a new room. | **Selected.** Deterministic, easy to reason about, and matches the physical constraint exactly (8 is a hard ceiling per room, not a soft target). Predictable for admins/invigilators: a leftover group either sits together in one room's overflow row, or gets a clean new room — never scattered. |
| **B. Split leftovers across multiple rooms' overflow rows** | If `L > 8`, distribute the group across two or more previous rooms' extra rows (e.g., 5 + 5) instead of opening a new room. | **Rejected.** Slightly better room utilization, but fragments a single leftover group across multiple physical rooms, which complicates invigilation, hall tickets/room-slips, and student lookup for no real benefit at this scale (leftover groups are inherently small). |
| **C. Best-fit search (pick the "best" previous room, not just the nearest)** | Instead of always trying the most recent room first, evaluate all previous rooms and pick the one that fits with the least disruption or most remaining slack. | **Rejected for now.** More optimal in theory, but adds real complexity (scoring/ranking rooms) for a case (`L ≤ 8`) that is already small and where "most recent room first" almost always succeeds in practice. Nearest-first is also more intuitive for students, who tend to expect sequential room assignment. |
 
**Why the modulo/threshold check is the right primitive:** the overflow row's capacity (8) is a fixed physical constraint, not a tunable parameter — so the decision is a simple comparison (`L > 8` vs. `L ≤ 8`), not an optimization problem. No search, sorting, or scoring is needed to decide *whether* to cascade; search is only needed to decide *which* room to cascade into, and a simple nearest-first linear scan is sufficient given how small these leftover groups are expected to be.
 
## 6. Edge Cases to Handle
 
| Case | Expected Behavior |
|---|---|
| Leftover group can't fit in ANY previous room's extra row (constraint conflicts everywhere) | Fall back to opening a new room for the remaining leftover students (existing new-room logic), rather than leaving students unallocated |
| Leftover group is smaller than 8 (e.g., 3–4 students) | Still follows the cascading logic (§4) — no minimum threshold required to attempt overflow placement |
| Leftover group is exactly 8 | Treated as `L ≤ 8` → attempt cascade, same as any group in that range |
| Leftover group is greater than 8 (`L > 8`) | **New room is opened directly** — no attempt to cascade or split across previous rooms' extra rows (see §3) |
| A room's extra row is already partially used by an earlier overflow pass in the same session | Only the remaining free seats in that extra row are available to the next leftover group being placed |
| Extra row would need to seat two same-exam students together to fit all leftovers | Not allowed — treat as "doesn't fit," cascade to the next previous room instead |
 
---
 
## 7. Summary of the Rule
 
> When leftover students remain, first check the count. If there are **more than 8**, just open a new room for them — the same as any normal room. If there are **8 or fewer**, don't open a new room: look at the most recently used room's spare row of 8 seats. If the leftovers can sit there without breaking the normal pairing rules, seat them there. If not, try the room before that one, and keep moving backward until one works (or, failing that, open a new room after all). The room that finally absorbs an overflow group simply has its capacity — and its printed layout — grow by that many seats; nothing else about the allocation changes.
 