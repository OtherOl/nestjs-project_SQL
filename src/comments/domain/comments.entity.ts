import { createCommentModel } from '../../base/types/comments.model';
import { LikesEnum } from '../../base/types/likes.model';
import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from '../../posts/domain/posts.entity';

export class CommentatorInfo {
  userId: string;

  userLogin: string;
}

export class LikesInfo {
  likesCount: number;

  dislikesCount: number;

  myStatus: LikesEnum;
}

@Entity()
export class Comment {
  @PrimaryColumn()
  id: string;

  @Column()
  postId: string;

  @ManyToOne(() => Post, (p) => p.comments)
  @JoinColumn({ name: 'postId' })
  postsId: Post;

  @Column()
  content: string;

  @Column({ type: 'jsonb' })
  commentatorInfo: CommentatorInfo;

  @Column()
  createdAt: string;

  @Column({ type: 'jsonb' })
  likesInfo: LikesInfo;

  static createNewComment(postId: string, content: createCommentModel, userId: string, userLogin: string) {
    const comment = new Comment();

    comment.id = uuidv4();
    comment.postId = postId;
    comment.content = content.content;
    comment.commentatorInfo = { userId, userLogin };
    comment.createdAt = new Date().toISOString();
    comment.likesInfo = { likesCount: 0, dislikesCount: 0, myStatus: LikesEnum.None };

    return comment;
  }
}
