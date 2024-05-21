import { Upload } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { links } from '~/config/siteConfig';
import { type ShelterDetails } from '~/types';
import { Icons } from '../icons/Icons';
import { Badge } from '../primitives/Badge';
import { Button, buttonVariants } from '../primitives/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../primitives/Card';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import { Textarea } from '../primitives/Textarea';

type Props = {
  shelterDetails: ShelterDetails;
};

const ShelterSettings = ({ shelterDetails }: Props) => {
  const { t } = useTranslation('common');

  return (
    <main className="my-6 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4 sm:max-w-7xl">
        <div className="flex items-center gap-4">
          <Link
            href={links.dashboard}
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            <Icons.chevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {shelterDetails?.name}
          </h1>
          <Badge
            variant="success"
            className="ml-auto sm:ml-0"
          >
            Verified
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button size="sm">Save changes</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_350px] lg:grid-cols-7 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-5 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Adjust your organization details and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full"
                      defaultValue={shelterDetails?.name}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="text"
                      className="w-full"
                      defaultValue={
                        shelterDetails?.website ?? 'No website provided'
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      defaultValue={shelterDetails?.description ?? ''}
                      className="min-h-32"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      type="text"
                      className="w-full"
                      defaultValue={
                        shelterDetails?.phoneNumber ??
                        'No phone number provided'
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="text"
                      className="w-full"
                      defaultValue={
                        shelterDetails?.email ?? 'No email provided'
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Address details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      className="w-full"
                      defaultValue={
                        shelterDetails?.address?.address ??
                        'No address provided'
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      className="w-full"
                      defaultValue={
                        shelterDetails?.address?.city ?? 'No city provided'
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      className="w-full"
                      defaultValue={
                        shelterDetails?.address?.state ?? 'No state provided'
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      type="text"
                      className="w-full"
                      defaultValue={
                        shelterDetails?.address?.country ??
                        'No country provided'
                      }
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="postcode">Post code</Label>
                    <Input
                      id="postcode"
                      type="text"
                      className="w-full"
                      defaultValue={
                        shelterDetails?.address?.postCode ??
                        'No post code provided'
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Logo</CardTitle>
                <CardDescription>Upload your organization logo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Image
                    alt="Organization logo"
                    className="aspect-square w-full rounded-md object-cover"
                    height="300"
                    width="300"
                    src={
                      shelterDetails?.logo ?? '/images/no-profile-picture.svg'
                    }
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Upload</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Legal details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Tax ID</Label>
                    <Input
                      id="status"
                      type="text"
                      className="w-full"
                      defaultValue={shelterDetails?.taxId}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* <pre>{JSON.stringify(shelterDetails, null, 2)}</pre> */}
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button size="sm">Save changes</Button>
        </div>
      </div>
    </main>
  );
};

export default ShelterSettings;
