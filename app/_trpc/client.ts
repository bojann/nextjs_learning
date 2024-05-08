import { createTRPCNext } from '@trpc/next';
import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '@/app/server';

// export const trpc = createTRPCNext<AppRouter>({});
export const trpc = createTRPCReact<AppRouter>({});
