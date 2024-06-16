'use client';

import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {
	ChevronDown,
	ChevronUp,
	Loader2,
	Rotate3D,
	RotateCw,
	Search,
	ZoomIn,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Input } from './ui/input';
import SimpleBar from 'simplebar-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `//mozilla.github.io/pdf.js/build/pdf.mjs`;

interface PDFRendererProps {
	url: string;
}

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PdfFullScreen from './PdfFullScreen';

const PDFRenderer: React.FC<PDFRendererProps> = ({ url }) => {
	const { toast } = useToast();
	const { width, height, ref } = useResizeDetector();

	console.log(`width: ${width}`);

	const [numPages, setNumPages] = useState<number | null>();
	const [currPage, setCurrPage] = useState<number>(1);
	const [scale, setScale] = useState<number>(1.0);
	const [rotate, setRotate] = useState<number>(0);
	const [renderedscale, setRenderedScale] = useState<number | null>(null);

	const isLoading = renderedscale !== scale;

	const CustomPageValidator = z.object({
		page: z
			.string()
			.refine((val) => Number(val) > 0 && Number(val) <= numPages!, {
				message: 'Page out of range',
			}),
	});

	type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<TCustomPageValidator>({
		defaultValues: {
			page: '1',
		},
		resolver: zodResolver(CustomPageValidator),
	});

	const handlePageSubmit = (page: TCustomPageValidator) => {
		setCurrPage(Number(page.page));
		setValue('page', String(page.page));
	};

	return (
		<div className="w-full bg-white rounded-md shadow flex flex-col items-center">
			<div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
				<div className="flex items-center gap-1.5">
					<Button
						disabled={currPage <= 1}
						onClick={() => {
							setCurrPage((prev) =>
								prev - 1 > 1 ? prev - 1 : 1
							);
							setValue('page', String(currPage - 1));
						}}
						variant="ghost"
						aria-label="previous page"
					>
						<ChevronDown className="h-4 w-4" />
					</Button>
					<div className="flex items-center gap-1.5">
						<Input
							className={cn(
								'w-12 h-8',
								errors.page && 'focus-visible:ring-red-600'
							)}
							{...register('page')}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleSubmit(handlePageSubmit)();
								}
							}}
						/>
						<p className="text-zinc-700 text-sm space-x-1">
							<span>of</span>
							<span>{numPages ?? 'x'}</span>
						</p>
					</div>
					<Button
						disabled={
							numPages === undefined || currPage === numPages
						}
						onClick={() => {
							setCurrPage((prev) =>
								prev + 1 > numPages! ? numPages! : prev + 1
							);
							setValue('page', String(currPage + 1));
						}}
						variant="ghost"
						aria-label="next page"
					>
						<ChevronUp className="h-4 w-4" />
					</Button>
				</div>

				<div className="space-x-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								aria-label="zoom"
								variant={'ghost'}
								className="gap-1"
							>
								<Search className="h-4 w-4" />
								{scale * 100}%
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onSelect={() => setScale(1.0)}>
								100%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(1.25)}>
								125%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(1.5)}>
								150%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(1.75)}>
								175%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2.0)}>
								200%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2.5)}>
								250%
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						aria-label="rotate 90 degrees"
						onClick={() => setRotate((prev) => prev + 90)}
						variant={'ghost'}
					>
						<RotateCw className="h-4 w-4" />
					</Button>
					<PdfFullScreen url={url} />
				</div>
			</div>

			<div className="flex-1 w-full max-h-screen">
				<SimpleBar
					autoHide={false}
					className="max-h-[calc(100vh-10rem)] "
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
							{isLoading && renderedscale ? (
								<Page
									width={width ? width : 1}
									pageNumber={currPage}
									scale={scale}
									rotate={rotate}
									key={'@' + renderedscale}
									loading={
										<div className="flex justify-center">
											<Loader2 className="my-24 h-6 w-6 animate-spin" />
										</div>
									}
									className={'w-full flex justify-center'}
								/>
							) : null}
							<Page
								className={cn(isLoading ? 'hidden' : '')}
								width={width ? width : 1}
								pageNumber={currPage}
								scale={scale}
								rotate={rotate}
								key={'@' + scale}
								loading={
									<div className="flex justify-center">
										<Loader2 className="my-24 h-6 w-6 animate-spin" />
									</div>
								}
								onRenderSuccess={() => {
									setRenderedScale(scale);
								}}
							/>
						</Document>
					</div>
				</SimpleBar>
			</div>
		</div>
	);
};

export default PDFRenderer;
