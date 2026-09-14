// src/utils/userGreeting.ts
// Replaces the mockUsers greeting helpers.

type Greetable =
  | string
  | { firstName?: string; lastName?: string; email?: string; role?: string }
  | null
  | undefined

function pickName(input: Greetable): string {
  if (!input) return ''
  if (typeof input === 'string') {
    // Could be "admin", "admin@example.com", or a full name
    if (input.includes('@')) {
      const local = input.split('@')[0]
      return local.charAt(0).toUpperCase() + local.slice(1)
    }
    return input.charAt(0).toUpperCase() + input.slice(1)
  }
  if (input.firstName) return input.firstName
  if (input.email) {
    const local = input.email.split('@')[0]
    return local.charAt(0).toUpperCase() + local.slice(1)
  }
  return ''
}

export function getUserGreeting(input: Greetable): string {
  const hour = new Date().getHours()
  const time = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const name = pickName(input)
  return name ? `${time}, ${name}` : time
}

export const getGreetingForUser = getUserGreeting