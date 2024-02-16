import { Injectable, NotFoundException } from '@nestjs/common';
import { LikesQueryRepository } from '../../likes/repositories/likes.query-repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async getCommentByIdService(id: string, userId: string) {
    const comment = await this.dataSource.query(
      `
        SELECT *
        FROM public."Comments"
        WHERE id = $1
    `,
      [id],
    );
    if (!comment[0]) throw new NotFoundException("Comment doesn't exists");

    let likeStatus = '';

    const like = await this.likesQueryRepository.getLikeByCommentId(userId, comment[0].id);
    if (!like[0]) {
      likeStatus = 'None';
    } else {
      likeStatus = like[0].type;
    }
    return {
      id: comment[0].id,
      content: comment[0].content,
      commentatorInfo: {
        userId: comment[0].commentatorInfo.userId,
        userLogin: comment[0].commentatorInfo.userLogin,
      },
      createdAt: comment[0].createdAt,
      likesInfo: {
        likesCount: comment[0].likesInfo.likesCount,
        dislikesCount: comment[0].likesInfo.dislikesCount,
        myStatus: likeStatus,
      },
    };
  }

  async getCommentById(id: string) {
    const comment = await this.dataSource.query(
      `
        SELECT *
        FROM public."Comments"
        WHERE id = $1
    `,
      [id],
    );
    if (!comment[0]) throw new NotFoundException("Comment doesn't exists");

    return {
      id: comment[0].id,
      content: comment[0].content,
      commentatorInfo: {
        userId: comment[0].commentatorInfo.userId,
        userLogin: comment[0].commentatorInfo.userLogin,
      },
      createdAt: comment[0].createdAt,
      likesInfo: {
        likesCount: comment[0].likesInfo.likesCount,
        dislikesCount: comment[0].likesInfo.dislikesCount,
        myStatus: comment[0].likesInfo.myStatus,
      },
    };
  }
}
