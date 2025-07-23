declare global {
  namespace App {
    interface Locals {
      session: import('@auth/core').Session | null;
    }
  }
}

export {};
