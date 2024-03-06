import { Switch, Route, useRouteMatch } from 'react-router-dom';
import {
  MaintenancePageLayout,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import { FormattedMessage } from 'react-intl';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import LockedDiamondSVG from '@commercetools-frontend/assets/images/locked-diamond.svg';
import React, { ReactNode } from 'react';
import { ContentNotification } from '@commercetools-uikit/notifications';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import Link from '@commercetools-uikit/link';
import Text from '@commercetools-uikit/text';
import ariesLabsLogo from './assets/aries-labs-logo.svg';
import ContainerList from './components/container-list';
import CustomObjectsList from './components/custom-objects-list';
import { messages } from './messages';
import { CONTAINER, PERMISSIONS } from './constants';
import { ContainerProvider } from './context/container-context';
import { useCustomObjectsFetcher } from './hooks/use-custom-object-connector/use-custom-object-connector';
import { getErrorMessage } from './helpers';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {

  const match = useRouteMatch();

  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/custom-applications/development/permissions
   *
   * NOTE that by default the Custom Application implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  const PageUnauthorized = () => (
    <MaintenancePageLayout
      imageSrc={LockedDiamondSVG}
      title={<FormattedMessage {...messages.accessDeniedTitle} />}
      paragraph1={<FormattedMessage {...messages.accessDeniedMessage} />}
    />
  );

  const canManageProducts = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageProducts],
  });
  const canManageOrders = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageOrders],
  });
  const canManageCustomers = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageCustomers],
  });

  const canManageCustomObjects = true;
  //canManageProducts && canManageOrders && canManageCustomers;

  const { customObjectsPaginatedResult, loading, error } =
    useCustomObjectsFetcher({
      limit: 500,
      offset: 0,
      container: CONTAINER,
    });

  if (!canManageCustomObjects) {
    return <PageUnauthorized />;
  }

  if (error) {
    return (
      <ContentNotification type="error" data-testid="loading-error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner />
      </Spacings.Stack>
    );
  }

  if (!customObjectsPaginatedResult) {
    return <PageNotFound />;
  }
  
  const { results } = customObjectsPaginatedResult || {};

  return (
    <ContainerProvider results={results}>
      <Switch>
        <Route path={`${match.path}/containers`} component={ContainerList} />
        <Route component={CustomObjectsList} />
      </Switch>
      <Spacings.Stack alignItems="center">
        <Link to='/'>
          <img src={ariesLabsLogo} alt="Aries Labs Logo" width="100"/>
        </Link>
      </Spacings.Stack>
    </ContainerProvider>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
