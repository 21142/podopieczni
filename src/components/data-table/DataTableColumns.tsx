import { type ColumnDef } from '@tanstack/react-table';
import { Icons } from '~/components/icons/Icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/primitives/Avatar';
import { statuses } from '~/lib/constants';
import { type AnimalDto, type UserDto } from '~/types';
import { Checkbox } from '../primitives/Checkbox';
import { DataTableColumnHeader } from './DataTableHeaders';
import { DataTableRowActions } from './DataTableRowActions';

export const animalsColumns: ColumnDef<AnimalDto>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Image"
      />
    ),
    cell: ({ row }) => (
      <Avatar className="h-12 w-12">
        <AvatarImage
          src={row.getValue('image')}
          width={48}
          height={48}
          alt="animal profile picture"
        />
        <AvatarFallback>
          {row.getValue('species') === 'dog' ? (
            <Icons.dog className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Icons.cat className="h-6 w-6 text-muted-foreground" />
          )}
        </AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
      />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      );

      if (!status) {
        return <span className="text-muted-foreground">N/A</span>;
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'species',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Species"
      />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue('species') !== '' &&
        row.getValue('species') != undefined ? (
          row.getValue('species')
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'breed',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Breed"
      />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue('breed') !== '' &&
        row.getValue('species') != undefined ? (
          row.getValue('breed')
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        variant="animals"
        row={row}
      />
    ),
  },
];

export const usersColumns: ColumnDef<UserDto>[] = [
  {
    accessorKey: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title=""
      />
    ),
    cell: ({ row }) => (
      <Avatar className="ml-4 h-12 w-12">
        <AvatarImage
          src={row.getValue('image')}
          width={48}
          height={48}
          alt="animal profile picture"
        />
        <AvatarFallback>
          <Icons.user className="h-6 w-6 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      />
    ),
    cell: ({ row }) => (
      <span className="text-base font-medium">{row.getValue('name')}</span>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Role"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'address',
    accessorKey: 'address.city',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Location"
      />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue('address') !== undefined ? (
          row.getValue('address')
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email address"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Phone number"
      />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue('phoneNumber') != undefined ? (
          row.getValue('phoneNumber')
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </span>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        variant="users"
        row={row}
      />
    ),
  },
];
