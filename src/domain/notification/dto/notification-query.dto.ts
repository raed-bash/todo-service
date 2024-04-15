import {
  IsOrderAttribute,
  OrderedPaginatedQueryDto,
  OrderedQueryDto,
} from 'src/common/dto/orderd-paginated-query.dto';

const orderAttributes = ['id'] as const;

type OrderAttributes = (typeof orderAttributes)[number];

export class NotificationQueryDto
  extends OrderedPaginatedQueryDto
  implements OrderedQueryDto
{
  @IsOrderAttribute(orderAttributes)
  orderBy: OrderAttributes = 'id';
}
