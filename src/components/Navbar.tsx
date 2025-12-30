import { NavLink } from 'react-router-dom';
import { Wrench, Github } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const navItems = [
    { name: '集合运算', path: '/' },
    // Future tools can be added here
    // { name: 'JSON 格式化', path: '/json' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center px-4 md:px-8">
        <div className="mr-4 flex">
          <NavLink to="/" className="mr-6 flex items-center space-x-2">
            <Wrench className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              FastTools
            </span>
          </NavLink>
          <div className="flex gap-6 md:gap-10">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    isActive ? "text-foreground" : "text-foreground/60"
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 px-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
        </div>
      </div>
    </nav>
  );
}
