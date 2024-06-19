import { type ColumnDef } from '@tanstack/react-table';
import { Icons } from '~/components/icons/Icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/primitives/Avatar';
import { statuses } from '~/lib/constants';
import {
  type AdoptionApplicationDto,
  type AnimalDto,
  type JoinRequestDto,
  type UserDto,
} from '~/types';
import { DataTableColumnHeader } from './DataTableHeaders';
import { DataTableRowActions } from './DataTableRowActions';

export const animalsColumns: ColumnDef<AnimalDto>[] = [
  {
    accessorKey: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Image"
        className="ml-12"
      />
    ),
    cell: ({ row }) => (
      <Avatar className="ml-12 h-12 w-12">
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
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <span className="text-base font-medium">{row.getValue('name')}</span>
    ),
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
        title="Image"
        className="ml-12"
      />
    ),
    cell: ({ row }) => (
      <Avatar className="ml-12 h-12 w-12">
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
    enableHiding: false,
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

export const joinRequestColumns: ColumnDef<JoinRequestDto>[] = [
  {
    accessorKey: 'user.image',
    id: 'userAvatar',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="User avatar"
        className="ml-10"
      />
    ),
    cell: ({ row }) => (
      <Avatar className="ml-12 h-12 w-12">
        <AvatarImage
          src={row.getValue('userAvatar')}
          width={48}
          height={48}
          alt="user profile picture"
        />
        <AvatarFallback>
          <Icons.user className="h-6 w-6 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user.name',
    id: 'userName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      />
    ),
    cell: ({ row }) => (
      <span className="text-base font-medium">{row.getValue('userName')}</span>
    ),
  },
  {
    accessorKey: 'user.email',
    id: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
      />
    ),
    cell: ({ row }) => (
      <span className="text-base font-medium">{row.getValue('email')}</span>
    ),
  },
  {
    accessorKey: 'user.phoneNumber',
    id: 'phoneNumber',
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
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created at"
      />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt');
      if (createdAt instanceof Date) {
        return (
          <span className="text-foreground">{createdAt.toLocaleString()}</span>
        );
      } else {
        return <span className="text-foreground">Invalid Date</span>;
      }
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground">{row.getValue('status')}</span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        variant="adoptions"
        row={row}
      />
    ),
  },
];

export const adoptionApplicationColumns: ColumnDef<AdoptionApplicationDto>[] = [
  {
    accessorKey: 'pet.image',
    id: 'petAvatar',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Profile picture"
        className="ml-10"
      />
    ),
    cell: ({ row }) => (
      <Avatar className="ml-12 h-12 w-12">
        <AvatarImage
          src={row.getValue('petAvatar')}
          width={48}
          height={48}
          alt="Pet profile picture"
        />
        <AvatarFallback>
          <Icons.dog className="h-6 w-6 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'pet.name',
    id: 'name',
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
    accessorKey: 'email',
    id: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email address"
      />
    ),
    cell: ({ row }) => (
      <span className="text-base font-medium">{row.getValue('email')}</span>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    id: 'phoneNumber',
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
          <span className="text-muted-foreground">Brak danych</span>
        )}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created at"
      />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt');
      if (createdAt instanceof Date) {
        return (
          <span className="text-foreground">{createdAt.toLocaleString()}</span>
        );
      } else {
        return <span className="text-foreground">Niepoprawna data</span>;
      }
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground">{row.getValue('status')}</span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        variant="adoptions"
        row={row}
      />
    ),
  },
];
