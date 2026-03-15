import { StatsCard } from "@/components/ui/stats-card";

export type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  className?: string;
};

export function StatCard(props: StatCardProps) {
  return <StatsCard {...props} />;
}