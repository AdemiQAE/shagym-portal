import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`header-logo ${className}`}>
      <span className="header-logo-mark">
        <Icon name="logo" size={20} />
      </span>
      <span className="header-logo-text">Шағым</span>
    </Link>
  );
}
