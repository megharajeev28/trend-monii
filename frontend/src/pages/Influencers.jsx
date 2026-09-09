import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import FilterBar from "../components/FilterBar.jsx";
import InfluencerTable from "../components/InfluencerTable.jsx";
import { SkeletonTable } from "../components/Skeleton.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { getInfluencers } from "../services/api.js";

const CATEGORIES = ["Tech", "AI", "Marketing", "Business", "Design", "Finance", "Productivity", "Data"];
const PLATFORMS = ["X", "LinkedIn", "Instagram", "YouTube", "TikTok"];
const FOLLOWER_RANGES = ["< 50K", "50K – 200K", "200K – 500K", "500K+"];

function inRange(followers, range) {
  if (range === "< 50K") return followers < 50000;
  if (range === "50K – 200K") return followers >= 50000 && followers < 200000;
  if (range === "200K – 500K") return followers >= 200000 && followers < 500000;
  if (range === "500K+") return followers >= 500000;
  return true;
}

export default function Influencers() {
  const { data: influencers, loading, error, refetch } = useAsync(getInfluencers, []);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "All", platform: "All", followers: "All" });

  const categories = useMemo(() => {
    if (!influencers) return CATEGORIES;
    return [...new Set(influencers.map((i) => i.category))].sort();
  }, [influencers]);

  const filtered = useMemo(() => {
    if (!influencers) return [];
    return influencers
      .filter((i) => {
        if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.handle.toLowerCase().includes(search.toLowerCase())) return false;
        if (filters.category !== "All" && i.category !== filters.category) return false;
        if (filters.platform !== "All" && i.platform !== filters.platform) return false;
        if (filters.followers !== "All" && !inRange(i.followers, filters.followers)) return false;
        return true;
      })
      .sort((a, b) => b.influenceScore - a.influenceScore);
  }, [influencers, search, filters]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Influencer Intelligence" subtitle="Discover and rank rising creators by influence, growth, and sentiment." />
        <SkeletonTable rows={8} cols={8} />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader title="Influencer Intelligence" subtitle="Discover and rank rising creators by influence, growth, and sentiment." />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search influencers or handles…"
        filters={[
          { key: "category", label: "Category", options: categories },
          { key: "platform", label: "Platform", options: PLATFORMS },
          { key: "followers", label: "Followers", options: FOLLOWER_RANGES },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onReset={() => {
          setSearch("");
          setFilters({ category: "All", platform: "All", followers: "All" });
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No influencers match your filters" description="Try clearing filters or searching a different name." />
      ) : (
        <InfluencerTable influencers={filtered} />
      )}
    </div>
  );
}
