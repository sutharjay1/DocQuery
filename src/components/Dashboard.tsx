'use client';

import MaxWidthWrapper from './MaxWidthWrapper';
import UploadButton from './UploadButton';
import { trpc } from '@/app/_trpc/client';
import { Ghost, Loader2, MessageSquare, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { useState } from 'react';

const Dashboard = () => {
	const utils = trpc.useContext();

	const [currentDeletingFile, setCurrentDeletingFile] = useState<
		string | null
	>(null);

	const { data: files, isLoading } = trpc.getUserFiles?.useQuery();

	const { mutate } = trpc.deleteFile?.useMutation({
		onSuccess: () => {
			// refetch user files
			utils.getUserFiles.invalidate();
		},
		onMutate: ({ id }) => {
			setCurrentDeletingFile(id);
		},
		onSettled: () => {
			setCurrentDeletingFile(null);
		},
	});

	return (
		<main className="mx-auto max-w-7xl md:p-10">
			<div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:gap-0 px-2 md:px-0">
				<h1 className="mb-3 font-bold text-5xl text-zinc-900">
					My Files
				</h1>
				<div className="hidden md:block">
					<UploadButton />
				</div>
			</div>

			{/* display all user files */}
			{files && files.length !== 0 ? (
				<ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
					{files
						.sort(
							(a, b) =>
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime()
						)
						.map((file) => (
							<li
								key={file.id}
								className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg mx-2 md:mx-0"
							>
								<Link
									href={`/dashboard/file/${file.id}`}
									className="flex flex-col gap-2"
								>
									<div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
										<div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
										<div className="flex-1 truncate">
											<div className="flex items-center space-x-3">
												<h3 className="truncate text-lg font-medium text-zinc-900">
													{file.name}
												</h3>
											</div>
										</div>
									</div>
								</Link>
								<div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
									<div className="flex items-center gap-2">
										<Plus className="h-4 w-4" />
										{format(
											new Date(file.createdAt),
											'MMM yyyy'
										)}
									</div>

									<div className="flex items-center gap-2">
										<MessageSquare className="h-4 w-4" />
										mocked
									</div>
									<Button
										size={'sm'}
										className="w-full"
										variant="destructive"
										onClick={() => mutate({ id: file.id })}
									>
										{currentDeletingFile === file.id ? (
											<Loader2 className="w-5 h-5 animate-spin text-destructive-foreground" />
										) : (
											<Trash className="h-4 w-4" />
										)}
									</Button>
								</div>
							</li>
						))}
				</ul>
			) : isLoading ? (
				<Skeleton
					height={100}
					className="my-2"
					count={3}
				/>
			) : (
				<div className="flex flex-1 items-center justify-center rounded-lg border border-zinc-300 border-dashed shadow-sm mt-16 py-16  mx-2 md:mx-0  ">
					<div className="flex flex-col items-center gap-1 text-center">
						<Ghost
							className=" text-zinc-800"
							size={32}
						/>
						<h3 className="text-2xl font-semibold tracking-tight">
							Pretty empty at the moment
						</h3>
						<p className="text-sm text-muted-foreground">
							Let&apos;s upload your first PDF
						</p>
						<UploadButton className="mt-4" />
					</div>
				</div>
			)}
		</main>
	);
};

export default Dashboard;
