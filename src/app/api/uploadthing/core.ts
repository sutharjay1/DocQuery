import { db } from '@/app/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { getPineconeClient } from '@/lib/picecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

const f = createUploadthing();

export const ourFileRouter = {
	pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
		.middleware(async ({ req }) => {
			const { getUser } = getKindeServerSession();
			const user = await getUser();

			if (!user || !user.id)
				throw new UploadThingError('unauthenticated');

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const createdFile = await db.file.create({
				data: {
					key: file.key,
					name: file.name,
					userId: metadata.userId,
					url: `https://utfs.io/f/${file.key}`,
					uploadStatus: 'PROCESSING',
				},
			});

			try {
				const response = await fetch(`https://utfs.io/f/${file.key}`);
				const blob = await response.blob();

				const loader = new PDFLoader(blob);

				const pageLevelDocs = await loader.load();

				const pageAmt = pageLevelDocs.length;

				//vectorize and index entire document

				const pinecone = await getPineconeClient();
				const pineconeIndex = pinecone.Index('docquery');

				const embeddings = new OpenAIEmbeddings({
					// openAIApiKey: process.env.OPENAI_API_KEY!,
					openAIApiKey: 'sk-proj-C8EW2Asz8J9uNOYxewyET3BlbkFJr0Gfv6swrbH52RadabfL',
				});

				await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
					pineconeIndex,
					namespace: createdFile.id,
				});

				await db.file.update({
					where: {
						id: createdFile.id,
					},
					data: {
						uploadStatus: 'SUCCESS',
					},
				});
			} catch (error) {
				await db.file.update({
					where: {
						id: createdFile.id,
					},
					data: {
						uploadStatus: 'FAILED',
					},
				});
				console.log(`Process FAILED`);
			}
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
