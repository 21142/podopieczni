import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/primitives/Avatar';

export function RecentAdoptions() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="/avatars/01.png"
            alt="Avatar"
          />
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Bruno</p>
          <p className="text-sm text-muted-foreground">Poodle</p>
        </div>
        <div className="ml-auto font-medium">czeka na nowy dom</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage
            src="/avatars/02.png"
            alt="Avatar"
          />
          <AvatarFallback>J</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jackson</p>
          <p className="text-sm text-muted-foreground">Australian Shepard</p>
        </div>
        <div className="ml-auto font-medium">czeka na nowy dom</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="/avatars/03.png"
            alt="Avatar"
          />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Astor</p>
          <p className="text-sm text-muted-foreground">Golden Retriever</p>
        </div>
        <div className="ml-auto font-medium">czeka na nowy dom</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="/avatars/04.png"
            alt="Avatar"
          />
          <AvatarFallback>W</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Willy</p>
          <p className="text-sm text-muted-foreground">German Shepard</p>
        </div>
        <div className="ml-auto font-medium">czeka na nowy dom</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src="/avatars/05.png"
            alt="Avatar"
          />
          <AvatarFallback>K</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Kim</p>
          <p className="text-sm text-muted-foreground">Kitten</p>
        </div>
        <div className="ml-auto font-medium">czeka na nowy dom</div>
      </div>
    </div>
  );
}
