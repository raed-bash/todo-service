import { ExecutionContext, SetMetadata, applyDecorators } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth } from '@nestjs/swagger';
import { isBoolean } from 'lodash';

const METADATA_AUTH_REQUIRED = 'METADATA_AUTH_REQUIRED';

export const isAuthRequired = (
  reflector: Reflector,
  context: ExecutionContext,
) => {
  const authMethod = reflector.get<boolean>(
    METADATA_AUTH_REQUIRED,
    context.getHandler(),
  );
  const authClass = reflector.get<boolean>(
    METADATA_AUTH_REQUIRED,
    context.getClass(),
  );

  if (isBoolean(authMethod)) return !!authMethod;
  if (isBoolean(authClass)) return !!authClass;
  return true;
};

export const AuthRequired = () =>
  applyDecorators(SetMetadata(METADATA_AUTH_REQUIRED, true), ApiBearerAuth());

export const NoAuthRequired = () =>
  applyDecorators(SetMetadata(METADATA_AUTH_REQUIRED, false));
