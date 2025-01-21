'use server'

import { prisma } from "@/lib/prisma"

export interface StorageRequestData {
  email: string
  imageCode: string
  reason: string
}

export async function createStorageRequest(data: StorageRequestData) {
  try {
    // Validate input data
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        error: "Dữ liệu yêu cầu không hợp lệ."
      }
    }

    // Validate required fields
    if (!data.email || !data.imageCode || !data.reason) {
      return {
        success: false,
        error: "Vui lòng điền đầy đủ các trường bắt buộc."
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: "Email không hợp lệ."
      }
    }

    const request = await prisma.storageRequest.create({
      data: {
        email: data.email.toLowerCase(),
        imageCode: data.imageCode,
        reason: data.reason,
        status: 'PENDING',
      }
    })
    
    if (!request) {
      throw new Error('Failed to create storage request')
    }

    return { 
      success: true, 
      data: request 
    }
  } catch (error) {
    console.error('Error creating storage request:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể gửi yêu cầu. Vui lòng thử lại.' 
    }
  }
}