import { db } from '@/app/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { getPineconeClient } from '@/lib/picecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

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
				console.log(`before blob`);
				const blob = await response.blob();

				console.log(`after blob`);

				const loader = new PDFLoader(blob);

				console.log(`after loader`);

				const pageLevelDocs = await loader.load();
				console.log('after pagelevel');

				const pageAmt = pageLevelDocs.length;

				console.log(`before pinecone index`);

				const pinecone = await getPineconeClient()
				const pineconeIndex = pinecone.Index('docquery')

				// const namespace = pineconeIndex.console.log(
				// 	'inserting vectors into pinecone'
				// );

				console.log(`after pinecone index`);

				console.log(`before embeddings`);

				const embeddings = new OpenAIEmbeddings({
					openAIApiKey: process.env.OPENAI_API_KEY,
				});

				console.log(`after embeddings`);

				// await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
				// 	pineconeIndex,
				// 	namespace: createdFile.id,
				// 	textKey: 'text',
				// });

				console.log(`beofre pinecone store`);

				await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
					pineconeIndex,
					namespace: createdFile.id,
				});

				console.log(`after pinecone store`);

				await db.file.update({
					where: {
						id: createdFile.id,
					},
					data: {
						uploadStatus: 'SUCCESS',
					},
				});
			} catch (error) {
				console.error(`Process FAILED: ${error}`);
				await db.file.update({
					where: {
						id: createdFile.id,
					},
					data: {
						uploadStatus: 'FAILED',
					},
				});
			}
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
