interface User {
	id: string;
	email: string;
	files: File[];
	razorPayCustomerId?: string;
	razorPaySubscriptionId?: string;
	razorPayPriceId?: string;
	razorPayCurrentPeriodEnd?: Date;
}

enum UploadStatus {
	PENDING = 'PENDING',
	UPLOADED = 'UPLOADED',
	FAILED = 'FAILED',
}

interface FileProps {
	id: string;
	name: string;
	uploadStatus: UploadStatus;
	url: string;
	key: string;
	createdAt: Date;
	updatedAt: Date;
	user?: User;
	userId?: string;
}

const PDFRenderer = ({ file }: FileProps) => {
	return (
		<div className="w-full bg-white rounded-md shadow flex flex-col items-center">
			{/* pdf feature tabs */}
			<div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-4">
				<div className="flex items-center gap-1.5">Top Bar</div>
			</div>
		</div>
	);
};

export default PDFRenderer;
