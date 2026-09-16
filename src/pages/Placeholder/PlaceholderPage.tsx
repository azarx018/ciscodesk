import { PageHeader } from "../../components/layout";
import { EmptyState } from "../../components/ui";
import { Icon } from "../../components/icons/Icon";

export interface PlaceholderPageProps {
  title: string;
}

/**
 * Stand-in for pages not yet built (Phase 4). Kept distinct from a
 * data EmptyState so it's obviously "not implemented yet" rather than
 * "implemented, but this device has no data".
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} subtitle="Not built yet" />
      <EmptyState
        icon={<Icon.cog size={22} />}
        title={`${title} is scheduled for Phase 4`}
        body="Navigation, the device shell and command palette (Phase 2) are in place. This page's table/detail UI and mock data land in later phases."
      />
    </>
  );
}
