/* ==========================================================================
   DATA — Static, stateless data used across the app
   Nothing in this file imports from or depends on any other module.
   Everything else imports FROM here — it's the bottom of the
   dependency graph.
   ========================================================================== */

/* --------------------------------------------------------------------------
   WIN PATTERNS
   The 8 possible 3-in-a-row combinations, by board index.
   -------------------------------------------------------------------------- */
export const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

/* --------------------------------------------------------------------------
   AI MESSAGES
   Grouped by moment in the game. ai.js picks a random line from the
   relevant group at each moment — never the same category twice in a
   row feels robotic, so getRandomMessage() below also accepts the
   previously-shown line and avoids repeating it immediately.
   -------------------------------------------------------------------------- */
export const AI_MESSAGES = {
  idle: [
    "Good luck. You'll need it. 😏",
    "Ready when you are.",
    "Let's see what you've got.",
    "Make your move."
  ],
  afterHumanMove: [
    "Interesting move.",
    "Hmm, unexpected.",
    "You can do better.",
    "Noted.",
    "Bold choice.",
    "Curious opening."
  ],
  thinking: [
    "I'm calculating...",
    "Running the numbers...",
    "One second...",
    "Let me think..."
  ],
  winHuman: [
    "You actually got me.",
    "Well played.",
    "Didn't see that coming.",
    "Rematch?"
  ],
  winAI: [
    "Better luck next time.",
    "Told you so.",
    "Try Easy mode. 😏",
    "Calculated perfectly."
  ],
  draw: [
    "Well matched.",
    "Neither of us blinked.",
    "A fair fight."
  ]
};

/**
 * Picks a random line from an AI_MESSAGES category, avoiding an
 * immediate repeat of `lastMessage` when the category has more than
 * one option available.
 */
export function getRandomMessage(category, lastMessage = null) {
  const options = AI_MESSAGES[category] || AI_MESSAGES.idle;

  if (options.length === 1) return options[0];

  let pick;
  do {
    pick = options[Math.floor(Math.random() * options.length)];
  } while (pick === lastMessage);

  return pick;
}

/* --------------------------------------------------------------------------
   ACHIEVEMENTS
   Each entry's `condition(context)` is a pure predicate — given the
   result of a just-finished game, does this achievement unlock?
   achievements.js calls this against every NOT-YET-UNLOCKED entry
   after every game over.

   `context` shape (passed in by achievements.js):
   {
     result: 'win-human' | 'win-ai' | 'draw',
     difficulty: 'easy' | 'medium' | 'impossible',
     moveCount: number,   // total moves played this round (both players)
     currentStreak: number // consecutive human wins, including this one
   }
   -------------------------------------------------------------------------- */
export const ACHIEVEMENTS = [
  {
    id: 'first-win',
    icon: '🏆',
    title: 'First Win',
    description: 'Win your very first game against the AI.',
    condition: (ctx) => ctx.result === 'win-human'
  },
  {
    id: 'win-streak',
    icon: '🔥',
    title: 'Win Streak',
    description: 'Beat the AI 3 times in a row.',
    condition: (ctx) => ctx.result === 'win-human' && ctx.currentStreak >= 3
  },
  {
    id: 'beat-impossible',
    icon: '🤖',
    title: 'Beat Impossible AI',
    description: 'Defeat the AI on Impossible difficulty.',
    condition: (ctx) => ctx.result === 'win-human' && ctx.difficulty === 'impossible'
  },
  {
    id: 'speed-win',
    icon: '⚡',
    title: 'Speed Win',
    // The fastest a human (X) can possibly win is by move 5 of the
    // round (X,O,X,O,X) — so <= 5 total moves means "as fast as it gets."
    description: 'Win in the fewest possible moves.',
    condition: (ctx) => ctx.result === 'win-human' && ctx.moveCount <= 5
  }
];
