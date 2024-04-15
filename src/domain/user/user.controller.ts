import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { QueryUserDto } from './dto/query-user.dto';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { PaginatedResultsDto } from 'src/common/dto/paginated-result.dto';
import { AllowRoles } from 'src/common/guards/user-auth.guard';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { AuthRequired } from 'src/common/guards/auth-required.decorator';

@Controller('user')
@ApiTags('Users')
@AuthRequired()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get users, with optional filters and pagination',
  })
  @ApiOkResponse({ type: UserDto, isArray: true })
  @ApiExtraModels(QueryUserDto)
  @AllowRoles(['ADMIN'])
  async queryUsers(@Query() query: QueryUserDto) {
    const [count, users] = await this.userService.findByQuery(query);

    return new PaginatedResultsDto<UserDto>(
      users.map((user) => new UserDto(user)),
      count,
      query,
    );
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiOkResponse({ type: UserDto })
  @AllowRoles(['ADMIN'])
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);

    return new UserDto(user);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get User By it's id" })
  @ApiOkResponse({ type: UserDto })
  @AllowRoles(['ADMIN'])
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    return new UserDto(user);
  }

  @Patch()
  @ApiOperation({ summary: 'Edit User Info' })
  @ApiBody({ type: EditUserDto })
  @ApiOkResponse({ type: UserDto })
  @AllowRoles(['ADMIN'])
  async editUser(@Body() body: EditUserDto) {
    const user = await this.userService.edit(body);

    return new UserDto(user);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change Password User' })
  @ApiBody({ type: ChangePasswordUserDto })
  @ApiOkResponse({ type: UserDto })
  @AllowRoles(['ADMIN'])
  async changePasswordUser(@Body() body: ChangePasswordUserDto) {
    const user = await this.userService.changePassword(body);

    return new UserDto(user);
  }
}
