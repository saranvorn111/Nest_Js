import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'first',
      content: 'This is the first post',
      authorName: 'Saran',
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'second',
      content: 'This is the second post',
      authorName: 'Saran1',
      createdAt: new Date(),
    },
  ];

  findAll(): Post[] {
    return this.posts;
  }

  findById(id: number): Post {
    const singlePost = this.posts.find((post) => post.id === id);
    console.log('singlePost in service:', singlePost);
    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    console.log('singlePost:', singlePost);
    return singlePost;
  }

  create(createPostData: CreatePostDto): Post {
    if (
      !createPostData.title ||
      !createPostData.content ||
      !createPostData.authorName
    ) {
      throw new Error('Missing required fields: title, content, or authorName');
    }
    const newPost: Post = {
      id: this.getNextId(),
      title: createPostData.title,
      content: createPostData.content,
      authorName: createPostData.authorName,
      createdAt: new Date(),
    };

    this.posts.push(newPost);
    return newPost;
  }

  private getNextId(): number {
    return this.posts.length > 0
      ? Math.max(...this.posts.map((post) => post.id)) + 1
      : 1;
  }

  updatePost(id: number, updateData: Partial<CreatePostDto>): Post {
    const currentPostIndexToEdit = this.posts.findIndex(
      (post) => post.id === id,
    );
    if (currentPostIndexToEdit === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    const updatedPost = {
      ...this.posts[currentPostIndexToEdit],
      ...updateData,
    };
    this.posts[currentPostIndexToEdit] = updatedPost;
    return updatedPost;
  }

  deletePost(id: number): { message: string } {
    const currentPostIndexToEdit = this.posts.findIndex(
      (post) => post.id === id,
    );
    if (currentPostIndexToEdit === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.posts.splice(currentPostIndexToEdit, 1);
    return { message: `Post with ID ${id} has been deleted` };
  }
}
