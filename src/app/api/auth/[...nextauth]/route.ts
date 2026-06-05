// Re-export the NextAuth handlers from the project's top-level `auth.ts` so the
// centralized auth configuration (MongoDB, credentials provider, callbacks)
// is used by the app route.
import { handlers } from '../../../../../auth';

export const GET = handlers.GET;
export const POST = handlers.POST;
