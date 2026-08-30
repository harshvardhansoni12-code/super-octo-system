import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Create a new service for a service provider
 */
export async function createService(serviceProviderId, data) {
  try {
    const {
      name,
      description,
      type,
      prices,
      availableFrom,
      availableTo,
      imageUrl,
    } = data;

    // Validate required fields
    if (!name || !type) {
      return {
        error: "Service name and type are required",
        status: 400,
      };
    }

    // Verify the service provider exists
    const serviceProvider = await prisma.serviceProvider.findUnique({
      where: { id: serviceProviderId },
    });

    if (!serviceProvider) {
      return {
        error: "Service provider not found",
        status: 404,
      };
    }

    // Create the service
    const service = await prisma.service.create({
      data: {
        name,
        type,
        prices: prices ? parseFloat(prices) : null,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        availableTo: availableTo ? new Date(availableTo) : null,
        imageUrl: imageUrl || null,
        serviceProviderId,
      },
    });

    return {
      data: service,
      status: 201,
    };
  } catch (error) {
    console.error("Create service error:", error);
    return {
      error: error.message || "Failed to create service",
      status: 500,
    };
  }
}

/**
 * Get all services for a service provider
 */
export async function getServiceProviderServices(serviceProviderId) {
  try {
    // Verify the service provider exists
    const serviceProvider = await prisma.serviceProvider.findUnique({
      where: { id: serviceProviderId },
    });

    if (!serviceProvider) {
      return {
        error: "Service provider not found",
        status: 404,
      };
    }

    // Get all services for this provider
    const services = await prisma.service.findMany({
      where: { serviceProviderId },
      orderBy: { createdAt: "desc" },
    });

    return {
      data: services,
      status: 200,
    };
  } catch (error) {
    console.error("Get services error:", error);
    return {
      error: error.message || "Failed to fetch services",
      status: 500,
    };
  }
}

/**
 * Update a service for a service provider
 */
export async function updateService(serviceProviderId, serviceId, data) {
  try {
    const {
      name,
      description,
      type,
      prices,
      availableFrom,
      availableTo,
      imageUrl,
    } = data;

    // Verify the service exists and belongs to this service provider
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return {
        error: "Service not found",
        status: 404,
      };
    }

    if (service.serviceProviderId !== serviceProviderId) {
      return {
        error: "Unauthorized: This service does not belong to you",
        status: 403,
      };
    }

    // Update the service
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(description && { description }),
        ...(prices !== undefined && {
          prices: prices ? parseFloat(prices) : null,
        }),
        ...(availableFrom && { availableFrom: new Date(availableFrom) }),
        ...(availableTo && { availableTo: new Date(availableTo) }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      },
    });

    return {
      data: updatedService,
      status: 200,
    };
  } catch (error) {
    console.error("Update service error:", error);
    return {
      error: error.message || "Failed to update service",
      status: 500,
    };
  }
}

/**
 * Delete a service for a service provider
 */
export async function deleteService(serviceProviderId, serviceId) {
  try {
    // Verify the service exists and belongs to this service provider
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return {
        error: "Service not found",
        status: 404,
      };
    }

    if (service.serviceProviderId !== serviceProviderId) {
      return {
        error: "Unauthorized: This service does not belong to you",
        status: 403,
      };
    }

    // Delete the service
    const deletedService = await prisma.service.delete({
      where: { id: serviceId },
    });

    return {
      data: deletedService,
      status: 200,
    };
  } catch (error) {
    console.error("Delete service error:", error);
    return {
      error: error.message || "Failed to delete service",
      status: 500,
    };
  }
}

/**
 * Get a single service by ID
 */
export async function getServiceById(serviceProviderId, serviceId) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { serviceProvider: true },
    });

    if (!service) {
      return {
        error: "Service not found",
        status: 404,
      };
    }

    // Verify the service belongs to this provider
    if (service.serviceProviderId !== serviceProviderId) {
      return {
        error: "Unauthorized: This service does not belong to you",
        status: 403,
      };
    }

    return {
      data: service,
      status: 200,
    };
  } catch (error) {
    console.error("Get service error:", error);
    return {
      error: error.message || "Failed to fetch service",
      status: 500,
    };
  }
}
