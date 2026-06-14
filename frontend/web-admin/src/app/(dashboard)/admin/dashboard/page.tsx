import SharedDashboard from '@/components/shared-pages/dashboard';
import { WarningCircle, Package, House, MapPin, ShieldCheck } from '@phosphor-icons/react/dist/ssr';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SharedDashboard role="owner" />
    </div>
  );
}
