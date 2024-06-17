import { trpc } from '@/app/_trpc/client';
import { db } from '@/app/db';
import ChatWrapper from '@/components/chat/ChatWrapper';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import PDFRenderer from '@/components/PDFRenderer';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
	params: {
		filedid: string;
	};
}

const page = async ({ params }: PageProps) => {
	const { filedid } = params;

	const { getUser } = getKindeServerSession();

	const user = await getUser();

	if (!user || !user?.id)
		redirect(`/auth-callback?origin=dashboard/${filedid}`);

	const file = await db.file.findFirst({
		where: {
			id: filedid,
			userId: user.id,
		},
	});

	console.log(`file`, JSON.stringify(file, null, 2));

	if (!file) notFound();

	return (
		<>
			<div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)] ">
				<div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
					{/* left */}
					<div className=" flex-1 flex ">
						<div className="flex flex-1 mx-auto px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
							<PDFRenderer url={file.url} />
						</div>
					</div>
					{/* right */}
					<div className="shrink-0 flex-[0.75] border-t border-zinc-200 lg:w-96 lg:border-l lg:border-t-0">
						{/* <div className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6"> */}
						{/* <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0"> */}
						<ChatWrapper fileId={file.id} />
						{/* </div> */}
					</div>
				</div>
			</div>
		</>
	);
};

export default page;
