"use server";

import client from "@/prisma";

export const postBlog = async ({
  titleEn,
  titleBn,
  contentEn,
  contentBn,
  categoryEn,
  categoryBn,
  mediaId,
  status,
  scheduledAt,
}: {
  titleEn: string;
  titleBn: string;
  contentEn: string;
  contentBn: string;
  categoryEn?: string;
  categoryBn?: string;
  mediaId?: string;
  status: "PUBLISHED" | "PRIVATE" | "SCHEDULED";
  scheduledAt?: Date;
}) => {
  try {
    const slugEn = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slugBn = titleBn.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const blog = await client.blog.create({
      data: {
        titleEn,
        titleBn,
        slugEn,
        slugBn,
        contentEn,
        contentBn,
        categoryEn,
        categoryBn,
        mediaId,
        status,
        scheduledAt,
      },
    });
    return blog;
  } catch (error) {
    throw new Error(`Failed to create blog: ${error}`);
  }
};

export const getAllBlogs = async () => {
  try {
    const blogs = await client.blog.findMany({
      include: {
        media: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return blogs;
  } catch (error) {
    throw new Error(`Failed to fetch blogs: ${error}`);
  }
};

// Add this function to check and publish scheduled blogs
export const publishScheduledBlogs = async () => {
  try {
    // Find all scheduled blogs that should be published
    const scheduledBlogs = await client.blog.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: new Date(),
        },
      },
    });

    // Update all found blogs to PUBLISHED
    for (const blog of scheduledBlogs) {
      await client.blog.update({
        where: { id: blog.id },
        data: {
          status: "PUBLISHED",
        },
      });
    }
  } catch (error) {
    console.error("Failed to publish scheduled blogs:", error);
  }
};

export const deleteBlog = async (id: string) => {
  try {
    await client.blog.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    throw new Error(`Failed to delete blog: ${error}`);
  }
};

export const updateBlog = async ({
  id,
  titleEn,
  titleBn,
  contentEn,
  contentBn,
  categoryEn,
  categoryBn,
  mediaId,
  status,
  scheduledAt,
}: {
  id: string;
  titleEn?: string;
  titleBn?: string;
  contentEn?: string;
  contentBn?: string;
  categoryEn?: string;
  categoryBn?: string;
  mediaId?: string;
  status?: "PUBLISHED" | "PRIVATE" | "SCHEDULED";
  scheduledAt?: Date | null;
}) => {
  try {
    const data: any = {};
    if (titleEn) {
      data.titleEn = titleEn;
      data.slugEn = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    if (titleBn) {
      data.titleBn = titleBn;
      data.slugBn = titleBn.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    if (contentEn) data.contentEn = contentEn;
    if (contentBn) data.contentBn = contentBn;
    if (categoryEn) data.categoryEn = categoryEn;
    if (categoryBn) data.categoryBn = categoryBn;
    if (mediaId !== undefined) data.mediaId = mediaId;
    if (status) data.status = status;
    if (scheduledAt !== undefined) data.scheduledAt = scheduledAt;

    return await client.blog.update({
      where: { id },
      data,
      include: {
        media: true,
      },
    });
  } catch (error) {
    throw new Error(`Failed to update blog: ${error}`);
  }
};
