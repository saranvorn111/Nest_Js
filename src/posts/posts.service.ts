import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './extities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';

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

  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return this.postRepository.find();
  }

  async findByOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async create(createPostData: CreatePostDto): Promise<PostEntity> {
    //   if (
    //     !createPostData.title ||
    //     !createPostData.content ||
    //     !createPostData.authorName
    //   ) {
    //     throw new Error('Missing required fields: title, content, or authorName');
    //   }
    //   const newPost: Post = {
    //     id: this.getNextId(),
    //     title: createPostData.title,
    //     content: createPostData.content,
    //     authorName: createPostData.authorName,
    //     createdAt: new Date(),
    //   };

    //   this.posts.push(newPost);
    //   return newPost;
    // }

    // private getNextId(): number {
    //   return this.posts.length > 0
    //     ? Math.max(...this.posts.map((post) => post.id)) + 1
    //     : 1;
    const newPost = this.postRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      authorName: createPostData.authorName,
    });

    return this.postRepository.save(newPost);
  }

  async updatePost(id: number, updateData: UpdatePostDto): Promise<PostEntity> {
    // const currentPostIndexToEdit = this.posts.findIndex(
    //   (post) => post.id === id,
    // );
    // if (currentPostIndexToEdit === -1) {
    //   throw new NotFoundException(`Post with ID ${id} not found`);
    // }
    // const updatedPost = {
    //   ...this.posts[currentPostIndexToEdit],
    //   ...updateData,
    // };
    // this.posts[currentPostIndexToEdit] = updatedPost;
    // return updatedPost;

    const findPostToUpdate = await this.findByOne(id);
    if (!findPostToUpdate) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (updateData.content) {
      findPostToUpdate.content = updateData.content;
    }

    if (updateData.authorName) {
      findPostToUpdate.authorName = updateData.authorName;
    }

    return this.postRepository.save(findPostToUpdate);
  }

  async deletePost(id: number): Promise<void> {
    const findIdToDelete = await this.findByOne(id);
    if (!findIdToDelete) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postRepository.remove(findIdToDelete);
  }
}
