import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  HeroSection,
  FeaturedCourses,
  CategoriesSection,
  TestimonialsSection,
  CTASection,
} from '../components/home';
import { Course, Category } from '../types';
import { fetchCourseCategories, getAllCourses } from '../services/operations/courseDetailsAPI';
import { addToCart as addToCartAPI } from '../services/operations/cartAPI';
import { addToCart } from '../slices/cartSlice';
import { getWishlist, toggleWishlist } from '../services/operations/wishlistAPI';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlistedCourses, setWishlistedCourses] = useState<string[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { token } = useSelector((state: any) => state.auth || {});
  //@ts-ignore
  const { cart } = useSelector((state: any) => state.cart || { cart: [] });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        setCourses(Array.isArray(response) ? response : []);
        setIsLoadingCourses(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setIsLoadingCourses(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetchCourseCategories();
        setCategories(Array.isArray(response) ? response : []);
        setIsLoadingCategories(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoadingCategories(false);
      }
    };

    const fetchWishlistData = async () => {
      if (!token) {
        setWishlistedCourses([]);
        return;
      }

      try {
        const response = await getWishlist(token);
        const wishlistRaw =
          response?.data?.wishlist ||
          response?.wishlist ||
          response?.data ||
          [];

        const wishlistIds = Array.isArray(wishlistRaw)
          ? wishlistRaw.map((item: any) => item?._id || item?.course?._id || item?.courseId).filter(Boolean)
          : [];

        setWishlistedCourses(wishlistIds);
      } catch (error) {
        setWishlistedCourses([]);
      }
    };

    fetchCourses();
    fetchCategories();
    fetchWishlistData();
  }, [token]);

  const handleAddToCart = async (courseId: string) => {
    if (!token) {
      toast.error('Please login to add courses to cart');
      return;
    }

    // Check if course is already in cart
    const isInCart = cart?.some((course: any) => course._id === courseId);
    if (isInCart) {
      toast.error('Course is already in cart');
      return;
    }

    if (addingToCart) {
      return; // Prevent multiple simultaneous requests
    }

    setAddingToCart(courseId);
    try {
      const response = await addToCartAPI(courseId, token);
      // Use the cart data from backend response
      if (response?.cart?.courses) {
        const { setCart } = await import('../slices/cartSlice');
        dispatch(setCart(response.cart.courses));
        toast.success('Course added to cart');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to add course to cart';
      console.error('Add to cart error:', errorMessage);
      console.error('Full error:', error?.response?.data);
      toast.error(errorMessage);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleWishlistToggle = async (courseId: string) => {
    if (!token) {
      toast.error('Please login to manage wishlist');
      return;
    }

    try {
      await toggleWishlist(courseId, token);
      setWishlistedCourses((prev) =>
        prev.includes(courseId)
          ? prev.filter((id) => id !== courseId)
          : [...prev, courseId]
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Courses */}
      <FeaturedCourses
        courses={courses}
        isLoading={isLoadingCourses}
        onAddToCart={handleAddToCart}
        onWishlistToggle={handleWishlistToggle}
          wishlistedCourses={wishlistedCourses}
      />

      {/* Categories Section */}
      <CategoriesSection
        categories={categories}
        isLoading={isLoadingCategories}
      />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
};

export default Home;
