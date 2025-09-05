'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Bell, Users, Shield, Settings, Home } from 'lucide-react';
import useUser from '@/hooks/useUser';
import Loader from '@/components/Loader';

const adminPages = [
  {
    href: '/admin/notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Manage system notifications'
  },
  {
    href: '/admin/users',
    label: 'User Management',
    icon: Users,
    description: 'Manage user roles and permissions'
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/');
        return;
      }

      if (user.role !== 'admin') {
        router.push('/');
        return;
      }

      setIsAuthorized(true);
    }
  }, [user, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Admin Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-muted-foreground">Manage your application with advanced controls</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild className="space-x-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                <span>Back to App</span>
              </Link>
            </Button>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          </div>
        </div>

        {/* Admin Navigation */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Quick Navigation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {adminPages.map((page) => {
                const Icon = page.icon;
                const isActive = pathname === page.href;
                return (
                  <Button
                    key={page.href}
                    variant={isActive ? 'default' : 'outline'}
                    asChild
                    className={`h-auto p-4 justify-start ${isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
                      : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20'
                    }`}
                  >
                    <Link href={page.href} className="flex items-center space-x-3 w-full">
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">{page.label}</div>
                        <div className={`text-sm ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {page.description}
                        </div>
                      </div>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Page Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
