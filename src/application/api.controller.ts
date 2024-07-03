import packageJson from '@/package.json';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Get, Controller } from '@nestjs/common';

@Controller('api')
@ApiTags('api')
export class ApiController {
  constructor() {}

  @Get('health')
  @ApiResponse({ status: 200, type: String })
  async health(): Promise<string> {
    return 'OK';
  }

  @Get('version')
  @ApiResponse({ status: 200, type: String })
  async version(): Promise<string> {
    return packageJson.version;
  }
}
