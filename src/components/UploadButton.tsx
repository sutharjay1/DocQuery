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
				Uploading file...
			</DialogContent>
		</Dialog>
	);
};

export default UploadButton;
