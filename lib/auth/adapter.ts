import type { Adapter, VerificationToken } from 'next-auth/adapters';
import { getMongoDb } from '@/lib/mongo';

const OWNER_EMAIL = process.env.CRM_OWNER_EMAIL;

/**
 * Minimal single-operator adapter — no users collection (locked decision #5).
 * The only thing that needs real persistence is the one-time verification
 * token (it must survive across serverless invocations); the "user" is a
 * synthetic record derived from CRM_OWNER_EMAIL, never stored.
 *
 * Any email other than CRM_OWNER_EMAIL is rejected here so a token can never
 * be minted for it, independent of the `signIn` callback's own check.
 */
export function buildAuthAdapter(): Adapter {
  const ownerUser = (email: string) => ({ id: 'owner', email, emailVerified: null });

  return {
    async createVerificationToken(token: VerificationToken) {
      if (token.identifier !== OWNER_EMAIL) {
        throw new Error('verification token requested for non-owner email');
      }
      const db = await getMongoDb();
      await db.collection('verification_tokens').insertOne({ ...token });
      return token;
    },

    async useVerificationToken({ identifier, token }) {
      const db = await getMongoDb();
      const doc = await db
        .collection('verification_tokens')
        .findOneAndDelete({ identifier, token });
      if (!doc) return null;
      return { identifier: doc.identifier, token: doc.token, expires: doc.expires };
    },

    async getUserByEmail(email: string) {
      return email === OWNER_EMAIL ? ownerUser(email) : null;
    },

    async createUser(user: { email: string }) {
      if (user.email !== OWNER_EMAIL) throw new Error('cannot create a non-owner user');
      return ownerUser(user.email);
    },

    async getUser(id: string) {
      return id === 'owner' && OWNER_EMAIL ? ownerUser(OWNER_EMAIL) : null;
    },

    async getUserByAccount() {
      return null;
    },

    async linkAccount() {
      return undefined;
    },

    async updateUser(user) {
      return ownerUser(user.email as string);
    },
  } as Adapter;
}
