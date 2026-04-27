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

export const useMenus = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const { data } = await api.get('/menus');
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
