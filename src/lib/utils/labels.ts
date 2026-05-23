/** Shared label maps used across dashboard and join pages. */

export const RELATIONSHIP_LABELS: Record<string, string> = {
  parent: 'Parent / Guardian',
  therapist: 'Therapist',
  teacher: 'Teacher',
  researcher: 'Researcher',
  caregiver: 'Caregiver',
};

export const ROLE_LABELS: Record<string, string> = {
  child: 'Child',
  guardian: 'Guardian',
  therapist: 'Therapist',
  teacher: 'Teacher',
};

export const ROLE_COLORS: Record<string, string> = {
  child: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  guardian: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  therapist: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  teacher: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
