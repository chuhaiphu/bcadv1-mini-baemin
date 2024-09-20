import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ReviewDto } from 'src/_dtos/review.dto'

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async findAllReviews() {
    return this.prisma.review.findMany({
      include: { Shop: true, User: true }
    })
  }

  async findReviewById(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { ID: id },
      include: { Shop: true, User: true }
    })
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`)
    }
    return review
  }

  async addReview(userId: number, reviewData: ReviewDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { ID: reviewData.SHOP_ID }
    })
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${reviewData.SHOP_ID} not found`)
    }
    const user = await this.prisma.user.findUnique({
      where: { ID: userId }
    })

    return this.prisma.review.create({
      data: {
        ...reviewData,
        USER_ID: userId,
        SHOP_ID: reviewData.SHOP_ID
      }
    })
  }
  
  async updateReview(reviewId: number, userId: number, reviewData: ReviewDto) {
    const existingReview = await this.prisma.review.findUnique({
      where: { ID: reviewId }
    })
    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`)
    }
    if (existingReview.USER_ID !== userId) {
      throw new ForbiddenException('You are not authorized to update this review')
    }
    return this.prisma.review.update({
      where: { ID: reviewId },
      data: {
        ...reviewData,
        UPDATE_AT: new Date(),
      },
    })
  }
  

  async deleteReview(reviewId: number, userId: number) {
    const existingReview = await this.prisma.review.findUnique({
      where: { ID: reviewId }
    })
    if (!existingReview) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`)
    }
    if (existingReview.USER_ID !== userId) {
      throw new ForbiddenException('You are not authorized to delete this review')
    }
    return this.prisma.review.delete({
      where: { ID: reviewId },
    })
  }
}
