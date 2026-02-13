/**
 * Shared constants used across client and server.
 * Single source of truth for values that appear in multiple places.
 */

/** How long a board stays alive since last access, in hours */
export const BOARD_EXPIRY_HOURS = 24

/** Board expiry in milliseconds (for JS Date math) */
export const BOARD_EXPIRY_MS = BOARD_EXPIRY_HOURS * 60 * 60 * 1000

/** Human-readable expiry label for UI display */
export const BOARD_EXPIRY_LABEL = `${BOARD_EXPIRY_HOURS} hours`

/** How long after soft-delete before a board is hard-deleted, in days */
export const HARD_DELETE_AFTER_DAYS = 7

/** Hard-delete threshold in milliseconds */
export const HARD_DELETE_AFTER_MS = HARD_DELETE_AFTER_DAYS * 24 * 60 * 60 * 1000

/** Maximum boards a single device can create */
export const MAX_BOARDS_PER_DEVICE = 10

/** Maximum participants per board */
export const MAX_PARTICIPANTS_PER_BOARD = 10
