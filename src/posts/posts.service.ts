import {
  ConsoleLogger,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './extities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserEntity, UserRole } from 'src/auth/entities/user.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/auth/common/interfaces/pageinated-response.interface';
@Injectable()
export class PostsService {
  private postListCacheKeys: Set<string> = new Set();
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generatePostListCacheKeys(query: FindPostsQueryDto): string {
    const { page = 1, limit = 10, title } = query;
    return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
  }

  async findAll(
    query: FindPostsQueryDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    const cacheKey = this.generatePostListCacheKeys(query);

    this.postListCacheKeys.add(cacheKey);

    const getCachedData =
      await this.cacheManager.get<PaginatedResponse<PostEntity>>(cacheKey);

    if (getCachedData) {
      console.log(
        `Cache Hit ------> Returning posts list from Cache ${cacheKey}`,
      );
      return getCachedData;
    }

    console.log(`Cache Miss ----> Returing posts limit form database`);

    const { page = 1, limit = 10, title } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.authorName', 'authorName')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (title) {
      queryBuilder.andWhere('post.title ILIKE : title', {
        title: `%${title}%`,
      });
    }
    const [items, totalIte] = await queryBuilder.getManyAndCount();

    const totalPage = Math.ceil(totalIte / limit);

    const responseResult = {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        itemsPage: items.length,
        totalItem: totalIte,
        totalPage,
        isPreviousPage: page > 1,
        isNextPage: page < totalPage,
      },
    };

    await this.cacheManager.set(cacheKey, responseResult, 30000);
    return responseResult;
  }

  async findByOne(id: number): Promise<PostEntity> {
    const cachKey = `post_${id}`;
    const cachePost = await this.cacheManager.get<PostEntity>(cachKey);

    if (cachePost) {
      console.log(`Cache Hit -----> Returning post form Cache ${cachKey}`);

      return cachePost;
    }

    console.log(`Cache miss -----> Returning post`);
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['authorName'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    //stroe the post to cache
    await this.cacheManager.set(cachKey, post, 30000);
    return post;
  }

  async create(
    createPostData: CreatePostDto,
    authorName: UserEntity,
  ): Promise<PostEntity> {
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
      authorName: authorName,
    });

    await this.invalidateAllExistingListCaches();

    return this.postRepository.save(newPost);
  }

  async updatePost(
    id: number,
    updateData: UpdatePostDto,
    user: UserEntity,
  ): Promise<PostEntity> {
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
    if (
      findPostToUpdate.authorName.id !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('you can update only your own post');
    }

    // Update fields dynamically
    for (const key in updateData) {
      if (updateData[key] !== undefined) {
        findPostToUpdate[key] = updateData[key];
      }
    }

    const updatedPost = await this.postRepository.save(findPostToUpdate);
    await this.cacheManager.del(`post_${id}`);

    await this.invalidateAllExistingListCaches();

    return this.postRepository.save(findPostToUpdate);
  }

  async deletePost(id: number): Promise<void> {
    const findIdToDelete = await this.findByOne(id);
    if (!findIdToDelete) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postRepository.remove(findIdToDelete);

    await this.cacheManager.del(`post_${id}`);

    await this.invalidateAllExistingListCaches();
  }

  private async invalidateAllExistingListCaches(): Promise<void> {
    console.log(
      `Invalidateing ${this.postListCacheKeys.size} list cache entries`,
    );

    for (const key of this.postListCacheKeys) {
      await this.cacheManager.del(key);
    }

    this.postListCacheKeys.clear();
  }
}
