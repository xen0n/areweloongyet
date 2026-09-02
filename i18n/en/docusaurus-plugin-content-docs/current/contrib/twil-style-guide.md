---
sidebar_position: 11
---

# TWiL Writing Style Guide

{/* SPDX-License-Identifier: CC-BY-NC-SA-4.0 */}

This document codifies the writing style of the *This Week in LoongArch* (TWiL)
newsletter, based on quantitative and qualitative analysis of all 54 issues
(~1,836 news items) through early 2025. Style evolves over time; this document
reflects the established patterns as observed.

:::info[Intended audience]

This document is for both **human editors** and **AI agent collaborators**
(e.g., the editor's coding assistant) of the TWiL newsletter.

- Human editors use it to maintain stylistic consistency.
- AI agents use it to understand the expected output patterns when drafting items.

:::

## Analysis tooling

This style guide is derived from metrics produced by
[`scripts/analyze-newsletter.py`](../../scripts/analyze-newsletter.py). The
script parses all newsletter issues and outputs per-item word/sentence counts,
verb-on-link ratios, editorial-tone detection, and science-communication depth.
See the script's module docstring for reproduction commands.

## Brevity

### Item length

| Statistic | Value |
|---|---|
| Mean words / item | 51 |
| Median words / item | ~35 |
| Mean sentences / item | 1.5 |
| Exactly 1 sentence | 66.1% |
| 1-2 sentences | 87.6% |

The vast majority of items are **one or two sentences**. If an item exceeds
3 sentences, consider splitting (if readability permits) or verify that it
truly forms an indivisible reporting unit.

### Rules of thumb

- Routine news items: target **1-2 sentences**, **20-80 words**.
- Supplementary explanation (background, rationale, impact): add 1-2 more
  sentences; keep the total under 5 sentences.
- Bullet items are typically shorter (30-40 words); suitable for list-style
  browsing.
- Regular weekly issues average 25-50 items; omnibus issues can contain
  60-190 items.

## Sentence construction

### Dominant template

News-reporting items almost universally follow this pattern:

> **Actor** `[`**action-verb** + perfective`](`link`)` **object / context**

Examples (translated from Chinese originals):

```
Huacai Chen [submitted](https://lore.kernel.org/...) a cpufreq driver for
Loongson 3 processors.
Xi Ruoyao [fixed](https://gcc.gnu.org/...) several issues in the LoongArch
hardware breakpoint implementation.
Bibo Mao [implemented](https://lore.kernel.org/...) paravirtualized qspinlock
for LoongArch KVM.
```

### Link placement

- **55.3% of links are placed directly on the verb** — this is the defining
  stylistic signature.
- Remaining links sit on noun phrases (e.g., `[the upstream tracking
  issue](url)`, `[the relevant kernel patches](url)`).
- New items should prefer the verb-on-link pattern.

### Top-10 link verbs

The following verbs most frequently carry the inline link in published items:

`fixed` (96), `added` (47), `posted` (29), `submitted` (24), `optimized` (19),
`released` (18), `implemented` (18), `sent out` (14), `merged` (12),
`enabled` (12)

(In the Chinese source text these all carry the perfective suffix `了`, the
equivalent of past/completed tense.)

### Tense

- **Past/completed** (verb + 了) dominates news-reporting items — natural for
  journalism.
- **Present / continuous** appears in explanatory content: *this means…*,
  *because of this…*, *currently…*.
- Bullet items occasionally omit the sentence-final period but retain the
  perfective marker `了`.

## Editorial commentary

### When to inject editorial voice

Roughly 10% of items carry explicit editorial markers (excluding standalone
`:::info` blocks). Commentary appears in the following situations:

| Situation | Typical phrasing (Chinese) |
|---|---|
| Thanking contributors | `辛苦了！`, `欢迎欢迎！`, `让我们感谢…`, `（感谢 … 的线索投递）` |
| Corrections / apologies | `更正声明`, `有失偏颇`, `在此谨向…道歉` |
| Explaining significance | `这意味着…`, `鉴于此…`, `因此…` |
| Providing historical context | `从前…`, `先前…`, `在…的年代` |
| Speculation / analysis | `大概率…`, `笔者猜测…`, `笔者认为…` |
| Code-quality judgments | `不可接受`, `遑论`, `优雅不能当饭吃` |
| Editor-in-chief commentary | Dedicated remarks on ABI decisions, toolchain changes |

### `:::info` block usage

- **Technical deep dives**: explain *how* a mechanism works (e.g., linker
  relaxation internals)
- **Historical context**: the backstory behind an event (e.g., why a PR was
  delayed)
- **Corrections / clarifications**: amend or supplement prior coverage
- **Editor-in-chief commentary**: opinions on significant design decisions
- **Citation notices**: e.g., fair-use declarations
- `:::tip` blocks are used for lighthearted trivia or tips

### Rules of thumb

- Editorial voice should feel **natural and restrained**. Do not comment on
  every item.
- `:::info` blocks should carry a clear title (`[Title]`) and be self-contained.
- When correcting prior coverage, use the `:::info[更正声明]` (Corrigendum)
  format with formal, accountable language.
- Gratitude should be sincere and concise; avoid hyperbole.

## Science communication

### Current distribution

Based on automated classification of 1,836 items:

| Depth | Count | % |
|---|---|---|
| None (pure reporting) | 1,226 | 66.8% |
| Slight (1 explanatory cue) | 337 | 18.3% |
| Moderate (2-3 cues) | 201 | 10.9% |
| Detailed (4+ cues) | 72 | 3.9% |

The explanation rate shows an upward trend: 28.0% (2023) → 38.7% (2024) →
40.3% (2025, early data).

### Topics that warrant explanation

The following domains routinely receive detailed scientific explanation:

| Domain | What gets explained |
|---|---|
| **Linux kernel internals** | Why LoongArch uses `statx` instead of `fstat`; security properties of vDSO `getrandom`; how paravirt qspinlock achieves 566% speedup |
| **ABI design decisions** | Why `R_LARCH_CALL36` keeps its encoding; "PC-relative" vs. "PC-aligned" semantics; why `pcaddu18i` was never added |
| **Compiler optimization** | Why `bstrins` beats shift+mask; how linker relaxation interacts with `-mexplicit-relocs`; the four independent root causes of a GCC CoreMark regression |
| **ISA design** | Instruction-bitfield analysis of the FP16/FP128 encoding gap; LA464's 32-bit division undefined behavior; how LA664 fixes it |
| **Toolchain background** | What BOLT is and why it matters; how the documentation repository status blocked binutils changes |

The following topics are typically reported **without** explanation:

- Routine bug fixes (verb-only, no rationale)
- Simple feature additions
- Distribution news (`X released an ISO`)
- Most individual LLVM patches
- Community fun / game testing

### Recommended explanation structure

When explanation is warranted, follow a **three-part structure**:

1. **Fact** (1 sentence, past tense): X \[did\](link) Y.
2. **Why it matters / how it works** (1-3 sentences, present tense): This was
   necessary because Z. This means…
3. **Impact / takeaway** (0-1 sentence): Therefore, users should… / This enables…

### Quantifying explanation depth

The analysis script uses seven categories of discourse markers to estimate
depth:

| Category | Example markers (Chinese) |
|---|---|
| **Cause** | 因为、由于、这是因为、原因是、具体来说 |
| **Consequence** | 这意味着、这会导致、其作用、其目的是 |
| **Purpose** | 用于、以实现、来达到、从而、以便 |
| **Contrast** | 相比之下、与…不同、而非、而不是 |
| **Temporal** | 先前、此前、过去、原本、现在、随后 |
| **Definition** | 是一种、指的是、对应、等同于、相当于 |
| **Modality** | 需要、要求、必须、应该、可以 |

Count ≥ 4 → detailed; 2-3 → moderate; 1 → slight; 0 → pure reporting.

## Examples

### Pure reporting

```
Tiezhu Yang [fixed](https://lore.kernel.org/...) some details in the handling
of the TIF_LOAD_WATCH thread flag for userspace watchpoints.
```

### Slight explanation

```
Hui Li [fixed](https://lore.kernel.org/...) several issues in the LoongArch
hardware breakpoint implementation.
```

### Moderate explanation

```
On July 5, Sui Jingfeng [merged](https://cgit.freedesktop.org/...) the
Loongson display controller DRM driver. He had [obtained](https://gitlab.freedesktop.org/...)
commit access to the drm-misc repository the day before. This means integrated
graphics users should be able to light up a display with upstream kernels going
forward; 2D/3D acceleration is separate work.
```

### Detailed explanation + editorial commentary

See the `:::info` blocks throughout the newsletter archives for extended
discussions of linker relaxation, ABI design decisions, ISA encoding analysis,
and similar deep topics. These are typically placed in standalone callout
blocks rather than inline in reporting items.

## Reporting principles

### Provenance links

**Every TWiL news item must carry at least one source link.** This allows
readers to verify and explore items independently, and supports future
traceability. Pure editorial items (transitions, section boilerplate, etc.)
are exempt.

This rule applies to all sections, including `社区整活:儿:` (community fun).
If something has no public link to cite, then the editor could not have
known about it — if content is genuinely worth reporting but exists only in
non-public channels (e.g., a WeChat group chat; WeChat does not support
exporting chat history as a public URL):

- The editor **must** first obtain permission from the original author to
  reproduce the content.
- After obtaining permission, the editor should move the content to a
  publicly visible location (screenshots or other suitable forms) and cite
  that location in the newsletter.
- The editor **must not** guess or fabricate a URL. If no source link can be
  provided, the item must be removed.

:::info[Additional requirements for AI agents]

When an AI agent encounters an item with no source link:

- If a public source can be located by the agent (e.g., lore.kernel.org,
  a GitHub PR), the agent must explicitly inform the user that it found the
  link and **ask the user for double confirmation**, to guard against
  hallucination.
- If no source can be located, the agent must report this to the user and
  request a link; it must not bypass this step to publish.
- Record the provenance method in the commit message (agent-located link
  with confirmation / user-supplied / not found and removed).

:::

### Patchset reporting granularity

Patchsets are the primary source of Linux kernel and toolchain news. To
maintain scannability:

- **Only report the latest revision if it contains a significant change.**
  "Significant" means: a design overhaul, a rewrite of the implementation
  under a similar design, or a takeover of upstream work (author change).
- Routine review follow-ups and minor fixes (typo fixes, comment additions,
  cc stable additions/removals, etc.) **do not constitute a news item**.
- If a patchset was already covered in earlier issues and the new revision
  has no significant change: **drop the item entirely**.
- In other words, only **non-trivial work submissions** and **formal releases**
  (merged to mainline, new version tagged, etc.) count as "news". Regular
  follow-up work does not.

This means that most "v1→review→v2→review→v3" chains from other newsletters
will, after adaptation, either collapse to **at most one sentence** (if the
latest revision is significant) or **the entire item will be removed**
(if it is just the Nth trivial revision).

#### Special handling for backports

Backports are an exception to the rule above. Although they relate to
previously covered patches, they are **standalone patchsets** in their own
right and carry practical value for downstream distribution maintainers:

- **First submission of a backport** and the **final merged/shipped
  notification** count as "news" and should be retained.
- Routine revisions within a backport patchset (typo fixes, cc stable
  adjustments, etc.) still follow the regular granularity rule and do not
  constitute reportable items.

## Adapting contributions from other newsletters

Contributors (including new editors) may simultaneously write for other
LoongArch newsletters. These newsletters serve different audiences, so the raw
copy may systematically diverge from TWiL style:

- **Newsletters targeting non-technical readers** include inline parenthetical
  term explanations and track review rounds step by step.
- **TWiL targets a technical audience** that is expected to follow links or
  look up context independently. Items should be self-contained and scannable.

### Common divergences and how to handle them

| Divergence | Other newsletter style | TWiL treatment |
|---|---|---|
| **Review cycles** | Track full v1→review→v2→review→v3 arcs | Apply [patchset reporting granularity](#patchset-reporting-granularity): keep only the latest revision with significant changes; drop entirely if no significant change |
| **Term explanations** | `PR_SET_SYSCALL_USER_DISPATCH (a Linux prctl operation that…)` | Delete the parenthetical. If a concept genuinely needs explanation for TWiL readers, expand it into a `:::info` block |
| **Item coverage** | Exhaustive lists (e.g., every single Box64 PR — 11 items) | Curate to 2-3 highlights; summarise or omit the rest |
| **Verb choice** | `添加了` (added) | Replace with `增加了` (TWiL prefers the more abstract form) |
| **Editorial voice** | Neutral, cold, no commentary | If something merits commentary, add a `:::info` block or a brief *this means…* sentence; otherwise do not force it |

### Adaptation checklist

When receiving raw copy written for (or influenced by the style of) another
newsletter, apply the following steps:

1. **Apply patchset granularity rules**: Split or drop items that cover multiple
   patch revisions or review rounds. Keep only the latest revision with a
   [significant change](#patchset-reporting-granularity) (design overhaul,
   implementation rewrite, author change). Drop routine follow-up work (typo
   fixes, cc stable changes, review back-and-forth) entirely.
2. **Check provenance**: Ensure every news item has at least 1 source link.
   For items without links: locate the link yourself and ask the user for
   double confirmation, or ask the user to supply one. Drop items that cannot
   be sourced. Comply with all [provenance link](#provenance-links)
   constraints (including the public-traceability requirement for
   `社区整活:儿:` items).
3. **Remove inline explanations**: Delete parenthetical term explanations
   (`(a Linux prctl operation that…)`) from reporting sentences. If a concept
   genuinely needs a science-communication treatment for the TWiL audience,
   expand it into a standalone `:::info` block instead.
4. **Trim exhaustive lists**: Reduce long itemised lists (e.g., every commit
   from a single project) to 2-3 highlights.
5. **Normalize terminology**: Check and replace wording that deviates from the
   style guide (e.g., `添加` → `增加`).
6. **Verify section coverage**: Confirm that all mandatory sections
   (`先「马」再看`, `杂闻播报`, `张贴栏`) are covered. The
   `社区整活:儿:` (community fun) section is optional — omit if nothing
   sufficiently interesting happened this week.
7. **Supplement editorial commentary** (as needed): If the issue contains
   topics worth a deeper dive, add 1-2 `:::info` blocks. If there are
   contributors worth thanking or code-quality observations worth making, use
   the established editorial markers. Do not force it — a more reportorial
   issue is preferable to one with contrived personality.
8. **Fix metadata**: Verify that `slug`, `date`, `draft` status, and other
   frontmatter fields are correct.
