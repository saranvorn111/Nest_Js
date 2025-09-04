import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PostsService } from '../posts.service';

@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor(private readonly postService: PostsService) {}

  async transform(value: number, metadata: ArgumentMetadata) {
    const post = await this.postService.findByOne(value);
    if (!post) {
      throw new NotFoundException(
        `Post with ID ${value} not found is a object`,
      );
    }
    return post;
  }
}
