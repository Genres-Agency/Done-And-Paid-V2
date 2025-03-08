"use server";

import prisma from "@/prisma";

export const createService = async ({
  titleEn,
  titleBn,
  descriptionEn,
  descriptionBn,
  price,
  mediaId,
  status,
}: {
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  duration: string;
  mediaId?: string | null;
  status: "PUBLISHED" | "PRIVATE";
}) => {
  try {
    const service = await prisma.service.create({
      data: {
        titleEn,
        titleBn,
        descriptionEn,
        descriptionBn,
        price,
        duration,
        mediaId,
        status,
      },
    });
    return service;
  } catch (error) {
    throw new Error(`Failed to create service: ${error}`);
  }
};

export const getServices = async () => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        media: true,
      },
    });
    return services;
  } catch (error) {
    throw new Error(`Failed to fetch services: ${error}`);
  }
};

export const getService = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Service ID is required");
    }

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        media: true,
      },
    });

    if (!service) {
      throw new Error("Service not found with the provided ID");
    }

    return service;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch service: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while fetching the service");
  }
};

export const updateService = async (
  id: string,
  data: {
    titleEn?: string;
    titleBn?: string;
    descriptionEn?: string;
    descriptionBn?: string;
    price?: number;
    duration?: string;
    mediaId?: string | null;
    status?: "PUBLISHED" | "PRIVATE";
  }
) => {
  try {
    const service = await prisma.service.update({
      where: { id },
      data,
      include: {
        media: true,
      },
    });
    return service;
  } catch (error) {
    throw new Error(`Failed to update service: ${error}`);
  }
};

export const deleteService = async (id: string) => {
  try {
    await prisma.service.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete Service: ${error}`);
  }
};
