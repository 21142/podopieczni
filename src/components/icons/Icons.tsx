import {
  ArrowUpDown,
  Calendar,
  Cat,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Circle,
  CircleSlashed,
  CrossIcon,
  Dog,
  DollarSign,
  Download,
  EyeOff,
  Globe,
  Heart,
  HeartHandshake,
  HelpCircle,
  Home,
  Laptop,
  Loader2,
  LogIn,
  Mail,
  Moon,
  MoreHorizontal,
  Plus,
  PlusCircle,
  Search,
  Settings,
  SlidersHorizontalIcon,
  SunMedium,
  Trash,
  User,
  X,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  doubleChevronLeft: ChevronsLeft,
  doubleChevronRight: ChevronsRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  arrowUpDown: ArrowUpDown,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  user: User,
  dollarSign: DollarSign,
  dog: Dog,
  cat: Cat,
  home: Home,
  download: Download,
  settings: Settings,
  logIn: LogIn,
  spinner: Loader2,
  trash: Trash,
  check: Check,
  circle: Circle,
  add: Plus,
  plus: PlusCircle,
  close: X,
  calendar: Calendar,
  heart: Heart,
  heartDonate: HeartHandshake,
  helpQustionMark: HelpCircle,
  more: MoreHorizontal,
  hide: EyeOff,
  mail: Mail,
  cross: CrossIcon,
  mixer: SlidersHorizontalIcon,
  search: Search,
  crossedCircle: CircleSlashed,
  globe: Globe,
  google: (props: LucideProps) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path
        d="M1 1h22v22H1z"
        fill="none"
      />
    </svg>
  ),
  logo: (props: LucideProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
      ></circle>
    </svg>
  ),
  polish: (props: LucideProps) => (
    <svg
      viewBox="0 0 512 512"
      {...props}
    >
      <g fillRule="evenodd">
        <path
          fill="#fff"
          d="M512 512H0V0h512z"
        />
        <path
          fill="#dc143c"
          d="M512 512H0V256h512z"
        />
      </g>
    </svg>
  ),
  english: (props: LucideProps) => (
    <svg
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="#012169"
        d="M0 0h512v512H0z"
      />
      <path
        fill="#FFF"
        d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"
      />
      <path
        fill="#C8102E"
        d="m184 324 11 34L42 512H0v-3l184-185zm124-12 54 8 150 147v45L308 312zM512 0 320 196l-4-44L466 0h46zM0 1l193 189-59-8L0 49V1z"
      />
      <path
        fill="#FFF"
        d="M176 0v512h160V0H176zM0 176v160h512V176H0z"
      />
      <path
        fill="#C8102E"
        d="M0 208v96h512v-96H0zM208 0v512h96V0h-96z"
      />
    </svg>
  ),
};
