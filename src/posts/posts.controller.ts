import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './extities/post.entity';
import { UserEntity, UserRole } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { use } from 'passport';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/auth/common/interfaces/pageinated-response.interface';
// import { ValidationPipe } from 'src/cats/validation/validation.pipe';
// import { HttpExceptionFilter } from 'src/auth/exception-filter/http-exception.filter';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(
    @Query() query: FindPostsQueryDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findByOne(id);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @Body() createPostData: CreatePostDto,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.create(createPostData, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdatePostDto,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, updateData, user);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.postsService.deletePost(id);
  }
}
