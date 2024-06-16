import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import {
	ChevronDown,
	ChevronUp,
	Expand,
	Fullscreen,
	Loader2,
} from 'lucide-react';
import SimpleBar from 'simplebar-react';
import PDFRenderer from './PDFRenderer';
import { useResizeDetector } from 'react-resize-detector';
import { Document, Page } from 'react-pdf';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

const PdfFullScreen = ({ url }: { url: string }) => {
	const { toast } = useToast();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const [numPages, setNumPages] = useState<number | null>();
	const [currPage, setCurrPage] = useState<number>(1);
	const [scale, setScale] = useState<number>(1.0);
	const [rotate, setRotate] = useState<number>(0);

	const { width, height, ref } = useResizeDetector();

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v) => {
				if (!v) setIsOpen(v);
			}}
		>
			<DialogTrigger
				asChild
				onClick={() => setIsOpen(true)}
			>
				<Button
					variant={'ghost'}
					aria-label="full screen"
				>
					<Expand className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-7xl w-full">
				<SimpleBar
					autoHide={false}
					className="max-h-[calc(100vh-10rem)] mt-6"
				>
					<div ref={ref}>
						<Document
							file={url}
							loading={
								<div className="flex-1 w-full h-full flex items-center justify-center">
									<Loader2 className="my-24 w-6 h-6 animate-spin" />
								</div>
							}
							onLoadError={() => {
								toast({
									title: 'Error loading PDF',
									description: 'Please try again later',
									variant: 'destructive',
								});
							}}
							onLoadSuccess={({ numPages }) => {
								setNumPages(numPages);
							}}
							className="max-w-full"
						>
							{new Array(numPages).fill(0).map((_, index) => (
								<Page
									key={index}
									width={width ? width : 1}
									pageNumber={index + 1}
									loading={
										<div className="flex justify-center">
											<Loader2 className="my-24 h-6 w-6 animate-spin" />
										</div>
									}
									className={'w-full flex justify-center'}
								/>
							))}
						</Document>
					</div>
				</SimpleBar>
			</DialogContent>
		</Dialog>
	);
};

export default PdfFullScreen;
