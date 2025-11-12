import { useState, ReactNode } from "react";

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
}

export default function SidebarLinkGroup({ children, activeCondition }: SidebarLinkGroupProps) {
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => setOpen((prev) => !prev);

  return <li>{children(handleClick, open)}</li>;
}
