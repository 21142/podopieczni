import { Separator } from '@radix-ui/react-dropdown-menu';
import { Icons } from '../icons/Icons';
import { Button } from '../primitives/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../primitives/Card';

const AdoptionFormCard = () => {
  return (
    <Card className="lg: hidden lg:block">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg leading-6 text-primary-300 md:text-xl">
          Znajdź pasującego podopiecznego
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Wypełnij interaktywną ankietę przedadopcyjną!
        </CardDescription>
        <Separator className="my-3" />
        <Button
          variant="link"
          className="pl-0"
        >
          Przejdź do ankiety
          <Icons.doubleChevronRight className="ml-1 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdoptionFormCard;
