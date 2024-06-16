'use client';

import { trpc } from '@/app/_trpc/client';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { ChevronLeft, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { useEffect } from 'react';

const ChatWrapper = ({ fileId }: { fileId: string }) => {
	const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
		{
			id: fileId,
		},
		{
			refetchInterval: (data: any) =>
				data?.status === 'SUCCESS' || data?.status === 'FAILED'
					? false
					: 500,
		}
	);
	console.log(`process.env.PINECONE_API_KEY`, process.env.OPENAI_API_KEY);
	if (isLoading)
		return (
			<div className="relative min-h-full bg-zinc-50 divide-y divide-zinc-200 flex flex-1 flex-col justify-center items-center gap-2">
				<div className="flex-1 w-full items-center justify-center flex flex-col mb-28">
					<div className="flex flex-col items-center gap-2">
						<Loader2 className="w-6 h-6 animate-spin" />
						<h3 className="font-semibold text-xl">Loading...</h3>
						<p className="text-zinc-500 text-sm">
							We&apos;re preparing your file for you.
						</p>
					</div>
				</div>

				<ChatInput isDisabled />
			</div>
		);

	if (data?.status === 'PROCESSING')
		return (
			<div className="relative min-h-full bg-zinc-50 divide-y divide-zinc-200 flex flex-1 flex-col justify-center items-center gap-2">
				<div className="flex-1 w-full items-center justify-center flex flex-col mb-28">
					<div className="flex flex-col items-center gap-2">
						<Loader2 className="w-6 h-6 animate-spin" />
						<h3 className="font-semibold text-xl">Processing...</h3>
						<p className="text-zinc-500 text-sm">
							This won&apos;t take long.
						</p>
					</div>
				</div>

				<ChatInput isDisabled />
			</div>
		);

	if (data?.status === 'FAILED')
		return (
			<div className="relative min-h-full bg-zinc-50 divide-y divide-zinc-200 flex flex-1 flex-col justify-center items-center gap-2">
				<div className="flex-1 w-full items-center justify-center flex flex-col mb-28">
					<div className="flex flex-col items-center gap-2">
						<XCircle className="w-6 h-6 text-red-500" />
						<h3 className="font-semibold text-xl">
							Too many pages in PDF
						</h3>
						<p className="text-zinc-500 text-sm">
							Your <span className="font-medium">Free</span> plan
							only supports up to 10 pages.
						</p>
						<Link
							href={'/dashboard'}
							className={cn(
								buttonVariants({
									variant: 'secondary',
									className: 'mt-2',
								}),
								'flex items-center justify-center max-w-fit'
							)}
						>
							<ChevronLeft className="w-4 h-4 text-zinc-500" />{' '}
							Back
						</Link>
					</div>
				</div>

				<ChatInput isDisabled />
			</div>
		);

	return (
		<div className="relative min-h-full bg-zinc-50 divide-y divide-zinc-200 flex flex-col justify-between gap-2">
			<div className="flex-1 justify-between flex flex-col mb-28">
				<Messages />
			</div>
			<ChatInput isDisabled />
		</div>
	);
};

export default ChatWrapper;
