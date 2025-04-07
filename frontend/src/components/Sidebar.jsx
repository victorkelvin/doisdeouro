import { Users, BookOpen, UserCog, ClipboardList, Trophy } from "lucide-react"; 
import { NavLink } from "react-router-dom"; // Import NavLink for routing
import LogoAcademia from "./LogoAcademia";
import { useSidebar } from "../contexts/SidebarContext";
import { cn } from "../utils/utils";

const sidebarItems = [
  {
    title: "Alunos",
    icon: Users,
    href: "alunos", 
  },
  {
    title: "Turmas",
    icon: BookOpen,
    href: "turmas", 
  },
  {
    title: "Instrutores",
    icon: UserCog,
    href: "instrutores", 
  },
  {
    title: "Aulas",
    icon: ClipboardList,
    href: "aulas", 
  },
  {
    title: "Graduações",
    icon: Trophy,
    href: "graduacoes", 
  },
];

function Sidebar({ selectedDashboard, setSelectedDashboard }) { 
  const { isSidebarOpen, isMobile, isCollapsed } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && <div className={cn("sidebar-overlay", isSidebarOpen ? "open" : "")} />}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          "sidebar bg-[hsl(221,59%,15%)] text-white flex flex-col h-screen",
          isMobile ? (isSidebarOpen ? "open" : "") : "",
          !isMobile && isCollapsed ? "sidebar-collapsed" : "",
        )}
        aria-label="Sidebar Navigation"
      >
        {/* Header */}
        <div className="border-b border-sidebar-border p-2" style={{ height: 4 + 'rem' }}>
          <div className="flex items-center justify-center">
            <LogoAcademia showText={!isCollapsed} />
          </div>
        </div>

        {/* Content */}
        <div className="sidebar-content flex-1 overflow-y-auto">
          <div className="p-2">
            <div
              className={cn(
                "text-xs font-medium text-white/70 px-2 h-8 flex items-center",
                isCollapsed ? "justify-center" : "",
              )}
            >
              {!isCollapsed && "Menu"}
            </div>
            <nav className="mt-2 space-y-1">
              {sidebarItems.map((item) => (
                <NavLink
                key={item.title}
                onClick={() => setSelectedDashboard(item.href)} // Set the selected dashboard
                className={() => {
                  const className = cn(
                    "flex items-center gap-2 rounded-md px-2 py-2 text-sm" +
                    (selectedDashboard === item.href ? " nav-link-active" : " hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")
                  );
                  return className;
                }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
