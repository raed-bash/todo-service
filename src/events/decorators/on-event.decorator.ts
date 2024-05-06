import { applyDecorators } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '../events';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';

export const OnEventTypes = (event: Events, options?: OnEventOptions) =>
  applyDecorators(OnEvent(event, options));
