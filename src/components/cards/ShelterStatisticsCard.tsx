import { useTranslation } from 'next-i18next';
import { type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/Card';

type ShelterStatisticsCardProps = {
  title: string;
  value: number | undefined;
  difference: number | undefined;
  currency?: string;
  children?: React.ReactElement;
  onClick?: () => void;
};

const ShelterStatisticsCard: FC<ShelterStatisticsCardProps> = ({
  title,
  value,
  children,
  difference,
  currency,
  onClick,
}) => {
  const { t } = useTranslation('common');
  return (
    <Card
      className="min-h-34 transition-colors hover:cursor-pointer hover:border-border/60 hover:bg-transparent"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent className="flex flex-col justify-between">
        <div className="text-3xl font-bold">
          {value} {currency ?? ''}
        </div>
        {difference !== undefined && difference > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {`+${difference}`}
            {t('dashboard_statistics_card_change_from_last_month')}
          </p>
        )}
        {difference === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t('dashboard_statistics_card_no_change_from_last_month')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ShelterStatisticsCard;
