import { createBlogModel } from '../../base/types/blogs.model';
import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  createdAt: string;

  @Column()
  isMembership: boolean;

  static createNewBlog(inputData: createBlogModel) {
    const blog = new Blog();

    blog.id = uuidv4();
    blog.name = inputData.name;
    blog.description = inputData.description;
    blog.websiteUrl = inputData.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;

    return blog;
  }
}
