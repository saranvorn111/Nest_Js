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
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './extities/post.entity';
// import { ValidationPipe } from 'src/cats/validation/validation.pipe';
// import { HttpExceptionFilter } from 'src/auth/exception-filter/http-exception.filter';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  // @Get()
  // findAndQuery(@Query('search') search?: string): PostInterface[] {
  //   const extractAllPost = this.postsService.findAll();
  //   if (search) {
  //     return extractAllPost.filter((singlePost) =>
  //       singlePost.title
  //         .toLocaleLowerCase()
  //         .includes(search.toLocaleLowerCase()),
  //     );
  //   }
  //   return extractAllPost;
  // }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findByOne(id);
    return post;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() createPostData: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostData);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.postsService.deletePost(id);
  }
}
