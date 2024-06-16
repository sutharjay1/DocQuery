'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Dropzone from 'react-dropzone';
import { Cloud, File, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';

const UploadDropZone = () => {
	const [isUploading, setIsUploading] = useState<boolean>(true);
	const [uploadProgress, setUploadProgress] = useState<number>(0);

	const startSimulatedProgress = () => {
		setUploadProgress(0);

		const interval = setInterval(() => {
			setUploadProgress((prevProgress: number) => {
				if (prevProgress >= 95) {
					clearInterval(interval);
					return prevProgress;
				}
				return prevProgress + 5;
			});
		}, 500);
		return interval;
	};

	return (
		<Dropzone
			multiple={false}
			onDrop={async (acceptedFiles) => {
				console.log(`dropped`, acceptedFiles);
				setIsUploading(true);

				const progressInterval = startSimulatedProgress();

				//handle file uploading
				await new Promise((resolve) => setTimeout(resolve, 10000));

				clearInterval(progressInterval);
				setUploadProgress(100);
			}}
		>
			{({ getInputProps, getRootProps, acceptedFiles }) => (
				<div
					{...getRootProps()}
					className="h-64 border mx-1 my-2 border-dashed border-zinc-300 rounded-lg"
				>
					<div className="flex items-center justify-center w-full h-full">
						<label
							htmlFor="dropzone-file"
							className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100"
						>
							<div className="flex flex-col items-center justify-center pt-5 pb-6 select-none">
								<Cloud className="w-10 h-10 text-zinc-400 mb-2" />
								<p className="mb-2 text-sm text-zinc-700">
									<span>Click to upload</span>or drag and drop
								</p>
								<p className="text-xs text-zinc-500">
									PDF (Up to 4MB)
								</p>
							</div>
							<input {...getInputProps()} />

							{acceptedFiles && acceptedFiles[0] ? (
								<div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
									<div className="px-3 py-2 h-full grid place-items-center">
										<File className="h-4 w-4 text-primary" />
									</div>
									<div className="px-3 py-2 text-sm truncate">
										{acceptedFiles[0].name}
									</div>
								</div>
							) : null}

							{isUploading ? (
								<div className="w-full mt-4 max-w-xs mx-auto">
									<Progress
										value={uploadProgress}
										className="h-1 w-full bg-zinc-200"
									/>
								</div>
							) : null}
						</label>
					</div>
				</div>
			)}
		</Dropzone>
	);
};

const UploadButton = ({ className }: { className?: string }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v) => {
				if (!v) {
					setIsOpen(v);
				}
			}}
		>
			<DialogTrigger
				onClick={() => setIsOpen(true)}
				asChild
			>
				<Button
					variant="ghost"
					className={cn(
						'mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-md border border-zinc-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-zinc-300 hover:bg-zinc-100 cursor-default',
						className
					)}
				>
					Upload File
				</Button>
			</DialogTrigger>
			<DialogContent className="backdrop-blur-xl">
				<UploadDropZone />
			</DialogContent>
		</Dialog>
	);
};

export default UploadButton;
