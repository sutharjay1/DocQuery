import { db } from '@/app/db';
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
	// endpoint for asking to send message

	const body = await req.json();

	const { getUser } = getKindeServerSession();
	const user = await getUser();

	const { id: userId } = user;

	if (!userId) return new Response('Unauthorized', { status: 401 });

	const { fileId, message } = SendMessageValidator.parse(body);

	const file = await db.file.findFirst({
		where: {
			id: fileId,
			userId,
		},
	});

	if (!file) return new Response('Not found', { status: 404 });

	await db.message.create({
		data: {
			text: message,
			isUserMessage: true,
			fileId: file.id,
			userId: userId,
		},
	});

    

	return new Response('OK', { status: 200 });
};
