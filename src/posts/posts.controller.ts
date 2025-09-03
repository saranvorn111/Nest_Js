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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import type { Post as PostInterface } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //   @Get()
  //   findAll() {
  //     return this.postsService.findAll();
  //   }

  @Get()
  findAndQuery(@Query('search') search?: string): PostInterface[] {
    const extractAllPost = this.postsService.findAll();
    if (search) {
      return extractAllPost.filter((singlePost) =>
        singlePost.title
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()),
      );
    }
    return extractAllPost;
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): PostInterface {
    return this.postsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  createPost(@Body() createPostData: CreatePostDto): PostInterface {
    return this.postsService.create(createPostData);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdatePostDto,
  ): PostInterface {
    return this.postsService.updatePost(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.postsService.deletePost(id);
  }
}
