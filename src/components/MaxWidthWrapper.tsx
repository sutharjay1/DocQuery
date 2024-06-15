import { cn } from '@/lib/utils';

const MaxWidthWrapper = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				'w-full max-w-screen-xl h-full mx-auto px-2.5 md:px-20',
				className
			)}
		>
			{children}
		</div>
	);
};

export default MaxWidthWrapper;
