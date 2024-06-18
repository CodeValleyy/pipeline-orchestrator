import packageJson from '@/package.json';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { INestApplication } from '@nestjs/common';

export async function setupAsyncApi(app: INestApplication) {
    const asyncApiOptions = new AsyncApiDocumentBuilder()
        .setTitle(packageJson.name)
        .setDescription(packageJson.description)
        .setVersion(packageJson.version)
        .setDefaultContentType('application/json')
        .addSecurity('user-password', { type: 'userPassword' })
        .setContact(
            packageJson.author.name,
            packageJson.author.url,
            packageJson.author.email,
        )
        .addServer('pipeline-orchestrator-ws', {
            url: 'ws://localhost:3000',
            protocol: 'socket.io',
        })
        .build();

    const document = AsyncApiModule.createDocument(app, asyncApiOptions);
    await AsyncApiModule.setup('asyncapi', app, document);
}
