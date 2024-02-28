import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blogs.entity';

export class LikesInfo {
  likesCount: number;

  dislikesCount: number;

  myStatus: string;

  newestLikes: [];
}

@Entity()
export class Post {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column()
  blogId: string;

  @ManyToOne(() => Blog, (b) => b.posts)
  @JoinColumn({ name: 'blogId' })
  blogsId: Blog;

  @Column()
  blogName: string;

  // @ManyToOne(() => Blog, (b) => b.posts)
  // @JoinColumn({ name: 'blogName' })
  // blogsName: Blog;

  @Column()
  createdAt: string;

  @Column({ type: 'jsonb' })
  extendedLikesInfo: LikesInfo;

  static createNewPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ) {
    const post = new Post();

    post.id = uuidv4();
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = blogId;
    post.blogName = blogName;
    post.createdAt = new Date().toISOString();
    post.extendedLikesInfo = { likesCount: 0, dislikesCount: 0, myStatus: 'None', newestLikes: [] };

    return post;
  }
}
