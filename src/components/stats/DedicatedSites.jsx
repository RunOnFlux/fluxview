import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { layout } from "../../style";
import { globalApps } from "../../api/query/apps";
import { dedicatedSites, countAppsPerSite } from "../../constants/dedicatedSites";

const SiteCard = ({ site, appCount, loading }) => (
  <a
    href={site.url}
    target="_blank"
    rel="noopener noreferrer"
    title={`${site.name} hosting on Flux`}
    className="m-2 md:w-[280px] w-[300px] stat-box overflow-hidden hover:opacity-80 transition-opacity"
  >
    {/* every banner is pre-normalised to 480x252, so no cropping is needed */}
    <img src={site.banner} alt={`${site.name} banner`} loading="lazy" width="480" height="252" className="w-full h-auto" />
    <div className={`${layout.statBox} text-core text-[22px] mt-2`}>{site.name}</div>
    <div className={`${layout.statBox} text-white text-[36px]`}>{loading ? <Skeleton /> : appCount}</div>
    <div className={`${layout.statBox} text-dimWhite text-[14px] mb-2`}>{appCount === 1 ? "app on Flux" : "apps on Flux"}</div>
  </a>
);

const DedicatedSites = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["globalApps"],
    queryFn: async () => {
      const apps = await globalApps();
      return apps.data;
    },
  });

  // busiest site first, then alphabetically so the order is stable while loading
  const sites = useMemo(() => {
    const counts = countAppsPerSite(data);
    return dedicatedSites.map((site) => ({ ...site, appCount: counts[site.id] })).sort((a, b) => b.appCount - a.appCount || a.name.localeCompare(b.name));
  }, [data]);

  const total = sites.reduce((sum, site) => sum + site.appCount, 0);

  return (
    <div className="ml-5 mr-5 mb-16">
      <h1 className={`${layout.statBox} nav-bar text-headers mm:text-[30px] xs:text-[40px] ss:text-[44px] sm:text-[48px] leading-[60px] mt-2 mb-2`}>DEDICATED WEBSITES</h1>

      <div className={`${layout.statBox} text-dimWhite text-[18px] mb-4`}>
        {error ? (
          "App list unavailable"
        ) : isPending ? (
          "Counting apps on the Flux network ..."
        ) : (
          <span>
            {total} apps deployed from {dedicatedSites.length} one-click hosting sites
          </span>
        )}
      </div>

      <SkeletonTheme baseColor="#14101d" highlightColor="#444" width={120} height={36} count={1} duration={2}>
        <div className="flex flex-row flex-wrap justify-center">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} appCount={site.appCount} loading={isPending && !error} />
          ))}
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default DedicatedSites;
