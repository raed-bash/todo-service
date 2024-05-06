import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './service/task.service';
import { QueryTaskDto } from './dto/query-task.dto';
import { PaginatedResultsDto } from 'src/common/dto/paginated-result.dto';
import { TaskDto } from './dto/task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ReqUser } from 'src/common/guards/user-auth.decorator';
import { UserDto } from '../user/dto/user.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { ChangeCompletedStatusTaskDto } from './dto/change-completed-status-task.dto';
import { AllowRoles } from 'src/common/guards/user-auth.guard';
import { AllQueryTaskDto } from './dto/all-query-task.dto';
import { AllCreateTaskDto } from './dto/all-create-task.dto';
import { AllTaskService } from './service/all-task.service';
import { NotificationService } from '../notification/service/notification.service';
import { AuthRequired } from 'src/common/guards/auth-required.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventDispatcherService } from 'src/events/event-dispatcher.service';

@Controller('task')
@ApiTags('Task')
@AuthRequired()
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly allTaskService: AllTaskService,
    private readonly notificationService: NotificationService,
    private readonly emit: EventDispatcherService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get Tasks, with optional filters and pagination' })
  @ApiOkResponse({ type: TaskDto, isArray: true })
  @ApiExtraModels(QueryTaskDto)
  async queryTasks(@Query() query: QueryTaskDto, @ReqUser() user: UserDto) {
    const [count, tasks] = await this.taskService.findByQuery({
      ...query,
      userId: user.id,
    });

    return new PaginatedResultsDto(
      tasks.map((task) => new TaskDto(task)),
      count,
      query,
    );
  }

  @Get('all')
  @ApiOperation({
    summary:
      'Get All Tasks for Admin Role, with optional filters and pagination',
  })
  @ApiOkResponse({ type: TaskDto, isArray: true })
  @ApiExtraModels(AllQueryTaskDto)
  @AllowRoles(['ADMIN'])
  async queryTasksAdmin(@Query() query: AllQueryTaskDto) {
    const [count, tasks] = await this.taskService.findByQuery({
      ...query,
      role: 'EMPLOYEE',
    });

    return new PaginatedResultsDto(
      tasks.map((task) => new TaskDto(task)),
      count,
      query,
    );
  }

  @Get('deleted')
  @ApiOperation({
    summary: 'Get Deleted Tasks, with optional filters and pagination',
  })
  @ApiOkResponse({ type: TaskDto, isArray: true })
  @ApiExtraModels(QueryTaskDto)
  async queryDeletedTasks(
    @Query() query: QueryTaskDto,
    @ReqUser() user: UserDto,
  ) {
    const [count, tasks] = await this.taskService.findByQueryDeleted({
      ...query,
      userId: user.id,
    });

    return new PaginatedResultsDto(
      tasks.map((task) => new TaskDto(task)),
      count,
      query,
    );
  }

  @Post()
  @ApiBody({ type: CreateTaskDto })
  @ApiOperation({ summary: 'Create New Task' })
  @ApiOkResponse({ type: TaskDto })
  async createTask(@Body() body: CreateTaskDto, @ReqUser() user: UserDto) {
    const task = await this.taskService.create({ ...body, userId: user.id });

    return new TaskDto(task);
  }

  @Patch()
  @ApiBody({ type: EditTaskDto })
  @ApiOperation({ summary: 'Edit task' })
  @ApiOkResponse({ type: TaskDto })
  async editTask(@Body() body: EditTaskDto, @ReqUser() user: UserDto) {
    const task = await this.taskService.edit({ ...body, userId: user.id });
    return new TaskDto(task);
  }

  @Post('completed')
  @ApiBody({ type: ChangeCompletedStatusTaskDto })
  @ApiOperation({ summary: 'Change Completed Status' })
  @ApiOkResponse({ type: TaskDto })
  async changeCompletedStatus(
    @Body() body: ChangeCompletedStatusTaskDto,
    @ReqUser() user: UserDto,
  ) {
    const task = await this.taskService.changeCompletedStatus(body, user.id);

    return new TaskDto(task);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft Delete Task' })
  @ApiOkResponse({ type: TaskDto })
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user: UserDto,
  ) {
    const task = await this.taskService.delete(id, user.id);

    return new TaskDto(task);
  }

  @Get('all/deleted')
  @ApiOperation({
    summary:
      'Get All Deleted Tasks for Admin Role, with optional filters and pagination',
  })
  @ApiOkResponse({ type: TaskDto, isArray: true })
  @ApiExtraModels(AllQueryTaskDto)
  @AllowRoles(['ADMIN'])
  async queryDeletedTasksAdmin(@Query() query: AllQueryTaskDto) {
    const [count, tasks] = await this.taskService.findByQueryDeleted({
      ...query,
      role: 'EMPLOYEE',
    });

    return new PaginatedResultsDto(
      tasks.map((task) => new TaskDto(task)),
      count,
      query,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: "Get Task By it's id" })
  @ApiOkResponse({ type: TaskDto })
  async getTasksUserById(
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user: UserDto,
  ) {
    const task = await this.taskService.findById(id, user.id);
    return new TaskDto(task);
  }

  @Get('all/:id')
  @ApiOperation({ summary: "Get any Task By it's id" })
  @ApiOkResponse({ type: TaskDto })
  async getAllTasksUserById(@Param('id', ParseIntPipe) id: number) {
    const task = await this.allTaskService.findById(id);
    return new TaskDto(task);
  }

  @Post('all')
  @ApiBody({ type: AllCreateTaskDto })
  @ApiOperation({ summary: 'Create New Task for User' })
  @ApiOkResponse({ type: TaskDto })
  @AllowRoles(['ADMIN'])
  async createTaskToUser(
    @Body() body: AllCreateTaskDto,
    @ReqUser() adminUser: UserDto,
  ) {
    const [task, firebaseToken] = await this.allTaskService.createToUser(body);

    const notification = {
      title: 'Created New Task',
      body: `${adminUser.username} Created Task for You`,
    };

    this.notificationService.storeNotification([body.userId], notification);

    if (firebaseToken) {
      this.emit.sendFCM({
        registration_ids: [firebaseToken],
        notification,
      });
    }

    return task;
  }

  @Patch('all')
  @ApiBody({ type: EditTaskDto })
  @ApiOperation({ summary: 'Edit Task for User' })
  @ApiOkResponse({ type: TaskDto })
  @AllowRoles(['ADMIN'])
  async editToUserTask(@Body() body: EditTaskDto) {
    const task = await this.allTaskService.editToUser({ ...body });

    return new TaskDto(task);
  }

  @Post('all/completed')
  @ApiOperation({ summary: 'Change Completed Status for User' })
  @ApiOkResponse({ type: TaskDto })
  @AllowRoles(['ADMIN'])
  async AllChangeCompletedStatus(@Body() body: ChangeCompletedStatusTaskDto) {
    const task = await this.allTaskService.changeCompletedStatusToUser(body);

    return new TaskDto(task);
  }

  @Delete('all/:id')
  @ApiOperation({ summary: 'Soft Delete Task for User' })
  @ApiOkResponse({ type: TaskDto })
  @AllowRoles(['ADMIN'])
  async deleteToUserTask(@Param('id', ParseIntPipe) id: number) {
    const task = await this.allTaskService.deleteToUser(id);

    return new TaskDto(task);
  }
}
