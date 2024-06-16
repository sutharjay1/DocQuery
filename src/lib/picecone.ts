// import { Pinecone } from '@pinecone-database/pinecone';

// export const pinecone = new Pinecone({
// 	apiKey: process.env.PINECONE_API_KEY!,
// });

import { PineconeClient } from '@pinecone-database/pinecone';

export const getPineconeClient = async () => {
	const client = new PineconeClient();

	await client.init({
		// apiKey: process.env.PINECONE_API_KEY!,
		apiKey: 'e8756b3b-d8de-4f35-be38-b1588eec9705',
		environment: 'us-east-1-aws',
	});

	return client;
};
