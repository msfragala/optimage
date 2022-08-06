import { useStore } from '@/lib/use-store';
import { $artifacts } from '@/stores/$artifacts';
import { Form } from './Form';
import { version } from '../../package.json';
import Router, { Link } from 'preact-router';
import { DOWNLOADS_ROUTE, HOME_ROUTE } from '@/constants/routes';
import { Suspense, lazy } from 'preact/compat';
import { ComponentChild } from 'preact';

const Results = lazy(() => import('./Results').then(m => m.Results));
const NotFound = lazy(() => import('./NotFound').then(m => m.NotFound));

export function App() {
  const hasArtifacts = useStore($artifacts, s => Object.keys(s).length > 0);

  return (
    <div class="flex flex-col w-full min-h-full max-w-screen-sm mx-auto px-24 md:px-32 py-24">
      <h1 class="text-heading-xl font-semibold w-fit mx-auto mt-lg mb-xl">
        <Link href={HOME_ROUTE}>Optimage</Link>
      </h1>
      <Router>
        <Route path={HOME_ROUTE}>
          <Form />
          <p />
        </Route>
        <Route path={DOWNLOADS_ROUTE}>
          <Results />
        </Route>
        <Route default>
          <NotFound />
        </Route>
      </Router>
      <footer class="mt-auto pt-64 text-sm flex justify-between">
        <p class="ms-footer-text">&copy; Mitchell Fragala</p>
        <p class="ms-footer-text">
          <a href="https://github.com/msfragala/optimage">v{version}</a>
        </p>
      </footer>
    </div>
  );
}

interface RouteProps {
  children: ComponentChild;
  path?: string;
  default?: boolean;
}

function Route({ children }: RouteProps) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
