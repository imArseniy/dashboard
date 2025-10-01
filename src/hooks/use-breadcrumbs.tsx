'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Это также позволяет добавить собственный заголовок
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Обзор', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Дашборд', link: '/dashboard' },
    { title: 'Платежи', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Дашборд', link: '/dashboard' },
    { title: 'Товары', link: '/dashboard/product' }
  ],
  '/dashboard/overview': [
    { title: 'Дашборд', link: '/dashboard' },
    { title: 'Обзор', link: '/dashboard/overview' }
  ]
  // При необходимости добавьте больше пользовательских сопоставлений
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Проверяем, есть ли у нас пользовательское сопоставление для этого точного пути
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // Если точного совпадения нет, возвращаемся к созданию хлебных крошек из пути
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
