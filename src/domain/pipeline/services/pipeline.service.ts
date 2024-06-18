import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePipelineDto, StepDto, StepResultDto } from '@application/pipeline/dto/pipeline.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { configService } from '@infra/config/config.service';

@Injectable()
export class PipelineService {
    private readonly logger = new Logger('PipelineService');
    private readonly domain = configService.getDomain();

    constructor(private readonly httpService: HttpService) { }

    async executePipeline(createPipelineDto: CreatePipelineDto, sendUpdate?: (update: StepResultDto) => void): Promise<string | null> {
        const { steps } = createPipelineDto;
        this.validateSteps(steps);

        let inputData: string | null = null;

        for (const [index, step] of steps.entries()) {
            const { service, endpoint, payload } = step;
            const formattedEndpoint = this.formatEndpoint(endpoint);
            const updatedPayload = this.updatePayloadWithInputData(payload, inputData);

            try {
                this.logger.log(`Calling http://${service}.${this.domain}/${formattedEndpoint} with payload: ${JSON.stringify(updatedPayload)} & inputData: ${JSON.stringify(inputData)}`);
                const response = await this.makeHttpPostRequest(service, formattedEndpoint, updatedPayload);

                inputData = this.extractOutputFromResponse(response, service, formattedEndpoint);
                this.logger.log(`inputData: ${JSON.stringify(inputData)}`);

                const stepResult: StepResultDto = {
                    output: inputData,
                    error: '',
                    stepNumber: index + 1,
                };

                if (sendUpdate) {
                    sendUpdate(stepResult);
                }
            } catch (error) {
                const stepResult: StepResultDto = {
                    output: '',
                    error: error.message || 'An unexpected error occurred',
                    stepNumber: index + 1,
                };

                if (sendUpdate) {
                    sendUpdate(stepResult);
                }

                this.handleHttpError(error, service, formattedEndpoint);
            }
        }

        return inputData;
    }

    private validateSteps(steps: StepDto[]): void {
        if (!Array.isArray(steps)) {
            throw new TypeError('steps is not an array');
        }
    }

    private formatEndpoint(endpoint: string): string {
        return endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    }

    private updatePayloadWithInputData(payload: any, inputData: string | null): any {
        if (payload.code && inputData !== null) {
            payload.code = payload.code.replace(/inputData/g, inputData);
        }
        return payload;
    }

    private async makeHttpPostRequest(service: string, endpoint: string, payload: any): Promise<any> {
        const url = `http://${service}.${this.domain}/${endpoint}`;
        const response = await lastValueFrom(this.httpService.post(url, payload));
        this.logger.log(`response: ${JSON.stringify(response.data)}`);
        return response.data;
    }

    private extractOutputFromResponse(response: any, service: string, endpoint: string): string {
        if (response?.output) {
            return response.output.trim();
        } else {
            this.logger.error(`Invalid response structure from ${service}.${this.domain}/${endpoint}:`, response);
            throw new HttpException('Invalid response structure', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private handleHttpError(error: any, service: string, endpoint: string): void {
        if (error.response) {
            this.logger.error(`Error calling ${service}.${this.domain}/${endpoint}:`, error.response.data);
            throw new HttpException(error.response.data, error.response.status);
        } else {
            this.logger.error(`Unexpected error calling ${service}.${this.domain}/${endpoint}:`, error.message);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
