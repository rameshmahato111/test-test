import React from 'react';
import Link from 'next/link';

import Extras from '@/services/api/extras';
import AsyncDataWrapper from '../StateHandlers/AsyncDataWrapper';

const BlogSection = async () => {
    return (
        <section className="px-4 md:px-8 lg:px-10 mt-16">
            <div className="">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-3xl font-semibold text-foreground transform transition-all duration-500 hover:scale-105">
                        Latest Blogs
                    </h2>
                    <Link
                        target="_blank"
                        prefetch={false}
                        href={`https://exploreden.com.au/blog`}
                        className="text-base font-medium hover:text-primary-400/80 transition-all duration-300 text-primary-400 transform hover:scale-100 hover:translate-x-1"
                    >
                        See all
                    </Link>
                </div>
                <AsyncDataWrapper
                    fetchData={Extras.getBlogs}
                    loadingComponent={<ShimmerBlogCard />}
                        isEmpty={(blogs) => !blogs || blogs.length === 0}
                    emptyMessage="No blogs available at the moment"
                    errorMessage="Unable To Get Blogs"
                >
                        {(blogs) => (
                            <div className="grid grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {blogs && blogs.map((blog, index) => (
                                    <a
                                        key={blog.link}
                                        className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-out hover:shadow-xl hover:shadow-primary-400/20 transform hover:-translate-y-3 hover:scale-105 cursor-pointer opacity-0 animate-fade-in-up"
                                        target="_blank"
                                        href={blog.link}
                                        style={{
                                            animationDelay: `${index * 150}ms`,
                                            animationFillMode: 'both',
                                            animation: 'fadeInUp 0.6s ease-out forwards'
                                        }}
                                    >
                                        <article className="h-full flex flex-col">
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <img
                                                    src={blog.image}
                                                    alt={blog.title?.rendered}
                                                    className="object-cover w-full h-full transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 transform transition-all duration-300 group-hover:text-primary-400">
                                                    <span className="bg-gray-100 px-2 py-1 rounded-full group-hover:bg-primary-50 transition-colors duration-300">
                                                        {blog.date?.split('T')[0]}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-primary-600">
                                                    {blog.title?.rendered}
                                                </h3>
                                                <p className="text-gray-600 line-clamp-3 flex-1 transition-colors duration-300 group-hover:text-gray-700"
                                                    dangerouslySetInnerHTML={{ __html: blog.excerpt?.rendered }}
                                                />
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="inline-flex items-center text-primary-400 font-medium group-hover:text-primary-600 transition-colors duration-300">
                                                        Read More
                                                        <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </a>
                                ))}
                            </div>
                        )}
                </AsyncDataWrapper>
            </div>
        </section>
    );
};

export default BlogSection;

const ShimmerBlogCard = () => {
    return (
        <div className="grid grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="bg-gray-200 animate-pulse rounded-lg overflow-hidden opacity-0"
                    style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                >
                    <div className="h-48 w-full bg-gray-300"></div>
                    <div className="p-6 space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded"></div>
                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
