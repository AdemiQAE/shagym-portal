import { ComplaintStatus } from "@prisma/client";

/**
 * Карта разрешённых переходов между статусами жалобы.
 * PENDING → ACCEPTED / IN_PROGRESS / CANCELLED
 * ACCEPTED → IN_PROGRESS / CANCELLED
 * IN_PROGRESS → RESOLVED / CANCELLED
 * RESOLVED / CANCELLED — терминальные статусы
 */
export const ALLOWED_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  PENDING: ["ACCEPTED", "IN_PROGRESS", "CANCELLED"],
  ACCEPTED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["RESOLVED", "CANCELLED"],
  RESOLVED: [],
  CANCELLED: [],
};

export function isTransitionAllowed(
  from: ComplaintStatus,
  to: ComplaintStatus
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
