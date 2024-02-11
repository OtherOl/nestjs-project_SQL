import { createBlogModel } from '../../base/types/blogs.model';
import { v4 as uuidv4 } from 'uuid';

export class Blog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
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
