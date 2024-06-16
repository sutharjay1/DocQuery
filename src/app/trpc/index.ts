import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../db';
import { z } from 'zod';

export const appRouter = router({
	authCallback: publicProcedure.query(async () => {
		const { getUser } = getKindeServerSession();
		const user = await getUser();
		console.log('user', JSON.stringify(user, null, 2));

		if (!user.id || !user.email) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}

		// check if the user is in the database
		const dbUser = await db.user.findFirst({
			where: {
				id: user.id,
			},
		});

		if (!dbUser) {
			// create user in db
			await db.user.create({
				data: {
					id: user.id,
					email: user.email,
				},
			});
		}

		return { success: true };
	}),
	getUserFiles: privateProcedure.query(async ({ ctx }) => {
		const { user, userId } = ctx;

		return await db.file.findMany({
			where: {
				userId,
			},
		});
	}),
	deleteFile: privateProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { user, userId } = ctx;

			try {
				const file = await db.file.findFirst({
					where: {
						id: input.id,
						userId,
					},
				});

				if (!file) {
					throw new TRPCError({ code: 'NOT_FOUND' });
				}

				await db.file.delete({
					where: {
						id: input.id,
					},
				});
			} catch (error) {
				console.log(`Error deleting file: ${error}`);
			}
		}),
});

export type AppRouter = typeof appRouter;