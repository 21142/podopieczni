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
      className="transition-colors hover:cursor-pointer hover:border-border/60 hover:bg-transparent"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {currency ?? ''}
        </div>
        <p className="text-xs text-muted-foreground">
          {difference && (difference > 0 ? '+' : '')}
          {!!difference && difference}
          {t('dashboard_statistics_card_change_from_last_month')}
        </p>
      </CardContent>
    </Card>
  );
};

export default ShelterStatisticsCard;
