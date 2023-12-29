import { type Table } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../primitives/DropdownMenu';

interface DataTableVisibilityOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableVisibilityOptions<TData>({
  table,
}: DataTableVisibilityOptionsProps<TData>) {
  const { t } = useTranslation('common');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 sm:flex"
        >
          <Icons.mixer className="mr-2 h-4 w-4" />
          {t('animals_table_visibility_options')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[150px]"
      >
        <DropdownMenuLabel>
          {t('animals_table_toggle_columns')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            const translationKey = `column_${column.id}`;
            const translatedColumnName = t(translationKey);

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {translatedColumnName || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
