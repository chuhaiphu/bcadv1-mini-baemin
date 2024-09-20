import { ReviewDto } from './../_dtos/review.dto'
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/_guards/role.guard'
import { Roles } from 'src/_guards/role.decorator'
import { ReviewService } from './review.service'

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) { }

  @ApiTags('Review')
  @Get()
  findAllReviews() {
    return this.reviewService.findAllReviews()
  }

  @ApiTags('Review')
  @Get('by-id')
  findReviewById(@Query('id') id: string) {
    return this.reviewService.findReviewById(Number(id))
  }

  @ApiTags('Review')
  @UseGuards(AuthGuard("jwt-token-strat"))
  @Post('add')
  addReview(
    @Request() req: { user: { userId: any, email: any, role: any } },
    @Body() reviewData: ReviewDto
  ) {
    return this.reviewService.addReview(req.user.userId, reviewData)
  }

  @ApiTags('Review')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["USER"])
  @Put('update/:id')
  updateReview(
    @Param('id') id: string,
    @Request() req: { user: { userId: any, email: any, role: any } },
    @Body() reviewData: ReviewDto
  ) {
    return this.reviewService.updateReview(Number(id), req.user.userId, reviewData)
  }

  @ApiTags('Review')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["USER"])
  @Delete('delete/:id')
  deleteReview(@Param('id') id: string, @Request() req: { user: { userId: any, email: any, role: any } }) {
    return this.reviewService.deleteReview(Number(id), req.user.userId)
  }
}
