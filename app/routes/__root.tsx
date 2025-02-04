import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import { ClerkProvider } from '@clerk/tanstack-start';

import type { ReactNode } from 'react';

import appCss from '../app.css?url';

import poppins100 from '@fontsource/poppins/100.css?url';
import poppins200 from '@fontsource/poppins/200.css?url';
import poppins300 from '@fontsource/poppins/300.css?url';
import poppins400 from '@fontsource/poppins/400.css?url';
import poppins500 from '@fontsource/poppins/500.css?url';
import poppins600 from '@fontsource/poppins/600.css?url';
import poppins700 from '@fontsource/poppins/700.css?url';
import poppins800 from '@fontsource/poppins/800.css?url';
import poppins900 from '@fontsource/poppins/900.css?url';

import NavBar from '@/containers/NavBar/NavBar';

import { getSignedInUserId } from '@/data/getSignedInUserId';
import { Toaster } from '@/components/ui/toaster';
import LoadingSkeleton from '@/components/loading-skeleton';

export const Route = createRootRoute({
  wrapInSuspense: true,
  pendingComponent: () => {
    return (
      <div className="max-w-screen-xl mx-auto py-5">
        <LoadingSkeleton />
      </div>
    );
  },
  pendingMs: 0,
  notFoundComponent() {
    return (
      <div className="text-3xl text-center py-10 text-muted-foreground">
        Oops! Page not found!
      </div>
    );
  },
  beforeLoad: async () => {
    const userId = await getSignedInUserId();
    return {
      userId,
    };
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanTracker',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'stylesheet',
        href: poppins100,
      },
      {
        rel: 'stylesheet',
        href: poppins200,
      },
      {
        rel: 'stylesheet',
        href: poppins300,
      },
      {
        rel: 'stylesheet',
        href: poppins400,
      },
      {
        rel: 'stylesheet',
        href: poppins500,
      },
      {
        rel: 'stylesheet',
        href: poppins600,
      },
      {
        rel: 'stylesheet',
        href: poppins700,
      },
      {
        rel: 'stylesheet',
        href: poppins800,
      },
      {
        rel: 'stylesheet',
        href: poppins900,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ClerkProvider>
      <html>
        <head>
          <Meta />
        </head>
        <body>
          <NavBar />
          {children}
          <Toaster />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  );
}
