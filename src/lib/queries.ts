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
      return data; // returning the whole response to handle pagination in component
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
      return data.data; // assuming paginated
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
    staleTime: 30 * 1000, // Cache for 30 seconds (better for live editing)
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

export const useMenus = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const { data } = await api.get('/menus');
      // Map menus by location for easier access: { [location]: items[] }
      const mapped: Record<string, any[]> = {};
      data.forEach((menu: any) => {
        if (menu.location) {
          mapped[menu.location] = menu.items || [];
        }
      });
      return mapped;
    },
  });
};

