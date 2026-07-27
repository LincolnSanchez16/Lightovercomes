export const OPEN_EMAIL_SIGNUP_EVENT = 'light-overcomes:open-email-signup'

export function openEmailSignupPrompt() {
  window.dispatchEvent(new Event(OPEN_EMAIL_SIGNUP_EVENT))
}
