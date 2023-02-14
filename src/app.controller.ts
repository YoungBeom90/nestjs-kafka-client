import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('first-kafka') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('send.topic');
    await this.client.connect();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kafka-emit-test')
  emitTest() {
    return this.client.emit('emit.topic', { foo: 'bar' });
  }

  @Post('kafka-send-test')
  sendTest(@Body() data: any) {
    return this.client.send('send.topic', { data });
  }
}
