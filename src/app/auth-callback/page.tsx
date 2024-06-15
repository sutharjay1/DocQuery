'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '../_trpc/client';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const Page = ({ params }: any) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const origin = searchParams.get('origin');

	const { data, isError, isSuccess } = trpc.authCallback.useQuery(undefined, {
		retry: true,
		retryDelay: 500,
	});

	useEffect(() => {
		if (isSuccess) {
			router.push(origin ? `/${origin}` : '/dashboard');
		} else if (isError) {
			if (data?.error?.data?.code === 'UNAUTHORIZED') {
				router.push('/sign-in');
			}
		}
	}, [isSuccess, isError, router, origin, data]);

	// trpc.authCallback.useQuery(undefined, {
	// 	onSuccess: ({ success }) => {
	// 		if (success) {
	// 			// user is synced to db
	// 			router.push(origin ? `/${origin}` : '/dashboard');
	// 		}
	// 	},
	// 	onError: (err) => {
	// 		if (err.data?.code === 'UNAUTHORIZED') {
	// 			router.push('/sign-in');
	// 		}
	// 	},
	// 	retry: true,
	// 	retryDelay: 500,
	// });

	return (
		<div className="w-full mt-24 flex justify-center ">
			<div className="flex flex-col items-center gap-2">
				<Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
				<h3 className="font-semibold text-xl">
					Setting up your account...
				</h3>
				<p>You will be redirected automatically.</p>
			</div>
		</div>
	);
};

export default Page;
