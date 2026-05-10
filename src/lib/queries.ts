import { useQuery } from '@tanstack/react-query';
import api from './api';

export const useProducts = (categorySlug?: string, search?: string, collection?: string) => {
  return useQuery({
    queryKey: ['products', categorySlug, search, collection],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categorySlug) params.append('category', categorySlug);
      if (search) params.append('search', search);
      if (collection) params.append('collection', collection);
      const { data } = await api.get(`/products?${params.toString()}`);
      return data;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });
};

export const useSliders = () => {
  return useQuery({
    queryKey: ['sliders'],
    queryFn: async () => {
      const { data } = await api.get('/sliders');
      return data;
    },
  });
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data } = await api.get('/brands');
      return data;
    },
  });
};

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await api.get('/blogs');
      return data.data;
    },
  });
};

export const useFaqs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data } = await api.get('/faqs');
      return data;
    },
  });
};

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data } = await api.get('/reviews');
      return data;
    },
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const { data } = await api.get('/payment-methods');
      return data;
    },
  });
};

export const useShippingZones = () => {
  return useQuery({
    queryKey: ['shippingZones'],
    queryFn: async () => {
      const { data } = await api.get('/shipping-zones');
      return data;
    },
  });
};

export const usePromotionalBanners = () => {
  return useQuery({
    queryKey: ['promotionalBanners'],
    queryFn: async () => {
      const { data } = await api.get('/promotional-banners');
      return data;
    },
  });
};

// ─── CMS Page Builder Queries ────────────────────────────────

export const useCMSHomepage = () => {
  return useQuery({
    queryKey: ['cms', 'homepage'],
    queryFn: async () => {
      const { data } = await api.get('/cms/homepage');
      return data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCMSPage = (slug: string) => {
  return useQuery({
    queryKey: ['cms', 'page', slug],
    queryFn: async () => {
      const { data } = await api.get(`/cms/pages/${slug}`);
      return data;
    },
    enabled: !!slug,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCMSSectionTypes = () => {
  return useQuery({
    queryKey: ['cms', 'sectionTypes'],
    queryFn: async () => {
      const { data } = await api.get('/cms/section-types');
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });
};

// ─── NEW: Global CMS Config Queries ─────────────────────────

export const useCMSTheme = () => {
  return useQuery({
    queryKey: ['cms', 'theme'],
    queryFn: async () => {
      const { data } = await api.get('/cms/theme');
      return data;
    },
    staleTime: 5 * 60 * 1000,   // 5 minutes — theme rarely changes
    gcTime: 30 * 60 * 1000,
  });
};

export const useCMSNavigation = (location: string = 'primary') => {
  return useQuery({
    queryKey: ['cms', 'navigation', location],
    queryFn: async () => {
      const { data } = await api.get(`/cms/navigation?location=${location}`);
      return data;
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCMSMenus = () => {
  return useQuery({
    queryKey: ['cms', 'menus'],
    queryFn: async () => {
      const { data } = await api.get('/cms/menus');
      return data;
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCMSFooter = () => {
  return useQuery({
    queryKey: ['cms', 'footer'],
    queryFn: async () => {
      const { data } = await api.get('/cms/footer');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useCMSPopups = () => {
  return useQuery({
    queryKey: ['cms', 'popups'],
    queryFn: async () => {
      const { data } = await api.get('/cms/popups');
      return data;
    },
    staleTime: 60 * 1000,
  });
};

export const useCMSAnnouncementBars = () => {
  return useQuery({
    queryKey: ['cms', 'announcementBars'],
    queryFn: async () => {
      const { data } = await api.get('/cms/announcement-bar');
      return data;
    },
    staleTime: 60 * 1000,
  });
};

export const useCMSTrackingScripts = () => {
  return useQuery({
    queryKey: ['cms', 'trackingScripts'],
    queryFn: async () => {
      const { data } = await api.get('/cms/tracking-scripts');
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Legacy menus query (now maps to CMS menus)
export const useMenus = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const { data } = await api.get('/cms/menus');
      const mapped: Record<string, any[]> = {};
      Object.values(data).forEach((menu: any) => {
        if (menu.location) {
          mapped[menu.location] = menu.items || [];
        }
      });
      return mapped;
    },
  });
};
